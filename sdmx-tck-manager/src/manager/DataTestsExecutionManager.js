const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var DataRequestBuilder = require('../builders/DataRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var ContentConstraintTypeValidator = require('../checker/ContentConstraintTypeValidator.js')
const sdmx_requestor = require('sdmx-rest');
const {UrlGenerator} = require('sdmx-rest/lib/utils/url-generator')
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
            let preparedRequest = await DataRequestBuilder.prepareRequest(endpoint, apiVersion,toRun.reqTemplate,toRun.identifiers,undefined,toRun.providerInfo,undefined,undefined);

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