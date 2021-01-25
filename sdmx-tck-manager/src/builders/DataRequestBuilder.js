const sdmx_rest = require('sdmx-rest');
const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;
var TckError = require('sdmx-tck-api').errors.TckError;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE
class DataRequestBuilder {

    static prepareRequest(endpoint, apiVersion, template, flow ,key, component,provider, detail,firstNObservations,lastNObservations,startPeriod,endPeriod,updateAfter,history,testType) {

        return new Promise((resolve, reject) => {
            try {
                var service = sdmx_rest.getService({ url: endpoint, api: apiVersion });
                
                var request = {
                    flow:flow,
                    key: key,
                    provider: provider,
                    detail: detail,
                    firstNObs:firstNObservations,
                    lastNObs:lastNObservations,
                    start:startPeriod,
                    end:endPeriod,
                    updateAfter:updateAfter,
                    history: history
                };

                if(template.mode){
                    request.mode = template.mode
                }
                if(template.component){
                    request.component = component
                }
                if(template.references){
                    request.references = template.references
                }
                // // Copy the values from the template to the final request
                // for (var k in template) {
                //     if (template[k] !== null && template[k] !== null) {
                //         request[k] = template[k];
                //     }
                // };
                let headers = {};
                if (template.representation) {
                    headers = { headers: { accept: template.representation } }
                }
                if (template.accept_encoding) {
                    if(Object.keys(headers).length === 0){
                        headers = { headers: { "Accept-Encoding": template.accept_encoding } }
                    }else{
                        headers.headers["Accept-Encoding"] = template.accept_encoding 
                    }
                }
                if (template.accept_language) {
                    if(Object.keys(headers).length === 0){
                        headers = { headers: { "Accept-Language": template.accept_language } }
                    }else{
                        headers.headers["Accept-Language"] = template.accept_language 
                    }
                }
                if (template.if_modified_since) {
                    if(Object.keys(headers).length === 0){
                        headers = { headers: { "If-Modified-Since": template.if_modified_since } }
                    }else{
                        headers.headers["If-Modified-Since"] = template.if_modified_since 
                    }
                }
                let preparedRequest = (testType !== TEST_TYPE.DATA_AVAILABILITY)?
                    { request: sdmx_rest.getDataQuery(request), service: service, headers: headers }:
                    { request: sdmx_rest.getAvailabilityQuery(request), service: service, headers: headers };
                    console.log(headers)
                resolve(preparedRequest);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }
};

module.exports = DataRequestBuilder