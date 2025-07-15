const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const REGISTRATION_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.REGISTRATION_IDENTIFICATION_PARAMETERS;
var TestObjectBuilder = require("../TestObjectBuilder.js");

class RegistrationIdentificationParametersTestBuilder {
    static getTests(index, x, apiVersion) {
        let tests = [];
        REGISTRATION_IDENTIFICATION_PARAMETERS.getValues(apiVersion).forEach(param => {
            x.numOfTests = x.numOfTests + 1;
            let testObjParams = {
                testId: "(" + param.key +  ") " + param.url,
                index: index,
                apiVersion: apiVersion,
                resource: "registration",
                reqTemplate: param.template,
                identifiers: {},
                testType: TEST_TYPE.REGISTRATION_IDENTIFICATION_PARAMETERS,
            }
            tests.push(TestObjectBuilder.getTestObject(testObjParams));
        });
        return tests;
    }
}
module.exports = RegistrationIdentificationParametersTestBuilder;