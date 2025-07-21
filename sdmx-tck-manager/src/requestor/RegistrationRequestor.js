class RegistrationRequestor {
    static async request(preparedRequest) {
        let query = preparedRequest.request;
        let service = preparedRequest.service;

        let url;
        if (service.url) {
            url = service.url;
            if (!url.endsWith('/')) {
                url += '/';
            }
        }
        url += "registration/";
        
        if (query.registrationId) {
            url += `id/${query.registrationId}`;
        } else {
            if (query.providerAgency && query.providerId) {
                url += `provider/${query.providerAgency}/${query.providerId}`;
            } else if (query.context) {
                url += `${query.context}/${query.agency}/${query.id}/${query.version}`;
            }
            let params = [];
            if (query.updatedBefore) {
                params.push(`updatedBefore=${query.updatedBefore}`);
            }
            if (query.updatedAfter) {
                params.push(`updatedAfter=${query.updatedAfter}`);
            }
            if (params.length > 0) {
                url += `?${params.join("&")}`;
            }
        }
        //TODO: set headers
        return fetch(url).then(function (response) {
            return response;
        });
    };
};
module.exports = RegistrationRequestor;