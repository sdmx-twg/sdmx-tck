const SCHEMA_IDENTIFICATION_PARAMETERS_TESTS = require('../constants/TestConstants.js').SCHEMA_IDENTIFICATION_PARAMETERS_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");

class SchemaIdentificationParametersTestBuilder {
    
    static getSchemaIdentificationParametersTests(index,x,apiVersion,currentRestResource){
        let structureExtendedIdentificationParametersTests = [];
        let testObjParams = {};

        var schemaIdentificationArray = SCHEMA_IDENTIFICATION_PARAMETERS_TESTS();
        for (let i=0;i<schemaIdentificationArray.length;i++){
            let test = schemaIdentificationArray[i];
            
            //XSD IDENTIFICATION TESTS (USING DSDs,DFs,PRAs FROM CONSTRAINT)
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/schema/" + currentRestResource + test.url + " (CONSTRAINABLE)",
                index: index,
                apiVersion: apiVersion,
                resource: currentRestResource,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.SCHEMA_IDENTIFICATION_PARAMETERS_WITH_CONSTRAINTS,
            }
            structureExtendedIdentificationParametersTests.push(TestObjectBuilder.getTestObject(testObjParams));

            //XSD IDENTIFICATION TESTS (USING DSDs,DFs,PRAs WITH NO CONNECTION TO CONSTRAINT)
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/schema/" + currentRestResource + test.url + " (RANDOM)",
                index: index,
                apiVersion: apiVersion,
                resource: currentRestResource,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.SCHEMA_IDENTIFICATION_PARAMETERS_WITH_NO_CONSTRAINTS,
            }
            structureExtendedIdentificationParametersTests.push(TestObjectBuilder.getTestObject(testObjParams));
        };
        return structureExtendedIdentificationParametersTests;
    }
    
}

module.exports = SchemaIdentificationParametersTestBuilder;