const sdmx_requestor = require('sdmx-rest');

class StructureRequestBuilder {
    // Prepare the request, using the template from the test 
    static prepareRequest = function (resource, template, agency, id, version, items) {
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

        // Return the SDMX request
        return sdmx_requestor.getMetadataQuery(request);
    }
};

module.exports = StructureRequestBuilder