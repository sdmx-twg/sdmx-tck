const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').SDMX_STRUCTURE_TYPE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;

var StructureRequestBuilder = require('../builders/StructureRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');

const sdmx_requestor = require('sdmx-rest');

class TestExecutionManager {
    static async executeTest(toRun, apiVersion, endpoint) {
        var request = StructureRequestBuilder.prepareRequest(toRun.resource, toRun.reqTemplate, toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items);

        var testedService = sdmx_requestor.getService({ url: endpoint, api: apiVersion });

        await sdmx_requestor.request2(request, testedService).then((response) => {
            return ResponseValidator.validateHttpResponse(request, response);
        }).then((validation) => {
            toRun.httpResponseValidation = validation;

            return validation.httpResponseValidation.httpResponse.text();
        }).then((xmlBody) => {
            /* TODO
             * extract the workspace (sdmx structures, datasets in case of data query,
             * metadata reports is case of metadata query).
             */
            return new SdmxXmlParser().getIMObjects(xmlBody);
        }).then((workspace) => {
            return SemanticCheckerFactory.getChecker(request).checkWorkspace(toRun, workspace);
        }).then(async (validation) => {
            if (toRun.requireRandomSdmxObject === true) {
                var sdmxObj;
                /*If the Rest Resource is "structure" then we have to call the getRandomSdmxObject() function*/
                if (toRun.resource === "structure") {
                    sdmxObj = validation.workspace.getRandomSdmxObject();
                } else {
                    sdmxObj = validation.workspace.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource));
                }
                performAction(ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS, toRun, sdmxObj);
            }
            return toRun;
        }).catch(function (err) {
            //TODO
            console.log(err);
            return { data: { testInfo: toRun, state: "FAILED", error: err } };
            //store.dispatch({ type: ACTION_NAMES.UPDATE_TEST_STATE, data: { testInfo: toRun, state: TEST_STATE.FAILED, error: err } });
        });
    };
};

module.exports = TestExecutionManager;