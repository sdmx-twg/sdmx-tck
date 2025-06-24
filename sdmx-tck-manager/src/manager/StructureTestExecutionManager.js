const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var RequestBuilderFactory = require('../builders/RequestBuilderFactory.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');
var ContentConstraintTypeValidator = require('../checker/ContentConstraintTypeValidator.js')
var RequestorFactory = require('../requestor/RequestorFactory.js');
const { TEST_INDEX } = require('sdmx-tck-api/src/constants/TestIndex.js');

class StructureTestExecutionManager {
    static async executeTest(toRun, apiVersion, endpoint) {
        let testResult = toRun;
        try {
            testResult.startTime = new Date();
            console.log("Test: " + toRun.testId + " started on " + testResult.startTime);

            /*We have to make sure that the constraint is of allowed type before it runs.
            SPECIAL HANDLING FOR STRUCTURE REFERENCE TEST ONLY*/
            if (toRun.testType === TEST_TYPE.STRUCTURE_REFERENCE_PARTIAL && toRun.parentWorkspace) {
                toRun.identifiers = ContentConstraintTypeValidator.getContentConstraintOfAllowedType(toRun)
            }
            let preparedRequest = await RequestBuilderFactory.getBuilder(toRun.index, apiVersion).prepareRequest(endpoint, apiVersion, toRun);

            console.log("Test: " + toRun.testId + " HTTP request prepared." + JSON.stringify(preparedRequest));
            
            let httpResponse = await RequestorFactory.getRequestor(toRun.index).request(preparedRequest);

            console.log("Test: " + toRun.testId + " HTTP response received.");
            
            //// HTTP RESPONSE VALIDATION ////
            let httpResponseValidation = null;
            httpResponseValidation = await ResponseValidator.validateHttpResponse(preparedRequest.request, httpResponse);
            testResult.httpResponseValidation = httpResponseValidation;
            console.log("Test: " + toRun.testId + " HTTP response validated. " + JSON.stringify(httpResponseValidation));
            if (httpResponseValidation.status === FAILURE_CODE) {
                throw new TckError("HTTP validation failed. Cause: " + httpResponseValidation.error);
            }
 
            //REPRESENTATION VALIDATION
            if (toRun.testType === TEST_TYPE.STRUCTURE_QUERY_REPRESENTATION) {
                let httpResponseHeadersValidation = await ResponseValidator.validateRepresentation(toRun.reqTemplate.representation, httpResponse, apiVersion);
                testResult.httpResponseHeadersValidation = httpResponseHeadersValidation;
                if (httpResponseHeadersValidation.status === FAILURE_CODE) {
                    throw new TckError("Representation validation failed. Cause: " + httpResponseHeadersValidation.error);
                }
                return testResult
            }
            

            //// WORKSPACE VALIDATION ////
            let workspace = await new SdmxXmlParser().getIMObjects(await httpResponse.text(), apiVersion);
            if (!workspace) {
                throw new TckError("Workspace validation failed. Cause: The workspace is empty.");
            }
            testResult.workspace = workspace;
            console.log("Test: " + toRun.testId + " SDMX workspace created.");

            if (toRun.index === TEST_INDEX.Structure) {
                testResult.randomStructures = workspace.getRandomStructureRefsOfRestResource(toRun.resource);
            }
            
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

module.exports = StructureTestExecutionManager;