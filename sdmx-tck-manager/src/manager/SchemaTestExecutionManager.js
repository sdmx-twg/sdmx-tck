const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var SchemaRequestBuilder = require('../builders/SchemaRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var ContentConstraintTypeValidator = require('../checker/ContentConstraintTypeValidator.js')
const sdmx_requestor = require('sdmx-rest');
const {UrlGenerator} = require('sdmx-rest/lib/utils/url-generator')
class SchemaTestExecutionManager {
    static async executeTest(toRun, apiVersion, endpoint) {
        let testResult = toRun;
        try {
            
            /////PREPARING AND SENDING THE TEST REQUEST/////
            testResult.startTime = new Date();
            console.log("Test: " + toRun.testId + " started on " + testResult.startTime);
            
            if(toRun.identifiers.structureType === "" && toRun.identifiers.agency === "" && toRun.identifiers.id === "" && toRun.identifiers.version === ""){
                throw new TckError("Identifiers Missing either because there is no constraint constraining a "+testResult.resource+
                                    " or there were no content constraints found at all.")
            }

            let preparedRequest = await SchemaRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version);

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

           
            //// WORKSPACE VALIDATION ////
            let workspace = await new SdmxXmlParser().getIMObjects(xsdString);
            testResult.workspace = workspace;
            console.log("Test: " + toRun.testId + " SDMX workspace created.");
            
            console.log(workspace.getXSDComponentByType("asd"))
            // // If the Rest Resource is "structure" then we have to call the getRandomSdmxObject() function.
            // var randomStructure = workspace.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource));
            // if (toRun.resource === "structure") {
            //     randomStructure = workspace.getRandomSdmxObject();
            // }
            // testResult.randomStructure = {
            //     structureType: randomStructure.getStructureType(),
            //     agencyId: randomStructure.getAgencyId(),
            //     id: randomStructure.getId(),
            //     version: randomStructure.getVersion(),
            // };
            // if (randomStructure instanceof ItemSchemeObject) {
            //     testResult.randomItems = randomStructure.getItemsCombination();
            // }
            
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