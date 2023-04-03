const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var TestObjectBuilder = require("../TestObjectBuilder.js");
var STRUCTURE_REFERENCE_PARAMETER_TESTS = require('../../constants/TestConstants.js').STRUCTURE_REFERENCE_PARAMETER_TESTS;

class StructureExtendedResourceIdentParamTestsBuilder{

    static getStructureExtendedIdentificationParametersTests(index,x,apiVersion,currentRestResource,requestMode){
                let structureExtendedIdentificationParametersTests = [];
                let testObjParams = {};
                
                //Exclude organisationscheme, actualconstraint, allowedconstraint, structure resources from references tests.
                if (currentRestResource !== STRUCTURES_REST_RESOURCE.organisationscheme &&
                    currentRestResource !== STRUCTURES_REST_RESOURCE.allowedconstraint &&
                    currentRestResource !== STRUCTURES_REST_RESOURCE.actualconstraint &&
                    currentRestResource !== STRUCTURES_REST_RESOURCE.structure) {

                    let referencesTests = STRUCTURE_REFERENCE_PARAMETER_TESTS(currentRestResource,requestMode,apiVersion);
                    for (let i in referencesTests) {
                        let test = referencesTests[i];
                        x.numOfTests = x.numOfTests + 1;
                        testObjParams = {
                            testId: "/" + currentRestResource + test.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: currentRestResource,
                            reqTemplate: test.reqTemplate,
                            requireRandomSdmxObject : true,
                            testType: TEST_TYPE.STRUCTURE_REFERENCE_PARAMETER
                        }
                        structureExtendedIdentificationParametersTests.push(TestObjectBuilder.getTestObject(testObjParams))
                    };
        }
        return structureExtendedIdentificationParametersTests;
    }
}
module.exports = StructureExtendedResourceIdentParamTestsBuilder;