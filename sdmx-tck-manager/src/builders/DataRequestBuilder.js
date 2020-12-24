const sdmx_rest = require('sdmx-rest');
const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;
var TckError = require('sdmx-tck-api').errors.TckError;

class DataRequestBuilder {

    static prepareRequest(endpoint, apiVersion, template, flow ,key, provider, detail,firstNObservations,lastNObservations,startPeriod,endPeriod,updateAfter,history) {

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
                
                let preparedRequest = { request: sdmx_rest.getDataQuery(request), service: service, headers: headers };
                resolve(preparedRequest);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }
};

module.exports = DataRequestBuilder