<<<<<<< HEAD
const DATA_IDENTIFICATION_PARAMETERS_TESTS = require('../../constants/TestConstants.js').DATA_IDENTIFICATION_PARAMETERS_TESTS;
const DATA_FURTHER_DESCRIBING_RESULTS_TESTS = require('../../constants/TestConstants').DATA_FURTHER_DESCRIBING_RESULTS_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;

var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataFurtherDescribingResultsTestBuilder {
    
    static getDataFurtherDescribingTests(index,x,apiVersion){
        let dataFurtherDescribingResultsTests = [];
        let testObjParams = {};

        var dataFurtherDescribingResultsTestsArray = DATA_FURTHER_DESCRIBING_RESULTS_TESTS(apiVersion);
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
=======
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS = require('sdmx-tck-api').constants.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS;
const DATA_CONTEXT = require('sdmx-tck-api').constants.DATA_CONTEXT;
const TestUtils = require('sdmx-tck-api').utils.TestUtils;
var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataFurtherDescribingResultsTestBuilder {
    static getTests(index, x, apiVersion) {
        let tests = [];
        let contextList = DATA_CONTEXT.getApplicableValuesList(apiVersion);
        contextList.forEach(context => {
            tests = tests.concat(this.getTestsForContext(index, x, apiVersion, context));
        });
        return tests;
    }

    static getTestsForContext(index, x, apiVersion, context) {
        let tests = [];
        DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.getParameters(apiVersion).forEach(param => {
            x.numOfTests = x.numOfTests + 1;
            let testObjParams = {
                testId: TestUtils.getDataTestId(apiVersion, context, param.key, param.url),
                index: index,
                apiVersion: apiVersion,
                resource: context,
                reqTemplate: param.template,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS,
            }
            tests.push(TestObjectBuilder.getTestObject(testObjParams));
        });
        return tests;
>>>>>>> v4.8.0
    }
}

module.exports = DataFurtherDescribingResultsTestBuilder;