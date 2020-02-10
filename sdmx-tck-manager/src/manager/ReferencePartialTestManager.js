const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var StructureRequestBuilder = require('../builders/StructureRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
const sdmx_requestor = require('sdmx-rest');

class ReferencePartialTestManager {
    static executeTest(toRun, apiVersion, endpoint) {
        /*Keep the starting time*/
        toRun.startTime = new Date();
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
                        toRun.workspace = workspace.toJSON();
                        resolve(workspace)
                    }).catch((err) => {
                        reject(err);
                    });
            });
        
    };
};

module.exports = ReferencePartialTestManager;