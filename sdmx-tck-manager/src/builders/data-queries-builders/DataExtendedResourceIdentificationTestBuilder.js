const DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS_TESTS = require('../../constants/TestConstants.js').DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;

var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataExtendedResourceIdentificationTestBuilder {
    
    static getDataExtendedResourceIdentificationParametersTests(index,x,apiVersion){
        let dataExtendedResourceIdentificationParamTests = [];
        let testObjParams = {};

        var dataExtendedResourceIdentificationParamTestsArray = DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS_TESTS();
        for (let i=0;i<dataExtendedResourceIdentificationParamTestsArray.length;i++){
            let test = dataExtendedResourceIdentificationParamTestsArray[i];
            
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/data" + test.url,
                index: index,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.dataflow,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                requireRandomKey:true,
                testType: TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS,
            }
            dataExtendedResourceIdentificationParamTests.push(TestObjectBuilder.getTestObject(testObjParams));
        };
        return dataExtendedResourceIdentificationParamTests;
    }
}

module.exports = DataExtendedResourceIdentificationTestBuilder;