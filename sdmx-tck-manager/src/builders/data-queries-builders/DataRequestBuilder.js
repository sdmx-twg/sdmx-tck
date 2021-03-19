const sdmx_rest = require('sdmx-rest');
const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;
var TckError = require('sdmx-tck-api').errors.TckError;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE
var DataRequestPropsBuilder = require('./DataRequestPropsBuilder.js')

class DataRequestBuilder {

    static prepareRequest(endpoint, apiVersion, toRun) {

        return new Promise((resolve, reject) => {
            try {
                var service = sdmx_rest.getService({ url: endpoint, api: apiVersion });
                
                var request = {
                    flow:DataRequestPropsBuilder.getFlow(toRun.identifiers,toRun.reqTemplate),
                    key: DataRequestPropsBuilder.getKey(toRun.randomKeys,toRun.dsdObj,toRun.reqTemplate),
                    provider: DataRequestPropsBuilder.getProvider(toRun.providerRefs,toRun.reqTemplate),
                    detail: toRun.reqTemplate.detail,
                    firstNObs:DataRequestPropsBuilder.getNumOfFirstNObservations(toRun.indicativeSeries,toRun.reqTemplate),
                    lastNObs:DataRequestPropsBuilder.getNumOfLastNObservations(toRun.indicativeSeries,toRun.reqTemplate),
                    start:DataRequestPropsBuilder.getStartPeriod(toRun.indicativeSeries,toRun.reqTemplate),
                    end:DataRequestPropsBuilder.getEndPeriod(toRun.indicativeSeries,toRun.reqTemplate),
                    updatedAfter:DataRequestPropsBuilder.getUpdateAfterDate(toRun.indicativeSeries,toRun.reqTemplate),
                    obsDimension:DataRequestPropsBuilder.getObsDimension(toRun.dsdObj,toRun.reqTemplate),
                    history: toRun.reqTemplate.includeHistory
                };

                if(toRun.reqTemplate.mode){
                    request.mode = toRun.reqTemplate.mode
                }
                if(toRun.reqTemplate.component){
                    request.component = DataRequestPropsBuilder.getComponent(toRun.randomKeys,toRun.reqTemplate)
                }
                if(toRun.reqTemplate.references){
                    request.references = toRun.reqTemplate.references
                }
    
                let headers = {};
                if (toRun.reqTemplate.representation) {
                    headers = { headers: { accept: toRun.reqTemplate.representation } }
                }
                if (toRun.reqTemplate.accept_encoding) {
                    if(Object.keys(headers).length === 0){
                        headers = { headers: { "Accept-Encoding": toRun.reqTemplate.accept_encoding } }
                    }else{
                        headers.headers["Accept-Encoding"] = toRun.reqTemplate.accept_encoding 
                    }
                }
                if (toRun.reqTemplate.accept_language) {
                    if(Object.keys(headers).length === 0){
                        headers = { headers: { "Accept-Language": toRun.reqTemplate.accept_language } }
                    }else{
                        headers.headers["Accept-Language"] = toRun.reqTemplate.accept_language 
                    }
                }
                if (toRun.reqTemplate.if_modified_since) {
                    if(Object.keys(headers).length === 0){
                        headers = { headers: { "If-Modified-Since": toRun.reqTemplate.if_modified_since } }
                    }else{
                        headers.headers["If-Modified-Since"] = toRun.reqTemplate.if_modified_since 
                    }
                }
                
                let preparedRequest = (toRun.testType !== TEST_TYPE.DATA_AVAILABILITY)?
                    { request: sdmx_rest.getDataQuery(request), service: service, headers: headers }:
                    { request: sdmx_rest.getAvailabilityQuery(request), service: service, headers: headers };
                resolve(preparedRequest);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }
};

module.exports = DataRequestBuilder