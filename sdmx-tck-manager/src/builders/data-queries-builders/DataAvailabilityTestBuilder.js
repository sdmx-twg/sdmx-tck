const DATA_AVAILABILITY_TESTS = require('../../constants/TestConstants.js').DATA_AVAILABILITY_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;

var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataAvailabilityTestBuilder {
    
    static getDataAvailabilityTests(index,x,apiVersion){
        let dataAvailablityTests = [];
        let testObjParams = {};

        var dataAvailabilityTestsArray = DATA_AVAILABILITY_TESTS(apiVersion);
        for (let i=0;i<dataAvailabilityTestsArray.length;i++){
            let test = dataAvailabilityTestsArray[i];
            
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/availableconstraint" + test.url,
                index: index,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.dataflow,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                requireRandomKey:true,
                testType: TEST_TYPE.DATA_AVAILABILITY,
            }
            dataAvailablityTests.push(TestObjectBuilder.getTestObject(testObjParams));
        };
        return dataAvailablityTests;
    }
}

module.exports = DataAvailabilityTestBuilder;