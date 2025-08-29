const { TEST_TYPE, TEST_INDEX} = require('sdmx-tck-api').constants;
var getResources = require('sdmx-tck-api').constants.getResources;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
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
var RegistrationIdentificationParametersTestBuilder = require('./registry-queries-builders/RegistrationIdentificationParametersTestBuilder.js');

class TestsModelBuilder {
    /**
     * Method that creates the model (object) in which the data of the app will be stored.
    */
    static createTestsModel(apiVersion, indices, requestMode) {
        let structureTests = { numOfTests: 0 };
        let dataTests = { numOfTests: 0 };
        let schemaTests = { numOfTests: 0 };
        let metadataTests = { numOfTests: 0 };
        let registrationTests = { numOfTests: 0 };

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
        if (indices.includes(TEST_INDEX.Registration)) {
            testsStruct.push({ id: TEST_INDEX.Registration, subTests: TestsModelBuilder.getTests(TEST_INDEX.Registration, registrationTests, apiVersion, ''), numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: registrationTests.numOfTests});
        }
        return testsStruct;
    };

    static getTests(index, x, apiVersion, requestMode) {
        if (index === TEST_INDEX.Structure) {
            var allTests = [];

            var arrayOfRestResources = getResources(index,apiVersion,requestMode);
            for (let j = 0; j < arrayOfRestResources.length; j++) {
                let childTests = [];
                childTests = childTests.concat(StructureIdentificationParametersTestsBuilder.getStructureIdentificationParametersTests(index, x, apiVersion, arrayOfRestResources[j], requestMode));
                childTests = childTests.concat(StructureExtendedResourceIdentParamTestsBuilder.getStructureExtendedIdentificationParametersTests(index, x, apiVersion, arrayOfRestResources[j], requestMode));
                childTests = childTests.concat(StructureFurtherDescribingResultsParamTestsBuilder.getFurtherDescribingResultsParamTests(index, x, apiVersion, arrayOfRestResources[j], requestMode));
                childTests = childTests.concat(StructureRepresentationSupportTestsBuilder.getStructureRepresentationSupportTests(index, x, apiVersion, arrayOfRestResources[j], requestMode));

                x.numOfTests = x.numOfTests + 1;
                let parentTest = {
                    testId: "/" + arrayOfRestResources[j] + "/all/all/all",
                    index: index,
                    apiVersion: apiVersion,
                    resource: arrayOfRestResources[j],
                    reqTemplate: { agency: 'all', id: 'all', version: 'all', detail: MetadataDetail.ALL_STUBS },
                    identifiers: { structureType: "", agency: "all", id: "all", version: "all" },
                    testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                    subTests: childTests
                }
                allTests.push(TestObjectBuilder.getTestObject(parentTest));
            }
            return allTests;
        } else if (index === TEST_INDEX.Schema) {
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
        } else if (index === TEST_INDEX.Data) {
            let allTests = [];
            allTests = allTests.concat(DataIdentificationParametersTestBuilder.getTests(index, x, apiVersion));
            allTests = allTests.concat(DataExtendedResourceIdentificationTestBuilder.getTests(index, x, apiVersion));
            allTests = allTests.concat(DataFurtherDescribingResultsTestBuilder.getTests(index, x, apiVersion));
            allTests = allTests.concat(DataRepresentationSupportTestBuilder.getTests(index, x, apiVersion));
            allTests = allTests.concat(DataOtherFeatureTestBuilder.getTests(index, x, apiVersion));
            allTests = allTests.concat(DataAvailabilityTestBuilder.getTests(index, x, apiVersion));
            return allTests;
        } else if (index === TEST_INDEX.Metadata) {
            return [];
        } else if (index === TEST_INDEX.Registration) {
            let allTests = [];
            allTests = allTests.concat(RegistrationIdentificationParametersTestBuilder.getTests(index, x, apiVersion));
            return allTests;
        }
    }
};

module.exports = TestsModelBuilder;