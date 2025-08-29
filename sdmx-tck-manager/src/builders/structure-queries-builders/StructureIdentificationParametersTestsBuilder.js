var TestObjectBuilder = require("../TestObjectBuilder.js");
const {
    API_VERSIONS,
    TEST_TYPE,
    SDMX_STRUCTURE_TYPE,
    ITEM_SCHEME_TYPES,
    STRUCTURES_REST_RESOURCE,
    TEST_REQUEST_MODE,
    STRUCTURE_IDENTIFICATION_PARAMETERS,
    STRUCTURE_ITEM_QUERIES
} = require('sdmx-tck-api').constants;

class StructureIdentificationParametersTestsBuilder {

    static getStructureIdentificationParametersTests(index, x, apiVersion, currentRestResource, requestMode) {
        let structureIdentificationParametersTests = [];
        
        let params = STRUCTURE_IDENTIFICATION_PARAMETERS.getValues(apiVersion, currentRestResource, requestMode);
        for (let test of params) {
            var itemReq = [];
            
            if (requestMode === TEST_REQUEST_MODE.FULL || requestMode === TEST_REQUEST_MODE.BASIC) {
                if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]
                    && ITEM_SCHEME_TYPES.hasOwnProperty(SDMX_STRUCTURE_TYPE.fromRestResource(currentRestResource))
                    && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url) {

                    let childParams = {
                        testId: "/" + currentRestResource + STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.url,
                        index: index,
                        apiVersion: apiVersion,
                        resource: currentRestResource,
                        reqTemplate: STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.template,
                        testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                        needsItem: true,
                        requireRandomSdmxObject: true
                    }
                    itemReq.push(TestObjectBuilder.getTestObject(childParams))
                    x.numOfTests = x.numOfTests + 1;
                }
                if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.1.0"]
                    && currentRestResource === STRUCTURES_REST_RESOURCE.categoryscheme
                    && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url) {
                    let childParams = {
                        testId: "/" + currentRestResource + STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.url,
                        index: index,
                        apiVersion: apiVersion,
                        resource: currentRestResource,
                        reqTemplate: STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.template,
                        testType: TEST_TYPE.STRUCTURE_TARGET_CATEGORY,
                        needsItem: true,
                        requireRandomSdmxObject: true
                    }
                    itemReq.push(TestObjectBuilder.getTestObject(childParams))
                    x.numOfTests = x.numOfTests + 1;
                }
            }

            let testObjParams = {
                testId: "/" + currentRestResource + test.url,
                index: index,
                apiVersion: apiVersion,
                resource: currentRestResource,
                reqTemplate: test.template,
                testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                subTests: itemReq,
                requireRandomSdmxObject : true
            }
            structureIdentificationParametersTests.push(TestObjectBuilder.getTestObject(testObjParams));
            x.numOfTests = x.numOfTests + 1;
        };
        return structureIdentificationParametersTests;
    }
}

module.exports = StructureIdentificationParametersTestsBuilder;