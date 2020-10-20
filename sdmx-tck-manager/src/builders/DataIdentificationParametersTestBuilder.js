const DATA_IDENTIFICATION_PARAMETERS_TESTS = require('../constants/TestConstants.js').DATA_IDENTIFICATION_PARAMETERS_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;

var TestObjectBuilder = require("../builders/TestObjectBuilder.js");

class DataIdentificationParametersTestBuilder {
    
    static getDataIdentificationParametersTests(index,x,apiVersion){
        let dataIdentificationParamTests = [];
        let testObjParams = {};

        var dataIdentificationParamTestsArray = DATA_IDENTIFICATION_PARAMETERS_TESTS();
        for (let i=0;i<dataIdentificationParamTestsArray.length;i++){
            let test = dataIdentificationParamTestsArray[i];
            
            //XSD DESCRIBING RESULTS TESTS (USING DSDs,DFs,PRAs FROM CONSTRAINT)
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/data" + test.url,
                index: index,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.dataflow,
                reqTemplate: test.reqTemplate,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.DATA_IDENTIFICATION_PARAMETERS,
            }
            dataIdentificationParamTests.push(TestObjectBuilder.getTestObject(testObjParams));
        };
        return dataIdentificationParamTests;
    }
}

module.exports = DataIdentificationParametersTestBuilder;