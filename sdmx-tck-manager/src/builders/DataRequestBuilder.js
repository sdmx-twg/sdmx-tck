const sdmx_rest = require('sdmx-rest');
var TckError = require('sdmx-tck-api').errors.TckError;

class DataRequestBuilder {

    static prepareRequest(endpoint, apiVersion, template, testIdentifiers ,key, providerRef, detail,history) {
        return new Promise((resolve, reject) => {
            try {
                var service = sdmx_rest.getService({ url: endpoint, api: apiVersion });
                
                let flow = "";
                if(template.agency && template.version){flow = (testIdentifiers.id)}
                else if (template.version){ flow = (testIdentifiers.agency.concat(","+testIdentifiers.id))}
                else if (!template.agency && !template.id &&!template.version){flow = (testIdentifiers.agency.concat(","+testIdentifiers.id.concat(","+testIdentifiers.version)))}

                let provider = (template.providerId && template.providerAgency) ? providerRef.agencyId+","+providerRef.identifiableIds[0]:(template.providerId && !template.providerAgency)?providerRef.identifiableIds[0]:undefined
                let detail = (template.detail) ? template.detail:undefined
                // Inititalize request from parameters
                var request = {
                    flow:flow,
                    key: key,
                    provider: provider,
                    detail: detail,
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