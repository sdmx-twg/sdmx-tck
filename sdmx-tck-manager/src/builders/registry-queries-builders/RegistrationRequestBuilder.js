const sdmx_rest = require('sdmx-rest');
var TckError = require('sdmx-tck-api').errors.TckError;
var REGISTRY_QUERY_REPRESENTATIONS = require('sdmx-tck-api').constants.REGISTRY_QUERY_REPRESENTATIONS;

class RegistrationRequestBuilder {
    static prepareRequest(endpoint, format, toRun) {
        return new Promise((resolve, reject) => {
            try {
                //TODO: use sdmx_rest.getService when the api version v2.1.0 is supported by the rest4js.
                var service = { url: endpoint, api: toRun.apiVersion };
                var request = {};

                let template = toRun.reqTemplate;
                if (template.byId === true) {
                    request.registrationId = template.registrationId ?? toRun.identifiers.registrationId;
                }
                if (template.byProvider === true) {
                    request.providerAgency = template.providerAgency ?? toRun.identifiers.providerAgency;
                    request.providerId = template.providerId ?? toRun.identifiers.providerId;
                }
                if (template.byContext === true) {
                    request.context = template.context ?? toRun.identifiers.context;
                    request.agency = template.agency ?? toRun.identifiers.agency;
                    request.id = template.id ?? toRun.identifiers.id;
                    request.version = template.version ?? toRun.identifiers.version;
                }
                if (template.updatedBefore === true) {
                    request.updatedBefore = toRun.identifiers.updatedBefore;
                }
                if (template.updatedAfter === true) {
                    request.updatedAfter = toRun.identifiers.updatedAfter;
                }

                let headers = {};
                let representation = template.representation ?? REGISTRY_QUERY_REPRESENTATIONS.getDefaultRepresentation();
                headers = { headers: { accept: representation } }

                let preparedRequest = { request: request, service: service, headers: headers };

                resolve(preparedRequest);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }
};
module.exports = RegistrationRequestBuilder