const DATA_REPRESENTATION_SUPPORT_TESTS = require('../../constants/TestConstants.js').DATA_REPRESENTATION_SUPPORT_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;

var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataRepresentationSupportTestBuilder {
    
    static getDataRepresentationSupportTests(index,x,apiVersion){
        let dataRepresentationSupportTests = [];
        let testObjParams = {};

        var dataRepresentationSupportTestsArray = DATA_REPRESENTATION_SUPPORT_TESTS(apiVersion);
        for (let i=0;i<dataRepresentationSupportTestsArray.length;i++){
            let test = dataRepresentationSupportTestsArray[i];
            
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/data" + test.url,
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