const { TEST_INDEX } = require('sdmx-tck-api/src/constants/TestIndex');
var StructureRequestBuilder = require('./structure-queries-builders/StructureRequestBuilder.js');
var DataRequestBuilderFactory = require('./data-queries-builders/DataRequestBuilderFactory.js');
var RegistrationRequestBuilder = require('./registry-queries-builders/RegistrationRequestBuilder.js');

class RequestBuilderFactory {
    static getBuilder(index, apiVersion) {
        if (index === TEST_INDEX.Structure) {
            return StructureRequestBuilder;
        } else if (index === TEST_INDEX.Data) {
            return DataRequestBuilderFactory.getBuilder(apiVersion);
        } else if (index === TEST_INDEX.Registration) {
            return RegistrationRequestBuilder;
        }
    }
};
module.exports = RequestBuilderFactory;