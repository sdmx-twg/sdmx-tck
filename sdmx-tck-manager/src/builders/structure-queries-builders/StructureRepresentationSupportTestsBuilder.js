
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var TestObjectBuilder = require("../TestObjectBuilder.js");
var STRUCTURES_REPRESENTATIONS_SUPPORT = require('../../constants/TestConstants.js').STRUCTURES_REPRESENTATIONS_SUPPORT;


class StructureRepresentationSupportTestsBuilder{
    static getStructureRepresentationSupportTests(index,x,apiVersion,currentRestResource){
        let structureRepresentationSupportTestsBuilder = []
        let testObjParams = {};

        //Exclude organisationscheme, actualconstraint, allowedconstraint, structure resources from representation tests.
        if (currentRestResource !== STRUCTURES_REST_RESOURCE.organisationscheme &&
            currentRestResource !== STRUCTURES_REST_RESOURCE.allowedconstraint &&
            currentRestResource !== STRUCTURES_REST_RESOURCE.actualconstraint &&
            currentRestResource !== STRUCTURES_REST_RESOURCE.structure) {

                if (currentRestResource === STRUCTURES_REST_RESOURCE.codelist) {
                    let representationTests = STRUCTURES_REPRESENTATIONS_SUPPORT();
                    for (let i in representationTests) {
                        let test = representationTests[i];
                        x.numOfTests = x.numOfTests + 1;

                        testObjParams = {
                            testId: "/" + currentRestResource + test.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: currentRestResource,
                            reqTemplate: test.reqTemplate,
                            requireRandomSdmxObject : true,
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