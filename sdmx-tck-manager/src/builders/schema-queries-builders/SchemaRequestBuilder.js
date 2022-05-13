const sdmx_rest = require('sdmx-rest');
var TckError = require('sdmx-tck-api').errors.TckError;

class SchemaRequestBuilder {

    static prepareRequest(endpoint, apiVersion, context, template, agency, id, version, obsDimension, explicitMeasure) {
        return new Promise((resolve, reject) => {
            try {
                var service = sdmx_rest.getService({ url: endpoint, api: apiVersion });
                // Inititalize request from parameters
                var request = {
                    context: context,
                    agency: agency,
                    id: id,
                    version: version,
                };
                if (obsDimension) {
                    request.obsDimension = obsDimension;
                }
                if(explicitMeasure){
                    request.explicit = explicitMeasure
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