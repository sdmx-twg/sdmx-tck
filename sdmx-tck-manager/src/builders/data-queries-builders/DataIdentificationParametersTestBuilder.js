<<<<<<< HEAD
const DATA_IDENTIFICATION_PARAMETERS_TESTS = require('../../constants/TestConstants.js').DATA_IDENTIFICATION_PARAMETERS_TESTS;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;

var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataIdentificationParametersTestBuilder {
    
    static getDataIdentificationParametersTests(index,x,apiVersion){
        let dataIdentificationParamTests = [];
        let testObjParams = {};

        var dataIdentificationParamTestsArray = DATA_IDENTIFICATION_PARAMETERS_TESTS(apiVersion);
        for (let i=0;i<dataIdentificationParamTestsArray.length;i++){
            let test = dataIdentificationParamTestsArray[i];
            
            x.numOfTests = x.numOfTests + 1;
            testObjParams = {
                testId: "/data" + test.url,
                index: index,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.dataflow,
                reqTemplate: test.reqTemplate,
=======
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const DATA_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.DATA_IDENTIFICATION_PARAMETERES;
var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataIdentificationParametersTestBuilder {
    static getTests(index, x, apiVersion) {
        let dataIdentificationParamTests = [];
        DATA_IDENTIFICATION_PARAMETERS.getParameters(apiVersion).forEach(param => {
            x.numOfTests = x.numOfTests + 1;
            let testObjParams = {
                testId: "(" + param.key +  ") /data" + param.url,
                index: index,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.dataflow,
                reqTemplate: param.template,
>>>>>>> v4.8.0
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.DATA_IDENTIFICATION_PARAMETERS,
            }
            dataIdentificationParamTests.push(TestObjectBuilder.getTestObject(testObjParams));
<<<<<<< HEAD
        };
=======
        });
>>>>>>> v4.8.0
        return dataIdentificationParamTests;
    }
}

module.exports = DataIdentificationParametersTestBuilder;