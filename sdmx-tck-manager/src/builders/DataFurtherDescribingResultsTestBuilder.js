const DATA_IDENTIFICATION_PARAMETERS_TESTS = require('../constants/TestConstants.js').DATA_IDENTIFICATION_PARAMETERS_TESTS;
const DATA_FURTHER_DESCRIBING_RESULTS_TESTS = require('../constants/TestConstants').DATA_FURTHER_DESCRIBING_RESULTS_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;

var TestObjectBuilder = require("./TestObjectBuilder.js");

class DataFurtherDescribingResultsTestBuilder {
    
    static getDataFurtherDescribingTests(index,x,apiVersion){
        let dataFurtherDescribingResultsTests = [];
        let testObjParams = {};

        var dataFurtherDescribingResultsTestsArray = DATA_FURTHER_DESCRIBING_RESULTS_TESTS();
        for (let i=0;i<dataFurtherDescribingResultsTestsArray.length;i++){
            let test = dataFurtherDescribingResultsTestsArray[i];
            
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/data" + test.url,
                index: index,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.dataflow,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS,
            }
            dataFurtherDescribingResultsTests.push(TestObjectBuilder.getTestObject(testObjParams));
        };
        return dataFurtherDescribingResultsTests;
    }
}

module.exports = DataFurtherDescribingResultsTestBuilder;