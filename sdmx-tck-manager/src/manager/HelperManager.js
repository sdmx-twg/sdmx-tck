const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var StructureRequestBuilder = require('../builders/structure-queries-builders/StructureRequestBuilder.js');
var DataRequestPropsBuilder = require('../builders/data-queries-builders/DataRequestPropsBuilder.js');
var DataRequestBuilder = require('../builders/data-queries-builders/DataRequestBuilder.js');

var ResponseValidator = require('../checker/HttpResponseValidator.js');
const sdmx_requestor = require('sdmx-rest');
const {UrlGenerator} = require('sdmx-rest/lib/utils/url-generator')

/*Special class that gets the workspace of a request*/
class HelperManager {
    static getWorkspace(toRun, apiVersion, endpoint) {
            return new Promise((resolve, reject) => {
                this.getPreparedRequest(toRun,apiVersion,endpoint)
                // StructureRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                //     toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items)
                    .then((preparedRequest) => {
                        toRun.preparedRequest = preparedRequest;
                        let url = new UrlGenerator().getUrl(preparedRequest.request, preparedRequest.service, true)
                        return sdmx_requestor.request2(url,preparedRequest.headers);
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

    static  getPreparedRequest(toRun,apiVersion,endpoint){
        if(toRun.index === "Structure"){
            return  StructureRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items)
        }else if(toRun.index === "Data"){
           return   DataRequestBuilder.prepareRequest(endpoint, apiVersion,toRun.reqTemplate,
                DataRequestPropsBuilder.getFlow(toRun.identifiers,toRun.reqTemplate))
        }
    }
};

module.exports = HelperManager;