const {
    TEST_TYPE,
    STRUCTURES_REST_RESOURCE,
    TEST_REQUEST_MODE
} = require('sdmx-tck-api').constants;
const { STRUCTURE_REFERENCE_PARAMETER_TESTS } = require('../../constants/TestConstants.js');
var TestObjectBuilder = require("../TestObjectBuilder.js");

class StructureExtendedResourceIdentParamTestsBuilder{

    static getStructureExtendedIdentificationParametersTests(index, x, apiVersion, currentRestResource, requestMode) {
        let structureExtendedIdentificationParametersTests = [];

        if (requestMode === TEST_REQUEST_MODE.FULL || requestMode === TEST_REQUEST_MODE.BASIC) {
            //Exclude organisationscheme, actualconstraint, allowedconstraint, structure resources from references tests.
            if (currentRestResource !== STRUCTURES_REST_RESOURCE.organisationscheme &&
                currentRestResource !== STRUCTURES_REST_RESOURCE.allowedconstraint &&
                currentRestResource !== STRUCTURES_REST_RESOURCE.actualconstraint &&
                currentRestResource !== STRUCTURES_REST_RESOURCE.structure) {

                let referencesTests = STRUCTURE_REFERENCE_PARAMETER_TESTS(apiVersion, currentRestResource, requestMode);
                for (let i in referencesTests) {
                    let test = referencesTests[i];
                    x.numOfTests = x.numOfTests + 1;
                    let testObjParams = {
                        testId: "/" + currentRestResource + test.url,
                        index: index,
                        apiVersion: apiVersion,
                        resource: currentRestResource,
                        reqTemplate: test.reqTemplate,
                        requireRandomSdmxObject: true,
                        testType: TEST_TYPE.STRUCTURE_REFERENCE_PARAMETER
                    }
                    structureExtendedIdentificationParametersTests.push(TestObjectBuilder.getTestObject(testObjParams))
                };
            }
        }
        return structureExtendedIdentificationParametersTests;
    }
}
module.exports = StructureExtendedResourceIdentParamTestsBuilder;