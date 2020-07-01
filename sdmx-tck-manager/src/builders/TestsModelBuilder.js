const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var getResources = require('sdmx-tck-api').constants.getResources;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
var StructureIdentificationParametersTestsBuilder = require("../builders/StructureIdentificationParametersTestsBuilder.js");
var StructureExtendedResourceIdentParamTestsBuilder = require("../builders/StructureExtendedResourceIdentParamTestsBuilder.js");
var StructureFurtherDescribingResultsParamTestsBuilder = require("../builders/StructureFurtherDescribingResultsParamTestsBuilder.js");
var StructureRepresentationSupportTestsBuilder = require("../builders/StructureRepresentationSupportTestsBuilder.js");
var SchemaIdentificationParametersTestBuilder = require("../builders/SchemaIdentificationParametersTestBuilder.js");
var SchemaFurtherDescribingResultsParamTestsBuilder = require("../builders/SchemaFurtherDescribingResultsParamTestsBuilder.js")
class TestsModelBuilder {
    /**
     * Method that creates the model (object) in which the data of the app will be stored.
    */
    static createTestsModel(apiVersion, indices) {
        let structureTests = { numOfTests: 0 };
        let dataTests = { numOfTests: 0 };
        let schemaTests = { numOfTests: 0 };
        let metadataTests = { numOfTests: 0 };

        let testsStruct = [];
        if (indices.includes(TEST_INDEX.Structure)) {
            testsStruct.push({ id: TEST_INDEX.Structure, subTests: TestsModelBuilder.getTests(TEST_INDEX.Structure, structureTests, apiVersion), numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: structureTests.numOfTests });
        }
        if (indices.includes(TEST_INDEX.Data)) {
            testsStruct.push({ id: TEST_INDEX.Data, subTests: TestsModelBuilder.getTests(TEST_INDEX.Data, dataTests, apiVersion), numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: dataTests.numOfTests });
        }
        if (indices.includes(TEST_INDEX.Schema)) {
            testsStruct.push({ id: TEST_INDEX.Schema, subTests: TestsModelBuilder.getTests(TEST_INDEX.Schema, schemaTests, apiVersion), numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: schemaTests.numOfTests });
        }
        if (indices.includes(TEST_INDEX.Metadata)) {
            testsStruct.push({ id: TEST_INDEX.Metadata, subTests: [], numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: metadataTests.numOfTests});
        }
        return testsStruct;
    };

    static getTests(index, x, apiVersion) {
        if (index === TEST_INDEX.Structure) {
            
            let structTest1 = [];
            let structTest2 = [];
            let structTest3 = [];
            let structTest4 = [];
            let testObjParams = {};
            var allTests = [];

            var arrayOfRestResources = getResources(index,apiVersion)
            for (let j = 0; j < arrayOfRestResources.length; j++) {

                //Structure Resource Identification Parameters Tests
                structTest1 = StructureIdentificationParametersTestsBuilder.getStructureIdentificationParametersTests(index,x,apiVersion,arrayOfRestResources[j])
                
                //Structure Extended Resource Identification Parameters Tests
                structTest2 = StructureExtendedResourceIdentParamTestsBuilder.getStructureExtendedIdentificationParametersTests(index,x,apiVersion,arrayOfRestResources[j]);
                
                //Structure Further Describing Results Parameters Tests
                structTest3 = StructureFurtherDescribingResultsParamTestsBuilder.getFurtherDescribingResultsParamTests(index,x,apiVersion,arrayOfRestResources[j]);
                
                //Structure Representations Support Tests
                structTest4 = StructureRepresentationSupportTestsBuilder.getStructureRepresentationSupportTests(index,x,apiVersion,arrayOfRestResources[j]);

                x.numOfTests = x.numOfTests + 1;
                testObjParams = {
                    testId: "/" + arrayOfRestResources[j] + "/all/all/all",
                    index: index,
                    apiVersion: apiVersion,
                    resource: arrayOfRestResources[j],
                    reqTemplate: { agency: 'all', id: 'all', version: 'all', detail: MetadataDetail.ALL_STUBS },
                    identifiers: { structureType: "", agency: "all", id: "all", version: "all" },
                    testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                    subTests: structTest1.concat(structTest2.concat(structTest3.concat(structTest4)))
                }
                allTests.push(TestObjectBuilder.getTestObject(testObjParams))
            }
            return allTests;
        }else if(index === TEST_INDEX.Schema){
            let schemaTest1 = [];
            let schemaTest2 = [];
            var allTests=[];
            var arrayOfRestResources = getResources(index,apiVersion)            
            for (let j = 0; j < arrayOfRestResources.length; j++) {
                schemaTest1 = [];
                schemaTest2 = [];
                
                schemaTest1 = schemaTest1.concat(SchemaIdentificationParametersTestBuilder.getSchemaIdentificationParametersTests(index,x,apiVersion,arrayOfRestResources[j]));
                schemaTest2 = schemaTest1.concat(SchemaFurtherDescribingResultsParamTestsBuilder.getSchemaFurtherDescribingResultsParamTests(index,x,apiVersion,arrayOfRestResources[j]))
                allTests = allTests.concat(schemaTest2)
            }
            
            
            return allTests;
        }else if (index === TEST_INDEX.Data) {
            return [];
        }else if (index === TEST_INDEX.Metadata) {
            return [];
        }
    }
};

module.exports = TestsModelBuilder;