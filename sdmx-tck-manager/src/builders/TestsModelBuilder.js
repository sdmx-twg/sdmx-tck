const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;
const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;

const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const ITEM_SCHEME_TYPES = require('sdmx-tck-api').constants.ITEM_SCHEME_TYPES;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var getResources = require('sdmx-tck-api').constants.getResources;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;


var STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT = require('../constants/TestConstants.js').STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT;
var STRUCTURE_REFERENCE_PARAMETER_TESTS = require('../constants/TestConstants.js').STRUCTURE_REFERENCE_PARAMETER_TESTS;
var STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS = require('../constants/TestConstants.js').STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS;
var STRUCTURES_REPRESENTATIONS_SUPPORT = require('../constants/TestConstants.js').STRUCTURES_REPRESENTATIONS_SUPPORT;
var STRUCTURE_IDENTIFICATION_PARAMETERS = require('../constants/StructureIdentificationParameters.js').STRUCTURE_IDENTIFICATION_PARAMETERS;
var STRUCTURE_ITEM_QUERIES = require('../constants/ItemQueries.js').STRUCTURE_ITEM_QUERIES;

class TestsModelBuilder {
    /**
     * Method that creates the model (object) in which the data of the app will be stored.
    */
    static createTestsModel(apiVersion) {
        let structureTests = { numOfTests: 0 };
        let dataTests = { numOfTests: 0 };

        let testsStruct = [
            { id: TEST_INDEX.Structure, subTests: TestsModelBuilder.getTests(TEST_INDEX.Structure, structureTests, apiVersion), numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: structureTests.numOfTests },
            { id: TEST_INDEX.Data, subTests: TestsModelBuilder.getTests(TEST_INDEX.Data, dataTests, apiVersion), sumOfTests: dataTests.numOfTests },
            { id: TEST_INDEX.Schema, subTests: [] },
            { id: TEST_INDEX.Metadata, subTests: [] }
        ]
        return testsStruct;
    };

    static getTests(index, x, apiVersion) {
        if (index === TEST_INDEX.Structure) {
            var ts21 = [];
            var ts22 = [];
            var ts23 = [];
            var ts24 = [];

            var itemReq = [];
            var allTests = [];

            var arrayOfRestResources = getResources(apiVersion)
            for (let j = 0; j < arrayOfRestResources.length; j++) {
                ts21 = [];
                for (let i in STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT()) {
                    let test = STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT()[i]
                    x.numOfTests = x.numOfTests + 1;

                    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]
                        && ITEM_SCHEME_TYPES.hasOwnProperty(SDMX_STRUCTURE_TYPE.fromRestResource(arrayOfRestResources[j]))
                        && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url) {

                        itemReq.push({
                            testId: "/" + arrayOfRestResources[j] + STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.url,
                            index: index,
                            run: false,
                            items: [],
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            requireItems: true,
                            reqTemplate: STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.url.template,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                            subTests: []
                        })
                        x.numOfTests = x.numOfTests + 1;
                        ts21.push({
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            run: false,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                            subTests: itemReq
                        })

                        itemReq = [];
                    } else {
                        ts21.push({
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            run: false,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                            subTests: []
                        })
                    }
                };
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

                        ts22.push({
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            run: false,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType: TEST_TYPE.STRUCTURE_REFERENCE_PARAMETER,
                            subTests: []
                        });
                    };


                    for (let i in STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion)) {
                        let test = STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion)[i];
                        x.numOfTests = x.numOfTests + 1;

                        ts23.push({
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            run: false,
                            apiVersion: apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType: TEST_TYPE.STRUCTURE_DETAIL_PARAMETER,
                            subTests: []
                        });
                    };
                    if (arrayOfRestResources[j] === STRUCTURES_REST_RESOURCE.codelist) {
                        let representationTests = STRUCTURES_REPRESENTATIONS_SUPPORT();
                        for (let i in representationTests) {
                            let test = representationTests[i];
                            x.numOfTests = x.numOfTests + 1;

                            ts24.push({
                                testId: "/" + arrayOfRestResources[j] + test.url,
                                index: index,
                                run: false,
                                apiVersion: apiVersion,
                                resource: arrayOfRestResources[j],
                                requireRandomSdmxObject: true,
                                reqTemplate: test.reqTemplate,
                                identifiers: { structureType: "", agency: "", id: "", version: "" },
                                state: TEST_STATE.WAITING,
                                failReason: "",
                                testType: TEST_TYPE.STRUCTURE_QUERY_REPRESENTATION,
                                subTests: [],
                            });
                        };
                    }

                }

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
                    subTests: ts21.concat(ts22.concat(ts23.concat(ts24)))
                });
            }
            return allTests;
        } else if (index === TEST_INDEX.Data) {
            return [];
        }
    }
};

module.exports = TestsModelBuilder;