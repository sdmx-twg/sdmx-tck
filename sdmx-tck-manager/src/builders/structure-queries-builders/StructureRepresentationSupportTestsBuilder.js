
const { TEST_TYPE,
    STRUCTURES_REST_RESOURCE,
    TEST_REQUEST_MODE
} = require('sdmx-tck-api').constants;
const { STRUCTURES_REPRESENTATIONS_SUPPORT } = require('../../constants/TestConstants.js');
var TestObjectBuilder = require("../TestObjectBuilder.js");

class StructureRepresentationSupportTestsBuilder {
    static getStructureRepresentationSupportTests(index, x, apiVersion, currentRestResource, requestMode) {
        let structureRepresentationSupportTestsBuilder = [];

        if (requestMode === TEST_REQUEST_MODE.FULL || requestMode === TEST_REQUEST_MODE.BASIC) {
            if (currentRestResource === STRUCTURES_REST_RESOURCE.codelist) {
                let representationTests = STRUCTURES_REPRESENTATIONS_SUPPORT(apiVersion);
                for (let i in representationTests) {
                    let test = representationTests[i];
                    x.numOfTests = x.numOfTests + 1;

                    let testObjParams = {
                        testId: "/" + currentRestResource + test.url,
                        index: index,
                        apiVersion: apiVersion,
                        resource: currentRestResource,
                        reqTemplate: test.reqTemplate,
                        requireRandomSdmxObject: true,
                        testType: TEST_TYPE.STRUCTURE_QUERY_REPRESENTATION
                    }
                    structureRepresentationSupportTestsBuilder.push(TestObjectBuilder.getTestObject(testObjParams))
                };
            }
        }
        return structureRepresentationSupportTestsBuilder;
    }
}
module.exports = StructureRepresentationSupportTestsBuilder;