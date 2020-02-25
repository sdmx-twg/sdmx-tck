const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var getResources = require('sdmx-tck-api').constants.getResources;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
var StructureIdentificationParametersTestsBuilder = require("../builders/StructureIdentificationParametersTestsBuilder.js");
var StructureExtendedResourceIdentParamTestsBuilder = require("../builders/StructureExtendedResourceIdentParamTestsBuilder.js");
var StructureFurtherDescribingResultsParamTestsBuilder = require("../builders/StructureFurtherDescribingResultsParamTestsBuilder.js");
var StructureRepresentationSupportTestsBuilder = require("../builders/StructureRepresentationSupportTestsBuilder.js");

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

            var arrayOfRestResources = getResources(apiVersion)
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
             var ts31 = [];
             var ts32 = [];
             var allTests=[];
             var arrayOfRestResources = getResources(apiVersion)            
             for (let j = 0; j < arrayOfRestResources.length; j++) {
                
                 var found = containsValue(arrayOfRestResources[j]);
                 if(found){

                     var schemaIdentificationArray = SCHEMAS_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT();
                    for (let i=0;i<schemaIdentificationArray.length;i++){
                        let test = schemaIdentificationArray[i];
                        x.numOfTests = x.numOfTests + 1;

                        testObjParams = {
                            testId: "/schema/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            testType: TEST_TYPE.SCHEMA_IDENTIFICATION_PARAMETERS,
                        }
                        ts31.push(TestObjectBuilder.getTestObject(testObjParams));
                    };

                    var schemaFurtherDescribingResultsArray = SCHEMAS_FOR_FURTHER_DESCRIBING_RESULTS()
                    for (let i=0;i<schemaFurtherDescribingResultsArray.length;i++){
                        let test = schemaFurtherDescribingResultsArray[i];
                        x.numOfTests = x.numOfTests + 1;

                        testObjParams = {
                            testId: "/schema/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            testType: TEST_TYPE.SCHEMA_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS,
                        }
                        ts32.push(TestObjectBuilder.getTestObject(testObjParams));
                    };

                    // for(let i=0;i<allTests.length;i++){
                    //     if(allTests[i].testId === )
                    // }
                    x.numOfTests = x.numOfTests + 1;
                    allTests.push({
                        testId: "/" + arrayOfRestResources[j] + "/all/all/all",
                        run: false,
                        apiVersion: apiVersion,
                        state: TEST_STATE.WAITING,
                        reqTemplate: { agency: 'all', id: 'all', version: 'all', detail: MetadataDetail.ALL_STUBS },
                        identifiers: { structureType: "", agency: "all", id: "all", version: "all" },
                        hasChildren: true,
                        requireRandomSdmxObject: true,
                        index: index,
                        resource: arrayOfRestResources[j],
                        failReason: "",
                        testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                        subTests: ts31.concat(ts32)
                    });

                    ts31=[];
                    ts32=[];
                }
            }
            return allTests;
        }else if (index === TEST_INDEX.Data) {
            return [];
        }
    }
};

module.exports = TestsModelBuilder;