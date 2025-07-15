const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var SdmxParser = require('sdmx-tck-parsers').parsers.SdmxParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var RequestBuilderFactory = require('../builders/RequestBuilderFactory.js');
var RequestorFactory = require('../requestor/RequestorFactory.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');

/*Special class that gets the workspace of a request*/
class HelperManager {
    static getWorkspace(toRun, format, endpoint) {
        return new Promise((resolve, reject) => {
            RequestBuilderFactory
                .getBuilder(toRun.index, toRun.apiVersion)
                .prepareRequest(endpoint, format, toRun)
                .then((preparedRequest) => {
                    toRun.preparedRequest = preparedRequest;
                    return RequestorFactory.getRequestor(toRun.index).request(preparedRequest);
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
                    return new SdmxParser().getIMObjects(xmlBody, format);
                }).then((workspace) => {
                    toRun.workspace = workspace.toJSON();
                    resolve(workspace)
                }).catch((err) => {
                    reject(err);
                });
        });
    };
};

module.exports = HelperManager;