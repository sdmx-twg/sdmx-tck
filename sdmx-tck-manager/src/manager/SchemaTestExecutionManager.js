const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const DSD_COMPONENTS_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_NAMES;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var SchemaRequestBuilder = require('../builders/SchemaRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');
var HelperManager = require('../manager/HelperManager.js')
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
const sdmx_requestor = require('sdmx-rest');
const {UrlGenerator} = require('sdmx-rest/lib/utils/url-generator')

class SchemaTestExecutionManager {
    static async executeTest(toRun, apiVersion, endpoint) {
        let testResult = toRun;
        try {
            /////PREPARING AND SENDING THE TEST REQUEST/////
            testResult.startTime = new Date();
            console.log("Test: " + toRun.testId + " started on " + testResult.startTime);
            
            //IF NO IDENTIFIERS WERE FOUND IN TESTS THEN ERROR IS THROWN
            if(toRun.identifiers.structureType === "" && toRun.identifiers.agency === "" && toRun.identifiers.id === "" && toRun.identifiers.version === ""){
                throw new TckError("Identifiers Missing either because there is no constraint constraining a "+testResult.resource+
                                    " or there were no content constraints found at all.")
            }
            //GET STRUCTURE WORKSPACE (NEEDED IN XSD WORKSPACE VALIDATION PROCESS)
            let template = toRun.reqTemplate;
            if(toRun.resource === (SDMX_STRUCTURE_TYPE.DSD.getClass().toLowerCase())){
                template.references = STRUCTURE_REFERENCE_DETAIL.CHILDREN;
            }else if(toRun.resource === (SDMX_STRUCTURE_TYPE.DATAFLOW.getClass().toLowerCase())){
                template.references = STRUCTURE_REFERENCE_DETAIL.DESCENDANTS;
            }else if(toRun.resource === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.getClass().toLowerCase()){
                template.references = STRUCTURE_REFERENCE_DETAIL.DESCENDANTS;
            }

            let helpTestParams = {
                testId: "/"+toRun.resource+"/agency/id/version?references="+template.references,
                index: TEST_INDEX.Structure,
                apiVersion: apiVersion,
                resource: toRun.resource,
                reqTemplate: template,
                identifiers: {structureType:SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource),agency:toRun.identifiers.agency,id:toRun.identifiers.id,version:toRun.identifiers.version},
                testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS
            }
            toRun.structureWorkspace = await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(helpTestParams),apiVersion,endpoint);
            
            let structureType = helpTestParams.identifiers.structureType
            let agency = helpTestParams.identifiers.agency
            let id = helpTestParams.identifiers.id
            //TODO: Change the solution because,getSdmxObjectsWithCriteria does not guarantee a single artefact to be returned when the version is not defined.
            

            // WORKAROUND - Until a better solution is found.
            // Because the version is extracted from the request it can contain values such as 'latest', 'all'. 
            // In case of 'latest' we check if the workspace contains exactly one structure 
            // but the problem here is that the version of the returned structure is not known beforehand 
            // and the workspace cannot be filtered using the 'latest' for the structure version.

            let version = (template.version && template.version === "latest")?null:helpTestParams.identifiers.version
            let dsdObj = toRun.structureWorkspace.getDSDObjectForXSDTests(structureType,agency,id,version)
            toRun.dsdObject = dsdObj
            //CHECK IF DSD HAS MEASURE DIMENSION BECAUSE IF IT IS NEEDED IN THE TEST QUERY, THE TEST CANNOT BE PERFORMED
            if(toRun.reqTemplate.explicitMeasure && !dsdObj.getComponents().find(component => component.getType() === DSD_COMPONENTS_NAMES.MEASURE_DIMENSION)){
                throw new TckError("Test cannot be executed because the DSD does not have a MEASURE DIMENSION");
            }

            //IF THE TEST IS "schema/resource/agency/id/version?dimensionAtObservation = dimensionId" we need to get from DSD a dimension id cause
            //we do not have this information beforehand.
            if(toRun.reqTemplate.dimensionAtObservation 
                && toRun.reqTemplate.dimensionAtObservation!=="AllDimensions"){
                if(!dsdObj){
                    throw new TckError("Unable to get structure workspace.")
                }
                let dsdRandomDimension = dsdObj.getRandomDimension();
                if(!dsdRandomDimension){
                    throw new TckError("No dimensions available in order to perform this test.")
                }
                toRun.reqTemplate.dimensionAtObservation = dsdRandomDimension.getId()
            }

            //PREPARE REQUEST
            let preparedRequest = await SchemaRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                toRun.identifiers.agency, toRun.identifiers.id, 
                toRun.identifiers.version,toRun.reqTemplate.dimensionAtObservation,toRun.reqTemplate.explicitMeasure );

            console.log("Test: " + toRun.testId + " HTTP request prepared." + JSON.stringify(preparedRequest));
            //Alternative way to pass the url generated as string in order to configure the skipDefaults parameter.
            let url = new UrlGenerator().getUrl(preparedRequest.request, preparedRequest.service, true)
            let httpResponse = await sdmx_requestor.request2(url, preparedRequest.headers);
            //let httpResponse = await sdmx_requestor.request2(preparedRequest.request, preparedRequest.service, preparedRequest.headers);
            console.log("Test: " + toRun.testId + " HTTP response received.");

            //// HTTP RESPONSE VALIDATION ////
            let httpResponseValidation = null;
            if (toRun.testType === TEST_TYPE.STRUCTURE_QUERY_REPRESENTATION) {
                httpResponseValidation = await ResponseValidator.validateRepresentation(toRun.reqTemplate.representation, httpResponse);
            } else {
                httpResponseValidation = await ResponseValidator.validateHttpResponse(preparedRequest.request, httpResponse);
            }
            testResult.httpResponseValidation = httpResponseValidation;
            console.log("Test: " + toRun.testId + " HTTP response validated. " + JSON.stringify(httpResponseValidation));
            if (httpResponseValidation.status === FAILURE_CODE) {
                throw new TckError("HTTP validation failed. Cause: " + httpResponseValidation.error);
            }

            //XSD VALIDATION
            let xsdString = await httpResponse.text();
            await new SdmxXmlParser().schemaValidation(xsdString);
            console.log("Test: " + toRun.testId + " Response (XSD) validated.");

           
            //// WORKSPACE CREATION ////
            let workspace = await new SdmxXmlParser().getIMObjects(xsdString);
            testResult.workspace = workspace;
            console.log("Test: " + toRun.testId + " SDMX workspace created.");
            
            
            // WORKSPACE VALIDATION
            let workspaceValidation = await SemanticCheckerFactory.getChecker(toRun).checkWorkspace(toRun, preparedRequest, workspace);
            testResult.workspaceValidation = workspaceValidation;
            if (workspaceValidation.status === FAILURE_CODE) {
                throw new TckError("Workspace validation failed: Cause: " + workspaceValidation.error);
            }
            
        } catch (err) {
            testResult.failReason = err.toString();
        } finally {
            testResult.endTime = new Date();
            console.log("Test: " + toRun.testId + " completed on " + testResult.endTime);
        }
        return testResult;
    }
};

module.exports = SchemaTestExecutionManager;