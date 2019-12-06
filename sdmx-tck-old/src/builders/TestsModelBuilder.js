import { STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT, STRUCTURE_REFERENCE_PARAMETER_TESTS,STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS,STRUCTURES_REPRESENTATIONS_SUPPORT } from '../constants/TestConstants';
import {getResources,STRUCTURES_REST_RESOURCE} from "../constants/StructuresRestResources";
import SemanticChecker from '../checker/StructuresSemanticChecker';
import { TEST_STATE } from '../constants/AppConstants';
import  STRUCTURE_ITEM_QUERIES  from '../constants/ItemQueries';
import API_VERSION from '../constants/ApiVersions';
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';
import ITEM_SCHEME_TYPES from '../constants/ItemSchemeTypes';
import STRUCTURE_IDENTIFICATION_PARAMETERS from '../constants/StructureIdentificationParameters';
import STRUCTURES_TEST_TYPES from '../constants/StructuresTestTypes';

const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;

class TestsModelBuilder {

    static indices = ['Structure', 'Data', 'Schema', 'Metadata'];

    static getIndex = (index) => {
        return this.indices[index];
    };

    /**
     * Method that creates the model (object) in which the data of the app will be stored.
    */
    static createTestsModel = (apiVersion) => {
        let structureTests = { numOfTests: 0 };
        let dataTests = { numOfTests: 0 };
        
        let testsStruct = [
            { id: this.indices[0], subTests: TestsModelBuilder.getTests(this.indices[0], structureTests,apiVersion), numOfValidTestResponses: 0, numOfValidRequests: 0, numOfRunTests: 0, sumOfTests: structureTests.numOfTests },
            { id: this.indices[1], subTests: TestsModelBuilder.getTests(this.indices[1], dataTests,apiVersion), sumOfTests: dataTests.numOfTests },
            { id: this.indices[2], subTests: [] },
            { id: this.indices[3], subTests: [] }
        ]
        return testsStruct;
    };

    static getTests = (index, x,apiVersion) => {
        if (index === "Structure") {
            var ts21 = [];
            var ts22 = [];
            var ts23 = [];
            var ts24 = [];

            var itemReq = [];
            var allTests = [];

            var arrayOfRestResources = getResources(apiVersion)
            for (let j=0;j<arrayOfRestResources.length;j++) {
                ts21 = [];
                for (let i in STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT()) {
                    let test = STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT()[i]
                    x.numOfTests = x.numOfTests + 1;

                    if(API_VERSION[apiVersion] >= API_VERSION["v1.3.0"] 
                    && ITEM_SCHEME_TYPES.hasProp(SDMX_STRUCTURE_TYPE.fromRestResource(arrayOfRestResources[j]))
                    && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url){
                        
                        itemReq.push({
                            testId: "/" + arrayOfRestResources[j] + STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.url,
                            index: index,
                            run: false,
                            items: [],
                            apiVersion:apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            requireItems: true,
                            reqTemplate: STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.url.template,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType:STRUCTURES_TEST_TYPES.STRUCTURE_IDENTIFICATION_PARAMETERS,
                            subTests: [],
                            callback: SemanticChecker.checkIdentification
                        })
                        x.numOfTests = x.numOfTests + 1;
                        ts21.push({
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            run: false,
                            apiVersion:apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType:STRUCTURES_TEST_TYPES.STRUCTURE_IDENTIFICATION_PARAMETERS,
                            subTests: itemReq,
                            callback: SemanticChecker.checkIdentification
                        })

                        itemReq=[];
                    }else{
                        ts21.push({
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            run: false,
                            apiVersion:apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType:STRUCTURES_TEST_TYPES.STRUCTURE_IDENTIFICATION_PARAMETERS,
                            subTests: [],
                            callback: SemanticChecker.checkIdentification
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
                            testType: STRUCTURES_TEST_TYPES.STRUCTURE_REFERENCE_PARAMETER,
                            subTests: [],
                            callback: SemanticChecker.checkReferences
                        });
                    };


                    for (let i in STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion)) {
                        let test = STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion)[i];
                        x.numOfTests = x.numOfTests + 1;
    
                        ts23.push({
                            testId: "/" + arrayOfRestResources[j] + test.url,
                            index: index,
                            run: false,
                            apiVersion:apiVersion,
                            resource: arrayOfRestResources[j],
                            requireRandomSdmxObject: true,
                            reqTemplate: test.reqTemplate,
                            identifiers: { structureType: "", agency: "", id: "", version: "" },
                            state: TEST_STATE.WAITING,
                            failReason: "",
                            testType:STRUCTURES_TEST_TYPES.STRUCTURE_DETAIL_PARAMETER,
                            subTests: [],
                            callback: SemanticChecker.checkDetails
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
                                testType: STRUCTURES_TEST_TYPES.STRUCTURE_QUERY_REPRESENTATION,
                                subTests: [],
                                callback: ""
                            });
                        };
                    }
                    
                }

                x.numOfTests = x.numOfTests + 1;
                allTests.push({
                    testId: "/" + arrayOfRestResources[j] + "/all/all/all",
                    run: false,
                    apiVersion:apiVersion,
                    state: TEST_STATE.WAITING,
                    reqTemplate: { agency: 'all', id: 'all', version: 'all', detail: MetadataDetail.ALL_STUBS },
                    identifiers: { structureType: "", agency: "all", id: "all", version: "all" },
                    hasChildren: true,
                    requireRandomSdmxObject: true,
                    index: index,
                    resource: arrayOfRestResources[j],
                    failReason: "",
                    testType:"",
                    subTests: ts21.concat(ts22.concat(ts23.concat(ts24))),
                    callback: SemanticChecker.checkIdentification
                });
            }
            return allTests;
        } else if (index === "Data") {
            return [];
        }
    }
};

export default TestsModelBuilder;