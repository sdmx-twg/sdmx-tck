const SCHEMA_FURTHER_DESCRIBING_PARAMETERS_TESTS = require('../constants/TestConstants.js').SCHEMA_FURTHER_DESCRIBING_PARAMETERS_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");

class SchemaFurtherDescribingResultsParamTestsBuilder {
    
    static getSchemaFurtherDescribingResultsParamTests(index,x,apiVersion,currentRestResource){
        let schemaFurtherDescribingResultsParamTests = [];
        let testObjParams = {};

        var schemaFurtherDescribingResultsParamTestsArray = SCHEMA_FURTHER_DESCRIBING_PARAMETERS_TESTS();
        for (let i=0;i<schemaFurtherDescribingResultsParamTestsArray.length;i++){
            let test = schemaFurtherDescribingResultsParamTestsArray[i];
            x.numOfTests = x.numOfTests + 1;

            testObjParams = {
                testId: "/schema/" + currentRestResource + test.url,
                index: index,
                apiVersion: apiVersion,
                resource: currentRestResource,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.SCHEMA_FURTHER_DESCRIBING_PARAMETERS,
            }
            schemaFurtherDescribingResultsParamTests.push(TestObjectBuilder.getTestObject(testObjParams));
        };
        return schemaFurtherDescribingResultsParamTests;
    }
    
}

module.exports = SchemaFurtherDescribingResultsParamTestsBuilder;