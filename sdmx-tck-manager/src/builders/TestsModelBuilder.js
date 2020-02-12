const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;
const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const ITEM_SCHEME_TYPES = require('sdmx-tck-api').constants.ITEM_SCHEME_TYPES;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const SCHEMA_RESOURCES = require('sdmx-tck-api').constants.SCHEMA_RESOURCES;
const containsValue = require('sdmx-tck-api').constants.containsValue;
var getResources = require('sdmx-tck-api').constants.getResources;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");


var STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT = require('../constants/TestConstants.js').STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT;
var STRUCTURE_REFERENCE_PARAMETER_TESTS = require('../constants/TestConstants.js').STRUCTURE_REFERENCE_PARAMETER_TESTS;
var STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS = require('../constants/TestConstants.js').STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS;
var STRUCTURES_REPRESENTATIONS_SUPPORT = require('../constants/TestConstants.js').STRUCTURES_REPRESENTATIONS_SUPPORT;
var STRUCTURE_IDENTIFICATION_PARAMETERS = require('../constants/StructureIdentificationParameters.js').STRUCTURE_IDENTIFICATION_PARAMETERS;
var STRUCTURE_ITEM_QUERIES = require('../constants/ItemQueries.js').STRUCTURE_ITEM_QUERIES;
var SCHEMAS_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT = require('../constants/TestConstants.js').SCHEMAS_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT;
var SCHEMAS_FOR_FURTHER_DESCRIBING_RESULTS = require('../constants/TestConstants.js').SCHEMAS_FOR_FURTHER_DESCRIBING_RESULTS;

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
            var ts21 = [];
            var ts22 = [];
            var ts23 = [];
            var ts24 = [];
            let testObjParams = {};
            let referencePartialSubTest = [];

            var itemReq = [];
            var allTests = [];

            var arrayOfRestResources = getResources(apiVersion)
            for (let j = 0; j < arrayOfRestResources.length; j++) {
                ts21 = [];
                referencePartialSubTest = []

                   //Special case for referencepartial testing in content constraints
                   if(API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"] 
                   && STRUCTURES_REST_RESOURCE.contentconstraint === arrayOfRestResources[j]){    
                    //x.numOfTests = x.numOfTests + 1;               
                    testObjParams={
                        testId: "Test for Reference Partial",
                        index: index,
                        apiVersion: apiVersion,
                        resource: arrayOfRestResources[j],
                        reqTemplate: {references:"descendants"},
                        state: TEST_STATE.WAITING,
                        testType: TEST_TYPE.STRUCTURE_REFERENCE_PARTIAL,
                    }                       
                    referencePartialSubTest.push(TestObjectBuilder.getTestObject(testObjParams));  
                } 

                for (let i in STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT()) {
                    let test = STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT()[i]
                    x.numOfTests = x.numOfTests + 1;
                    
                    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]
                        && ITEM_SCHEME_TYPES.hasOwnProperty(SDMX_STRUCTURE_TYPE.fromRestResource(arrayOfRestResources[j]))
                        && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url) {
                        
                        testObjParams = {
                            testId: "/" + arrayOfRestResources[j] + STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            reqTemplate: STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.template,
                            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                            needsItem:true
                        }
                        itemReq.push(TestObjectBuilder.getTestObject(testObjParams))
                        x.numOfTests = x.numOfTests + 1;
                        if (arrayOfRestResources[j] === STRUCTURES_REST_RESOURCE.categoryscheme
                        && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url) {
                            testObjParams = {
                                testId: "/" + arrayOfRestResources[j] + STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.url,
                                index: index,
                                apiVersion: apiVersion,
                                resource: arrayOfRestResources[j],
                                reqTemplate: STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.template,
                                testType: TEST_TYPE.STRUCTURE_TARGET_CATEGORY,
                                needsItem:true
                            }
                            itemReq.push(TestObjectBuilder.getTestObject(testObjParams))
                            x.numOfTests = x.numOfTests + 1;
                        }      
                        testObjParams = {
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            reqTemplate: test.reqTemplate,
                            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                            subTests: itemReq
                        }
                        ts21.push(TestObjectBuilder.getTestObject(testObjParams))
                        itemReq = [];
                    }else if(API_VERSIONS[apiVersion] >= API_VERSIONS["v1.1.0"]
                    && arrayOfRestResources[j] === STRUCTURES_REST_RESOURCE.categoryscheme
                    && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url){
                        testObjParams = {
                            testId: "/" + arrayOfRestResources[j] + STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            reqTemplate: STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.template,
                            testType: TEST_TYPE.STRUCTURE_TARGET_CATEGORY,
                            needsItem:true
                        }
                        itemReq.push(TestObjectBuilder.getTestObject(testObjParams))
                        x.numOfTests = x.numOfTests + 1;
                        testObjParams = {
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            reqTemplate: test.reqTemplate,
                            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                            subTests: itemReq
                        }
                        ts21.push(TestObjectBuilder.getTestObject(testObjParams))

                        itemReq = [];
                    
                    } else {
                        testObjParams = {
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            reqTemplate: test.reqTemplate,
                            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS
                        }
                        ts21.push(TestObjectBuilder.getTestObject(testObjParams))
                    }
                };
                if(ts21.length !== 0 && referencePartialSubTest.length !==0){
                    x.numOfTests = x.numOfTests + 1
                    ts21 = ts21.concat(referencePartialSubTest)
                }
                ts22 = [];
                ts23 = [];
                ts24 = [];
                /**
                 * Exclude organisationscheme, actualconstraint, allowedconstraint, structure resources from references, detail & representation tests.
                 */
                if (arrayOfRestResources[j] !== STRUCTURES_REST_RESOURCE.organisationscheme &&
                    arrayOfRestResources[j] !== STRUCTURES_REST_RESOURCE.allowedconstraint &&
                    arrayOfRestResources[j] !== STRUCTURES_REST_RESOURCE.actualconstraint &&
                    arrayOfRestResources[j] !== STRUCTURES_REST_RESOURCE.structure) {

                    let referencesTests = STRUCTURE_REFERENCE_PARAMETER_TESTS(arrayOfRestResources[j]);
                    for (let i in referencesTests) {
                        let test = referencesTests[i];
                        x.numOfTests = x.numOfTests + 1;
                        testObjParams = {
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            reqTemplate: test.reqTemplate,
                            testType: TEST_TYPE.STRUCTURE_REFERENCE_PARAMETER
                        }
                        ts22.push(TestObjectBuilder.getTestObject(testObjParams))
                    };


                    for (let i in STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion)) {
                        let test = STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion)[i];
                        x.numOfTests = x.numOfTests + 1;
                        
                        testObjParams = {
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            reqTemplate: test.reqTemplate,
                            testType: TEST_TYPE.STRUCTURE_DETAIL_PARAMETER,
                        }
                        ts23.push(TestObjectBuilder.getTestObject(testObjParams))
                    };
                    if (arrayOfRestResources[j] === STRUCTURES_REST_RESOURCE.codelist) {
                        let representationTests = STRUCTURES_REPRESENTATIONS_SUPPORT();
                        for (let i in representationTests) {
                            let test = representationTests[i];
                            x.numOfTests = x.numOfTests + 1;

                            testObjParams = {
                                testId: "/" + arrayOfRestResources[j] + test.url,
                                index: index,
                                apiVersion: apiVersion,
                                resource: arrayOfRestResources[j],
                                reqTemplate: test.reqTemplate,
                                testType: TEST_TYPE.STRUCTURE_QUERY_REPRESENTATION
                            }
                            ts24.push(TestObjectBuilder.getTestObject(testObjParams))
                        };
                    }

                }

                x.numOfTests = x.numOfTests + 1;
                testObjParams = {
                    testId: "/" + arrayOfRestResources[j] + "/all/all/all",
                    index: index,
                    apiVersion: apiVersion,
                    resource: arrayOfRestResources[j],
                    reqTemplate: { agency: 'all', id: 'all', version: 'all', detail: MetadataDetail.ALL_STUBS },
                    identifiers: { structureType: "", agency: "all", id: "all", version: "all" },
                    testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                    subTests: ts21.concat(ts22.concat(ts23.concat(ts24)))
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

                        ts31.push({
                            testId: "/schema/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            run: false,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType: TEST_TYPE.SCHEMA_IDENTIFICATION_PARAMETERS,
                            subTests: []
                        });
                    };

                    var schemaFurtherDescribingResultsArray = SCHEMAS_FOR_FURTHER_DESCRIBING_RESULTS()
                    for (let i=0;i<schemaFurtherDescribingResultsArray.length;i++){
                        let test = schemaFurtherDescribingResultsArray[i];
                        x.numOfTests = x.numOfTests + 1;

                        ts32.push({
                            testId: "/schema/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            run: false,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType: TEST_TYPE.SCHEMA_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS,
                            subTests: []
                        });
                    };

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