const DATA_REPRESENTATION_SUPPORT_TESTS = require('../../constants/TestConstants.js').DATA_REPRESENTATION_SUPPORT_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
<<<<<<< HEAD

=======
const TestUtils = require('sdmx-tck-api').utils.TestUtils;
>>>>>>> v4.8.0
var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataRepresentationSupportTestBuilder {
    
<<<<<<< HEAD
    static getDataRepresentationSupportTests(index,x,apiVersion){
=======
    static getTests(index,x,apiVersion){
>>>>>>> v4.8.0
        let dataRepresentationSupportTests = [];
        let testObjParams = {};

        var dataRepresentationSupportTestsArray = DATA_REPRESENTATION_SUPPORT_TESTS(apiVersion);
        for (let i=0;i<dataRepresentationSupportTestsArray.length;i++){
            let test = dataRepresentationSupportTestsArray[i];
            
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
<<<<<<< HEAD
                testId: "/data" + test.url,
=======
                testId: TestUtils.getDataTestId(apiVersion, 'dataflow', test.key, test.url),
>>>>>>> v4.8.0
                index: index,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.dataflow,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                requireRandomKey:true,
                testType: TEST_TYPE.DATA_REPRESENTATION_SUPPORT_PARAMETERS,
            }
            dataRepresentationSupportTests.push(TestObjectBuilder.getTestObject(testObjParams));
        };
        return dataRepresentationSupportTests;
    }
}

module.exports = DataRepresentationSupportTestBuilder;