const DATA_OTHER_FEATURES_TESTS = require('../../constants/TestConstants.js').DATA_OTHER_FEATURES_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
<<<<<<< HEAD

=======
const TestUtils = require('sdmx-tck-api').utils.TestUtils;
>>>>>>> v4.8.0
var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataOtherFeatureTestBuilder {
    
<<<<<<< HEAD
    static getDataOtherFeatureTests(index,x,apiVersion){
=======
    static getTests(index, x, apiVersion) {
>>>>>>> v4.8.0
        let dataOtherFeaturesTests = [];
        let testObjParams = {};

        var dataOtherFeaturesTestsArray = DATA_OTHER_FEATURES_TESTS();
        for (let i=0;i<dataOtherFeaturesTestsArray.length;i++){
            let test = dataOtherFeaturesTestsArray[i];
            
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
                testType: TEST_TYPE.DATA_OTHER_FEATURES,
            }
            dataOtherFeaturesTests.push(TestObjectBuilder.getTestObject(testObjParams));
        };
        return dataOtherFeaturesTests;
    }
}

module.exports = DataOtherFeatureTestBuilder;