const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var StructureRequestBuilder = require('../builders/StructureRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
const sdmx_requestor = require('sdmx-rest');

class TestExecutionManager {
    static executeTest(toRun, apiVersion, endpoint) {
        /*Keep the starting time*/
        toRun.startTime = new Date();

        if (toRun.testType === TEST_TYPE.STRUCTURE_QUERY_REPRESENTATION) { 
            return new Promise((resolve, reject) => {
                StructureRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                    toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items)
                    .then((preparedRequest) => {
                        toRun.preparedRequest = preparedRequest;
                        return sdmx_requestor.request2(toRun.preparedRequest.request, toRun.preparedRequest.service);
                    }).then((httpResponse) => {
                        toRun.httpResponse = httpResponse;
                        return ResponseValidator.validateRepresentation(toRun.reqTemplate.representation, toRun.httpResponse);
                    }).then((httpResponseValidation) => {
                        toRun.httpResponseValidation = httpResponseValidation;
                        if (httpResponseValidation.status === FAILURE_CODE) {
                            throw new TckError("HTTP validation failed. Cause: " + httpResponseValidation.error);
                        }
                        toRun.endTime = new Date();
                        resolve(toRun);
                    }).catch((err) => {
                        if (err instanceof Error) {
                            toRun.failReason = err.toString();
                        }
                        toRun.endTime = new Date();
                        reject(toRun);
                    });
            });
        } else {
            return new Promise((resolve, reject) => {
                StructureRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                    toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items)
                    .then((preparedRequest) => {
                        toRun.preparedRequest = preparedRequest;
                        return sdmx_requestor.request2(toRun.preparedRequest.request, toRun.preparedRequest.service);
                    }).then((httpResponse) => {
                        toRun.httpResponse = httpResponse;
                        return ResponseValidator.validateHttpResponse(toRun.preparedRequest.request, toRun.httpResponse);
                    }).then((httpResponseValidation) => {
                        toRun.httpResponseValidation = httpResponseValidation;
                        if (httpResponseValidation.status === FAILURE_CODE) {
                            throw new TckError("HTTP validation failed. Cause: " + httpResponseValidation.error);
                        }
                        return toRun.httpResponse.text();
                    }).then((xmlBody) => {
                        return new SdmxXmlParser().getIMObjects(xmlBody);
                    }).then((workspace) => {
                        // If the Rest Resource is "structure" then we have to call the getRandomSdmxObject() function.
                        var randomStructure;
                        if (toRun.resource === "structure") {
                            randomStructure = workspace.getRandomSdmxObject();
                        } else {
                            randomStructure = workspace.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource));
                        }
                        toRun.randomStructure = {
                            structureType: randomStructure.getStructureType(),
                            agencyId: randomStructure.getAgencyId(),
                            id: randomStructure.getId(),
                            version: randomStructure.getVersion(),
                        };
                        if(randomStructure instanceof ItemSchemeObject){
                           toRun.randomItems = randomStructure.getItemsCombination();
                        }
                        toRun.workspace = workspace.toJSON();
                        return SemanticCheckerFactory.getChecker(toRun.request,toRun.testType).checkWorkspace(toRun, workspace);
                    }).then((workspaceValidation) => {
                        toRun.workspaceValidation = workspaceValidation;
                        if (workspaceValidation.status === FAILURE_CODE) {
                            throw new TckError("Workspace validation failed: Cause: " + workspaceValidation.error);
                        }

                        //Keep ending time
                        toRun.endTime = new Date();
                        resolve(toRun);
                    }).catch((err) => {
                        if (err instanceof Error) {
                            toRun.failReason = err.toString();
                        }
                        //Keep ending time
                        toRun.endTime = new Date();
                        reject(toRun);
                    });
            });
        }
    };
};

module.exports = TestExecutionManager;