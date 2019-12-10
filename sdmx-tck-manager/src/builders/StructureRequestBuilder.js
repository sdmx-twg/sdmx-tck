const sdmx_rest = require('sdmx-rest');
var TckError = require('sdmx-tck-api').errors.TckError;

class StructureRequestBuilder {

    static prepareRequest(endpoint, apiVersion, resource, template, agency, id, version, items) {
        return new Promise((resolve, reject) => {
            try {
                var service = sdmx_rest.getService({ url: endpoint, api: apiVersion });
                // Inititalize request from parameters
                var request = {
                    resource: resource,
                    agency: agency,
                    id: id,
                    version: version,
                };
                if (items && Array.isArray(items) && items.length > 0) {
                    request.item = items.join("+");
                }

                // Copy the values from the template to the final request
                for (var k in template) {
                    if (template[k] !== null && template[k] !== null) {
                        request[k] = template[k];
                    }
                };
                let preparedRequest = { request: sdmx_rest.getMetadataQuery(request), service: service };

                resolve(preparedRequest);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }
};

module.exports = StructureRequestBuilder