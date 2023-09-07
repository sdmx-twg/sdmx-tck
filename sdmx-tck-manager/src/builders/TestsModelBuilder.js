const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var getResources = require('sdmx-tck-api').constants.getResources;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
const DATA_QUERY_DETAIL = require("sdmx-tck-api").constants.DATA_QUERY_DETAIL;
const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
var StructureIdentificationParametersTestsBuilder = require("../builders/structure-queries-builders/StructureIdentificationParametersTestsBuilder.js");
var StructureExtendedResourceIdentParamTestsBuilder = require("../builders/structure-queries-builders/StructureExtendedResourceIdentParamTestsBuilder.js");
var StructureFurtherDescribingResultsParamTestsBuilder = require("../builders/structure-queries-builders/StructureFurtherDescribingResultsParamTestsBuilder.js");
var StructureRepresentationSupportTestsBuilder = require("../builders/structure-queries-builders/StructureRepresentationSupportTestsBuilder.js");
var SchemaIdentificationParametersTestBuilder = require("../builders/schema-queries-builders/SchemaIdentificationParametersTestBuilder.js");
var SchemaFurtherDescribingResultsParamTestsBuilder = require("../builders/schema-queries-builders/SchemaFurtherDescribingResultsParamTestsBuilder.js")
var DataIdentificationParametersTestBuilder = require("../builders/data-queries-builders/DataIdentificationParametersTestBuilder.js")
var DataExtendedResourceIdentificationTestBuilder = require('../builders/data-queries-builders/DataExtendedResourceIdentificationTestBuilder.js');
var DataRepresentationSupportTestBuilder = require('../builders/data-queries-builders/DataRepresentationSupportTestBuilder.js')
var DataFurtherDescribingResultsTestBuilder = require('./data-queries-builders/DataFurtherDescribingResultsTestBuilder.js');
var DataAvailabilityTestBuilder = require('./data-queries-builders/DataAvailabilityTestBuilder.js')
var DataOtherFeatureTestBuilder = require('./data-queries-builders/DataOtherFeatureTestBuilder.js')

class TestsModelBuilder {
    /**
     * Method that creates the model (object) in which the data of the app will be stored.
    */
    static createTestsModel(apiVersion, indices, requestMode) {
        let structureTests = { numOfTests: 0 };
        let dataTests = { numOfTests: 0 };
        let schemaTests = { numOfTests: 0 };
        let metadataTests = { numOfTests: 0 };

        let testsStruct = [];
        if (indices.includes(TEST_INDEX.Structure)) {
            testsStruct.push({ id: TEST_INDEX.Structure, subTests: TestsModelBuilder.getTests(TEST_INDEX.Structure, structureTests, apiVersion, requestMode), numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: structureTests.numOfTests });
        }
        if (indices.includes(TEST_INDEX.Data)) {
            testsStruct.push({ id: TEST_INDEX.Data, subTests: TestsModelBuilder.getTests(TEST_INDEX.Data, dataTests, apiVersion, ''), numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: dataTests.numOfTests });
        }
        if (indices.includes(TEST_INDEX.Schema)) {
            testsStruct.push({ id: TEST_INDEX.Schema, subTests: TestsModelBuilder.getTests(TEST_INDEX.Schema, schemaTests, apiVersion, ''), numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: schemaTests.numOfTests });
        }
        if (indices.includes(TEST_INDEX.Metadata)) {
            testsStruct.push({ id: TEST_INDEX.Metadata, subTests: [], numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: metadataTests.numOfTests});
        }
        return testsStruct;
    };

    static getTests(index, x, apiVersion, requestMode) {
        if (index === TEST_INDEX.Structure) {
            let structTest1 = [];
            let structTest2 = [];
            let structTest3 = [];
            let structTest4 = [];
            let testObjParams = {};
            var allTests = [];

            var arrayOfRestResources = getResources(index,apiVersion,requestMode);
            for (let j = 0; j < arrayOfRestResources.length; j++) {

                //Structure Resource Identification Parameters Tests
                structTest1 = StructureIdentificationParametersTestsBuilder.getStructureIdentificationParametersTests(index,x,apiVersion,arrayOfRestResources[j])
                
                //Structure Extended Resource Identification Parameters Tests
                structTest2 = StructureExtendedResourceIdentParamTestsBuilder.getStructureExtendedIdentificationParametersTests(index,x,apiVersion,arrayOfRestResources[j],requestMode);
                
                //Structure Further Describing Results Parameters Tests
                structTest3 = StructureFurtherDescribingResultsParamTestsBuilder.getFurtherDescribingResultsParamTests(index,x,apiVersion,arrayOfRestResources[j],requestMode);
                
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
            let dataTest1 = [];
            let dataTest2 = [];
            let dataTest3 = [];
            let dataTest4 = [];
            let dataTest5 = [];
            let dataTest6 = [];
            let allTests = [];
           
            dataTest1 = DataIdentificationParametersTestBuilder.getDataIdentificationParametersTests(index,x,apiVersion)

            x.numOfTests = x.numOfTests + 1;
            let testObjParams = {
                testId: "/data/agency,id,version/all",
                index: index,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.dataflow,
                reqTemplate: {detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"},
                identifiers: {structureType: "", agency: "", id: "", version: "" },
                testType: TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS,
                subTests: DataExtendedResourceIdentificationTestBuilder.getDataExtendedResourceIdentificationParametersTests(index,x,apiVersion)
            }
            dataTest2 = dataTest2.concat(TestObjectBuilder.getTestObject(testObjParams));

            dataTest3 = DataFurtherDescribingResultsTestBuilder.getDataFurtherDescribingTests(index,x,apiVersion)

            dataTest4 = DataRepresentationSupportTestBuilder.getDataRepresentationSupportTests(index,x,apiVersion)
            dataTest5 = DataOtherFeatureTestBuilder.getDataOtherFeatureTests(index,x,apiVersion)

            if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
                x.numOfTests = x.numOfTests + 1;
                let testObjParams = {
                    testId: "/availableconstraint/agency,dataflowId,version/all",
                    index: index,
                    apiVersion: apiVersion,
                    resource: STRUCTURES_REST_RESOURCE.dataflow,
                    reqTemplate: {},
                    identifiers: {structureType: "", agency: "", id: "", version: "" },
                    testType: TEST_TYPE.DATA_AVAILABILITY ,
                    subTests: DataAvailabilityTestBuilder.getDataAvailabilityTests(index,x,apiVersion)
                }
                dataTest6 = dataTest6.concat(TestObjectBuilder.getTestObject(testObjParams))
            }

            allTests = allTests.concat(dataTest1.concat(dataTest2.concat(dataTest3.concat(dataTest4.concat(dataTest5.concat(dataTest6))))))
            
            return allTests;
        }else if (index === TEST_INDEX.Metadata) {
            return [];
        }
    }
};

module.exports = TestsModelBuilder;