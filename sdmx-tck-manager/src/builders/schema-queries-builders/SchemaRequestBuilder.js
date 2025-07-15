const sdmx_rest = require('sdmx-rest');
var TckError = require('sdmx-tck-api').errors.TckError;

class SchemaRequestBuilder {

    static prepareRequest(endpoint, format, toRun) {
        return new Promise((resolve, reject) => {
            try {
                var service = sdmx_rest.getService({ url: endpoint, api: toRun.apiVersion });
                // Inititalize request from parameters
                var request = {
                    context: toRun.resource,
                    agency: toRun.identifiers.agency,
                    id: toRun.identifiers.id,
                    version: toRun.identifiers.version,
                };
                let template = toRun.reqTemplate;
                if (template && template.dimensionAtObservation) {
                    request.obsDimension = template.dimensionAtObservation;
                }
                if (template && template.explicitMeasure) {
                    request.explicit = template.explicitMeasure;
                }

                // Copy the values from the template to the final request
                for (var k in template) {
                    if (template[k] !== null && template[k] !== null) {
                        request[k] = template[k];
                    }
                };

                let headers = {};
                if (template.representation) {
                    headers = { headers: { accept: template.representation } }
                }
                
                let preparedRequest = { request: sdmx_rest.getSchemaQuery(request), service: service, headers: headers };

                resolve(preparedRequest);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }
};

module.exports = SchemaRequestBuilder