<<<<<<< HEAD
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
=======
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const DATA_CONTEXT = require('sdmx-tck-api').constants.DATA_CONTEXT;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS;
const DATA_QUERY_DETAIL = require('sdmx-tck-api').constants.DATA_QUERY_DETAIL;
const TestObjectBuilder = require("../TestObjectBuilder.js");
const TestUtils = require('sdmx-tck-api').utils.TestUtils;

class DataExtendedResourceIdentificationTestBuilder {
    static getTests(index, x, apiVersion) {
        let tests = [];
        let contextList = DATA_CONTEXT.getApplicableValuesList(apiVersion);
        contextList.forEach(context => {
            tests.push(this.getTestsForContext(index, x, apiVersion, context));
        });
        return tests;
    }
    
    static getTestsForContext(index, x, apiVersion, context) {
        let childTests = [];
        DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS.getParameters(apiVersion).forEach(param => {
            x.numOfTests = x.numOfTests + 1;
            let testObjParams = {
                testId: TestUtils.getDataTestId(apiVersion, context, param.key, param.url),
                index: index,
                apiVersion: apiVersion,
                resource: context,
                reqTemplate: param.template,
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                requireRandomKey: true,
                testType: TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS,
            }
            childTests.push(TestObjectBuilder.getTestObject(testObjParams));
        });

        // Create the parent test
        x.numOfTests = x.numOfTests + 1;
        let parentTest = {
            testId: TestUtils.getDataTestId(apiVersion, context, "EXTID_PARENT"),
            index: index,
            apiVersion: apiVersion,
            resource: context,
            reqTemplate: {
                detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY
            },
            identifiers: { structureType: "", agency: "", id: "", version: "" },
            testType: TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS,
            isParent: true,
            subTests: childTests
        }
        return TestObjectBuilder.getTestObject(parentTest);
>>>>>>> v4.8.0
    }
}

module.exports = DataExtendedResourceIdentificationTestBuilder;