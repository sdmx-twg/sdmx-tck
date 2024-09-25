const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const DATA_CONTEXT = require('sdmx-tck-api').constants.DATA_CONTEXT;
const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS
const DATA_AVAILABILITY = require('sdmx-tck-api').constants.DATA_AVAILABILITY;
const STRUCTURE_QUERY_REPRESENTATIONS = require('sdmx-tck-api').constants.STRUCTURE_QUERY_REPRESENTATIONS;
const TestUtils = require('sdmx-tck-api').utils.TestUtils;
var TestObjectBuilder = require("../TestObjectBuilder.js");

class DataAvailabilityTestBuilder {
    static getTests(index, x, apiVersion) {
        let dataAvailablityTests = [];
        // Data availability queries were instroduced on version 1.3.0 of the REST api.
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
            let contextList = DATA_CONTEXT.getApplicableValuesList(apiVersion);
            contextList.forEach(context => {
                dataAvailablityTests.push(DataAvailabilityTestBuilder.getTestsForContext(index, x, apiVersion, context));
            });
        }
        return dataAvailablityTests;
    }
    
    static getTestsForContext(index, x, apiVersion, context) {
        // Create the list of child tests
        let structureFormat = STRUCTURE_QUERY_REPRESENTATIONS.getXMLRepresentation(apiVersion);
        let childTests = [];
        DATA_AVAILABILITY.getParameters(apiVersion, context).forEach((test) => {
            x.numOfTests = x.numOfTests + 1;
            let testObjParams = {
                testId: TestUtils.getDataAvailabilityTestId(apiVersion, context, test.key, test.url),
                index: index,
                apiVersion: apiVersion,
                resource: DATA_CONTEXT.getRestResource(context),
                reqTemplate: {...test.template, representation: structureFormat},
                identifiers: { structureType: "", agency: "", id: "", version: "" },
                requireRandomKey: true,
                testType: TEST_TYPE.DATA_AVAILABILITY,
            }
            childTests.push(TestObjectBuilder.getTestObject(testObjParams));
        });

        // Create the parent test
        x.numOfTests = x.numOfTests + 1;
        let parentTest = {
            testId: TestUtils.getDataAvailabilityTestId(apiVersion, context, "AVAILABILITY_PARENT"),
            index: index,
            apiVersion: apiVersion,
            resource: DATA_CONTEXT.getRestResource(context),
            reqTemplate: {representation: structureFormat},
            identifiers: { structureType: "", agency: "", id: "", version: "" },
            testType: TEST_TYPE.DATA_AVAILABILITY,
            isParent: true,
            subTests: childTests
        }
        return TestObjectBuilder.getTestObject(parentTest);
    }
}

module.exports = DataAvailabilityTestBuilder;