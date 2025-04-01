<<<<<<< HEAD
const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var StructureRequestBuilder = require('../builders/structure-queries-builders/StructureRequestBuilder.js');
var DataRequestPropsBuilder = require('../builders/data-queries-builders/DataRequestPropsBuilder.js');
var DataRequestBuilder = require('../builders/data-queries-builders/DataRequestBuilder.js');
=======
const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var StructureRequestBuilder = require('../builders/structure-queries-builders/StructureRequestBuilder.js');
var DataRequestBuilderFactory = require('../builders/data-queries-builders/DataRequestBuilderFactory.js');
>>>>>>> v4.8.0

var ResponseValidator = require('../checker/HttpResponseValidator.js');
const sdmx_requestor = require('sdmx-rest');
const {UrlGenerator} = require('sdmx-rest/lib/utils/url-generator')

/*Special class that gets the workspace of a request*/
class HelperManager {
    static getWorkspace(toRun, apiVersion, endpoint) {
            return new Promise((resolve, reject) => {
                this.getPreparedRequest(toRun,apiVersion,endpoint)
                    .then((preparedRequest) => {
                        toRun.preparedRequest = preparedRequest;
                        let url = new UrlGenerator().getUrl(preparedRequest.request, preparedRequest.service, true)
<<<<<<< HEAD
=======
                        console.log("### HelperManager URL", url);
>>>>>>> v4.8.0
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
<<<<<<< HEAD
                        return new SdmxXmlParser().getIMObjects(xmlBody);
=======
                        return new SdmxXmlParser().getIMObjects(xmlBody,apiVersion);
>>>>>>> v4.8.0
                    }).then((workspace) => {
                        toRun.workspace = workspace.toJSON();
                        resolve(workspace)
                    }).catch((err) => {
                        reject(err);
                    });
            });
        
    };

<<<<<<< HEAD
    static  getPreparedRequest(toRun,apiVersion,endpoint){
        if(toRun.index === "Structure"){
            return  StructureRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items)
        }else if(toRun.index === "Data"){
            return   DataRequestBuilder.prepareRequest(endpoint, apiVersion,toRun)
=======
    static getPreparedRequest(toRun, apiVersion, endpoint) {
        if (toRun.index === "Structure") {
            return StructureRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items)
        } else if (toRun.index === "Data") {
            return DataRequestBuilderFactory.getBuilder(apiVersion).prepareRequest(endpoint, apiVersion, toRun)
>>>>>>> v4.8.0
        }
    }
};

module.exports = HelperManager;