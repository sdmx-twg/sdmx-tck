const SCHEMA_FURTHER_DESCRIBING_PARAMETERS_TESTS = require('../../constants/TestConstants.js').SCHEMA_FURTHER_DESCRIBING_PARAMETERS_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var TestObjectBuilder = require("../TestObjectBuilder.js");

class SchemaFurtherDescribingResultsParamTestsBuilder {
    
    static getSchemaFurtherDescribingResultsParamTests(index,x,apiVersion,currentRestResource){
        let schemaFurtherDescribingResultsParamTests = [];
        let testObjParams = {};

        var schemaFurtherDescribingResultsParamTestsArray = SCHEMA_FURTHER_DESCRIBING_PARAMETERS_TESTS();
        for (let i=0;i<schemaFurtherDescribingResultsParamTestsArray.length;i++){
            let test = schemaFurtherDescribingResultsParamTestsArray[i];
            
            //XSD DESCRIBING RESULTS TESTS (USING DSDs,DFs,PRAs FROM CONSTRAINT)
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/schema/" + currentRestResource + test.url + " (CONSTRAINABLE)",
                index: index,
                apiVersion: apiVersion,
                resource: currentRestResource,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.SCHEMA_FURTHER_DESCRIBING_PARAMETERS_WITH_CONSTRAINTS,
            }
            schemaFurtherDescribingResultsParamTests.push(TestObjectBuilder.getTestObject(testObjParams));

            //XSD DESCRIBING RESULTS TESTS (USING DSDs,DFs,PRAs WITH NO CONNECTION TO CONSTRAINT)
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/schema/" + currentRestResource + test.url + " (RANDOM)",
                index: index,
                apiVersion: apiVersion,
                resource: currentRestResource,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.SCHEMA_FURTHER_DESCRIBING_PARAMETERS_WITH_NO_CONSTRAINTS,
            }
            schemaFurtherDescribingResultsParamTests.push(TestObjectBuilder.getTestObject(testObjParams));
        };
        return schemaFurtherDescribingResultsParamTests;
    }
    
}

module.exports = SchemaFurtherDescribingResultsParamTestsBuilder;