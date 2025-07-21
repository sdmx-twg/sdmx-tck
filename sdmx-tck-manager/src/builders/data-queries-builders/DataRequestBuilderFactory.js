const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS
const DataRequestBuilder = require('./DataRequestBuilder');
const DataRequestBuilder2 = require('./DataRequestBuilder2');

class DataRequestBuilderFactory {
    static getBuilder(apiVersion) {
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            return DataRequestBuilder2;
        } else {
            return DataRequestBuilder;
        }
    }
};
module.exports = DataRequestBuilderFactory;