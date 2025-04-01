const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const DATA_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.DATA_IDENTIFICATION_PARAMETERES;
var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataIdentificationParametersTestBuilder {
    static getTests(index, x, apiVersion) {
        let dataIdentificationParamTests = [];
        DATA_IDENTIFICATION_PARAMETERS.getParameters(apiVersion).forEach(param => {
            x.numOfTests = x.numOfTests + 1;
            let testObjParams = {
                testId: "(" + param.key +  ") /data" + param.url,
                index: index,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.dataflow,
                reqTemplate: param.template,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.DATA_IDENTIFICATION_PARAMETERS,
            }
            dataIdentificationParamTests.push(TestObjectBuilder.getTestObject(testObjParams));
        });
        return dataIdentificationParamTests;
    }
}

module.exports = DataIdentificationParametersTestBuilder;