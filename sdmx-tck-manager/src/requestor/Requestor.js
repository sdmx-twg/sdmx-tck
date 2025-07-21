const sdmx_requestor = require('sdmx-rest');
const {UrlGenerator} = require('sdmx-rest/lib/utils/url-generator')

class Requestor {
    static request(preparedRequest) {
        //Alternative way to pass the url generated as string in order to configure the skipDefaults parameter.
        let url = new UrlGenerator().getUrl(preparedRequest.request, preparedRequest.service, true)
        return sdmx_requestor.request2(url, preparedRequest.headers);
    }
};
module.exports = Requestor;