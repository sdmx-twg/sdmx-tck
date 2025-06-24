const sdmx_rest = require('sdmx-rest');
var TckError = require('sdmx-tck-api').errors.TckError;
const STRUCTURE_QUERY_REPRESENTATIONS = require('sdmx-tck-api').constants.STRUCTURE_QUERY_REPRESENTATIONS;

class StructureRequestBuilder {
    static prepareRequest(endpoint, apiVersion, toRun) {
        return new Promise((resolve, reject) => {
            try {
                var service = sdmx_rest.getService({ url: endpoint, api: apiVersion });
                // Inititalize request from parameters
                var request = {
                    resource: toRun.resource,
                    agency: toRun.identifiers.agency,
                    id: toRun.identifiers.id,
                    version: toRun.identifiers.version,
                };
                if (toRun.items && Array.isArray(toRun.items) && toRun.items.length > 0) {
                    request.item = toRun.items.join("+");
                }

                // Copy the values from the template to the final request
                let template = toRun.reqTemplate;
                for (var k in template) {
                    if (template[k] !== null && template[k] !== null) {
                        request[k] = template[k];
                    }
                };

                let headers = {};
                let representation = template.representation;
                if (!representation) {
                    // Get default XML representation
                    representation = STRUCTURE_QUERY_REPRESENTATIONS.getXMLRepresentation(apiVersion);
                }
                headers = { headers: { accept: representation } }
                
                let preparedRequest = { request: sdmx_rest.getMetadataQuery(request), service: service, headers: headers };

                resolve(preparedRequest);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }
};

module.exports = StructureRequestBuilder