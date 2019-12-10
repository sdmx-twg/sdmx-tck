const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').SDMX_STRUCTURE_TYPE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;

var StructureRequestBuilder = require('../builders/StructureRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');

const sdmx_requestor = require('sdmx-rest');

class TestExecutionManager {
    static executeTest(toRun, apiVersion, endpoint) {
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
                    return toRun.httpResponse.text();
                }).then((xmlBody) => {
                    return new SdmxXmlParser().getIMObjects(xmlBody);
                }).then((workspace) => {
                    toRun.workspace = workspace.toJSON();
                    return SemanticCheckerFactory.getChecker(toRun.request).checkWorkspace(toRun, workspace);
                }).then((validation) => {
                    toRun.workspaceValidation = validation;
                    resolve(toRun);
                }).catch(function (err) {
                    reject({ data: { testInfo: toRun, state: "FAILED", error: err } });
                });
        });
    };
};

module.exports = TestExecutionManager;