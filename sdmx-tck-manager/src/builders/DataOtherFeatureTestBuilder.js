const DATA_OTHER_FEATURES_TESTS = require('../constants/TestConstants.js').DATA_OTHER_FEATURES_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;

var TestObjectBuilder = require("../builders/TestObjectBuilder.js");

class DataOtherFeatureTestBuilder {
    
    static getDataOtherFeatureTests(index,x,apiVersion){
        let dataOtherFeaturesTests = [];
        let testObjParams = {};

        var dataOtherFeaturesTestsArray = DATA_OTHER_FEATURES_TESTS();
        for (let i=0;i<dataOtherFeaturesTestsArray.length;i++){
            let test = dataOtherFeaturesTestsArray[i];
            
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/data" + test.url,
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