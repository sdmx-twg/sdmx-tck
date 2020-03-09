const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var StructureRequestBuilder = require('../builders/StructureRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var ContentConstraintTypeValidator = require('../checker/ContentConstraintTypeValidator.js')
const sdmx_requestor = require('sdmx-rest');

class TestExecutionManager {
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
            let preparedRequest = await StructureRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items);

            console.log("Test: " + toRun.testId + " HTTP request prepared." + JSON.stringify(preparedRequest));
            
            let httpResponse = await sdmx_requestor.request2(preparedRequest.request, preparedRequest.service, preparedRequest.headers);
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

            //// WORKSPACE VALIDATION ////
            if (toRun.testType !== TEST_TYPE.STRUCTURE_QUERY_REPRESENTATION) {
                let workspace = await new SdmxXmlParser().getIMObjects(await httpResponse.text());
                testResult.workspace = workspace;
                console.log("Test: " + toRun.testId + " SDMX workspace created.");
            
                // If the Rest Resource is "structure" then we have to call the getRandomSdmxObject() function.
                var randomStructure = workspace.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource));
                if (toRun.resource === "structure") {
                    randomStructure = workspace.getRandomSdmxObject();
                }
                testResult.randomStructure = {
                    structureType: randomStructure.getStructureType(),
                    agencyId: randomStructure.getAgencyId(),
                    id: randomStructure.getId(),
                    version: randomStructure.getVersion(),
                };
                if (randomStructure instanceof ItemSchemeObject) {
                    testResult.randomItems = randomStructure.getItemsCombination();
                }

                // WORKSPACE VALIDATION
                let workspaceValidation = await SemanticCheckerFactory.getChecker(preparedRequest, toRun.testType).checkWorkspace(toRun, preparedRequest, workspace);
                testResult.workspaceValidation = workspaceValidation;
                if (workspaceValidation.status === FAILURE_CODE) {
                    throw new TckError("Workspace validation failed: Cause: " + workspaceValidation.error);
                }
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

module.exports = TestExecutionManager;