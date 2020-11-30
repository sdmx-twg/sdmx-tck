const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var DataRequestBuilder = require('../builders/DataRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');
var DataRequestPropsBuilder = require('../builders/DataRequestPropsBuilder.js')
var HelperManager = require('../manager/HelperManager.js')
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
const sdmx_requestor = require('sdmx-rest');
const {UrlGenerator} = require('sdmx-rest/lib/utils/url-generator');
const { DATA_QUERY_KEY } = require('sdmx-tck-api/src/constants/data-queries-constants/DataQueryKey');
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;


class DataTestsExecutionManager {
    static async executeTest(toRun, apiVersion, endpoint) {
        let testResult = toRun;
        try {
            testResult.startTime = new Date();
            console.log("Test: " + toRun.testId + " started on " + testResult.startTime);
            
            //IF NO IDENTIFIERS WERE FOUND IN TESTS THEN ERROR IS THROWN
            if(toRun.identifiers.structureType === "" && toRun.identifiers.agency === "" && toRun.identifiers.id === "" && toRun.identifiers.version === ""){
                throw new TckError("Identifiers Missing because there are no "+SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key+" referencing a DF as well as a "+SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key+" .")
            }

            if(toRun.reqTemplate.key === DATA_QUERY_KEY.PARTIAL_KEY || toRun.reqTemplate.key === DATA_QUERY_KEY.MANY_KEYS){
                if(Object.keys(toRun.randomKey).length < 2){
                    throw new TckError("There are no enough dimensions to perform this test.")
                }
            }
            let providerRefs = [];
            if(toRun.reqTemplate.provider){
                let helpTestParams = {
                    testId: "/"+toRun.resource+"/agency/id/version?references="+STRUCTURE_REFERENCE_DETAIL.ALL,
                    index: TEST_INDEX.Structure,
                    apiVersion: apiVersion,
                    resource: toRun.resource,
                    reqTemplate: {references:STRUCTURE_REFERENCE_DETAIL.ALL},
                    identifiers: {structureType:SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource),agency:toRun.identifiers.agency,id:toRun.identifiers.id,version:toRun.identifiers.version},
                    testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS
                }
                toRun.structureWorkspace = await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(helpTestParams),apiVersion,endpoint);
            
                let provAggreements = toRun.structureWorkspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key)
                
                if(toRun.reqTemplate.provider.num !== provAggreements.length){
                    throw new TckError("This "+SDMX_STRUCTURE_TYPE.DATAFLOW.key+" does not have enough providers");
                }
                
                provAggreements.forEach(pra =>{
                    providerRefs.push(pra.getChildren().find(ref=> (ref.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key)))
                })
            }
           
           
            let preparedRequest = await DataRequestBuilder.prepareRequest(endpoint, apiVersion,toRun.reqTemplate,
                                                            DataRequestPropsBuilder.getFlow(toRun.identifiers,toRun.reqTemplate),
                                                            DataRequestPropsBuilder.getKey(toRun.randomKey,toRun.reqTemplate),
                                                            DataRequestPropsBuilder.getProvider(providerRefs,toRun.reqTemplate),
                                                            toRun.reqTemplate.detail,undefined);

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

            //// WORKSPACE CREATION ////
            let response =await httpResponse.text() 
            //console.log(response)
            let workspace = await new SdmxXmlParser().getIMObjects(response);
            testResult.workspace = workspace;
            console.log("Test: " + toRun.testId + " SDMX workspace created.");
              

              
            // WORKSPACE VALIDATION
            let workspaceValidation = await SemanticCheckerFactory.getChecker(toRun).checkWorkspace(toRun, preparedRequest, workspace);
            testResult.workspaceValidation = workspaceValidation;
            if (workspaceValidation.status === FAILURE_CODE) {
                throw new TckError("Workspace validation failed: Cause: " + workspaceValidation.error);
            }

            //RANDOM KEY TO GIVE TO CHILDREN
            if(toRun.testType === TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS && !toRun.requireRandomKey){
                testResult.randomKey = workspace.getRandomKey();
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

module.exports = DataTestsExecutionManager;