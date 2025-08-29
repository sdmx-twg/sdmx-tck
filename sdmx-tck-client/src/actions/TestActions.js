import { store } from '../store/AppStore';
import ACTION_NAMES from '../constants/ActionsNames';
import { TEST_INDEX } from 'sdmx-tck-api/src/constants/TestIndex';
import TckError from 'sdmx-tck-api/src/errors/TckError';

const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const TCK_VERSION = require('sdmx-tck-api').constants.TCK_VERSION;
const EXPORT_FORMATS = require('sdmx-tck-api').constants.EXPORT_FORMATS;
var Utils = require('sdmx-tck-api').utils.Utils;

export function getServerUrl() {
  if (process.env.NODE_ENV === "development") {
    return "";
  } else {
    return process.env.REACT_APP_API_URL;
  }
}

export function initialiseTestsModel(tests) {
    return { type: 'INITIALISE_TESTS_MODEL', tests: tests };
};

export function prepareTestsFailed(error) {
    return { type: 'PREPARE_TESTS_FAILED', error: error };
};

export function updateTestsNumber(testIndex) {
    return { type: ACTION_NAMES.UPDATE_TESTS_NUMBER, testIndex: testIndex };
};

export function updateCoverageNumber(testIndex) {
    return { type: ACTION_NAMES.UPDATE_COVERAGE_NUMBER, testIndex: testIndex };
};

export function updateComplianceNumber(testIndex) {
    return { type: ACTION_NAMES.UPDATE_COMPLIANCE_NUMBER, testIndex: testIndex };
};

export function updateChildrenTests(test) {
    return { type: ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS, test: test };
};

export function updateTestState(test, state, isCompliant, isCovered) {
    return { type: ACTION_NAMES.UPDATE_TEST_STATE, test: test, state: state, isCompliant: isCompliant, isCovered: isCovered };
}
export function dataFromParent(test){
    return { type: ACTION_NAMES.GET_DATA_FROM_PARENT, test: test };
}
export function XSDTestsData(schemaTestsData,testIndex){
    return {type: ACTION_NAMES.CONFIG_SCHEMA_TESTS, testIndex:testIndex, schemaTestsData:schemaTestsData}
}
export function DataQueriesData(dataQueriesData,testIndex){
    return {type: ACTION_NAMES.CONFIG_DATA_TESTS, testIndex:testIndex, dataQueriesData:dataQueriesData}
}
export function RegistrationTestsData(data) {
    return {type: ACTION_NAMES.CONFIG_REGISTRATION_TESTS, testIndex: TEST_INDEX.Registration, data: data}
}
export const prerequisitesFailed = (error) => {
	return { type: ACTION_NAMES.PREREQUISITES_FAILED, error: error};
}

export function fetchTests(endpoint, apiVersion, testIndices, requestMode) {
    let body = { endpoint, apiVersion, testIndices, requestMode };
    return fetch(getServerUrl() + '/tck-api/prepare-tests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

async function requestTestRun(endpoint, test, format) {
     try {
        let body = { endpoint, test, format};
        const response = await fetch(getServerUrl() + '/tck-api/execute-test', {
            method: 'POST',
           
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
         return await response.json();
     } catch (err) {
         return { error: err.toString() };
     }
};

async function configureTests(index, endpoint, apiVersion, format) {
    let url;
    if (index === TEST_INDEX.Data) {
        url = "configure-data-tests";
    } else if (index === TEST_INDEX.Schema) {
        url = "configure-schema-tests";
    } else if (index === TEST_INDEX.Registration) {
        url = "configure-registration-tests";
    } else {
        throw new Error("Method not supported for index " + index);
    }
    let body = { endpoint, apiVersion, format };
    const response = await fetch(getServerUrl() + '/tck-api/' + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
    }
    return await response.json();
};

export function prepareTests(endpoint, apiVersion, testIndices, requestMode, format) {
    return function (dispatch) {
        return fetchTests(endpoint, apiVersion, testIndices, requestMode)
            .then((response) => {
                return response.json();
            }).then((tests) => {
                return dispatch(initialiseTestsModel(tests));
            }).then((action) => {
                return runTests(endpoint, action.tests, format);
            }).catch((error) => {
                dispatch(prepareTestsFailed(error));
            });
    };
};

export async function exportReport(wsInfo, apiVersion, format, requestMode, reportFormat, tests, scores) {
    try{
        let swVersion = TCK_VERSION;
        let body = { swVersion, apiVersion, wsInfo, format, requestMode, reportFormat, tests, scores };
        const response =  await fetch(getServerUrl() + '/tck-api/export-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if(response.status >= 400){
            throw new TckError("Error while exporting TCK Report.")
        }
        await _downloadReport(reportFormat,response)
      
    }catch(err){
        return {error:err.toString()};
    }
    
};

async function _downloadReport(format,response){
    if(!Utils.isDefined(format)){
        throw new Error("Missing Mandatory parameter 'format' ");
    }
    if(!Utils.isDefined(response)){
        throw new Error("Missing Mandatory parameter 'response' ");
    }
    if(!EXPORT_FORMATS.isValidFormat(format)){
        throw new Error("Unsupported format ");
    }

    if(format === EXPORT_FORMATS.EXCEL){
        await _downloadExcelReport(response)
    }else if(format === EXPORT_FORMATS.XML){
       await _downloadXMLReport(response)
    }else if (format === EXPORT_FORMATS.JSON){
       await _downloadJSONReport(response)
    }
}

async function _downloadJSONReport(response){
    if(!Utils.isDefined(response)){
        throw new Error("Missing Mandatory parameter 'response' ");
    }

    let data = await response.text();
    let dataType = "text/json";
    let fileName = "SDMX-TCK-Report.json"

    var blob = new Blob([data],{type:dataType });
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName
    link.click();
}
async function _downloadXMLReport(response){
    if(!Utils.isDefined(response)){
        throw new Error("Missing Mandatory parameter 'response' ");
    }

    let data = await response.text();
    let dataType = "text/xml";
    let fileName = "SDMX-TCK-Report.xml"

    var blob = new Blob([data],{type:dataType });
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName
    link.click();

}

async function _downloadExcelReport(response){
    if(!Utils.isDefined(response)){
        throw new Error("Missing Mandatory parameter 'response' ");
    }

    let data = await response.arrayBuffer();
    let dataType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    let fileName = "SDMX-TCK-Report.xlsx"

    var blob = new Blob([data],{type:dataType });
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName
    link.click();

}


async function getPrerequisiteDataForTests(endpoint, tests, format) {
    try {
        let apiVersion = (tests.subTests && Array.isArray(tests.subTests) && tests.subTests.length>0)?tests.subTests[0].apiVersion:undefined;
        if (TEST_INDEX.Schema === tests.id) {
            let schemaTestsData = await configureTests(TEST_INDEX.Schema, endpoint, apiVersion, format);
            store.dispatch(XSDTestsData(schemaTestsData, tests.id));
        }
        if (TEST_INDEX.Data === tests.id) {
            let dataQueriesData = await configureTests(TEST_INDEX.Data, endpoint, apiVersion, format);
            store.dispatch(DataQueriesData(dataQueriesData, tests.id));
        }
        if (TEST_INDEX.Registration === tests.id) {
            let registrationTestsData = await configureTests(TEST_INDEX.Registration, endpoint, apiVersion, format);
            store.dispatch(RegistrationTestsData(registrationTestsData));
        }
    } catch (e) {
        store.dispatch(prerequisitesFailed("Test run aborted: Prerequisites failed or are missing. " + e.message));
    }
}

async function runTests(endpoint, tests, format) {
    for (let i = 0; i < tests.length; i++) {
        await getPrerequisiteDataForTests(endpoint, tests[i], format);
            for (let j = 0; j < tests[i].subTests.length; j++) {
                await runTest(endpoint, tests[i].subTests[j], format);
        }
    }
};

export async function runTest(endpoint, test, format) {
    /*
    1) Reference partial testing requires a Content Constraint of "allowed" type.
    In the case that the identifiers given to this test by its parent do not lead
    in an allowed type, the workspace of the parent has to be kept in order to repick
    a content constraint artefact of allowed type.
    
    2. Data queriy that validates the single dimension query
       (Data Availability) need parent workspace in order to be validated*/
    if(test.testType === TEST_TYPE.STRUCTURE_REFERENCE_PARTIAL || 
        (test.testType === TEST_TYPE.DATA_AVAILABILITY &&  test.reqTemplate.component)){
        store.dispatch(dataFromParent(test));
    }
    if(test.state!==TEST_STATE.COMPLETED && test.state!==TEST_STATE.FAILED && test.state!==TEST_STATE.UNABLE_TO_RUN ){
        let testResults = await requestTestRun(endpoint, test, format);
        if(Object.keys(testResults).length === 1 && testResults.hasOwnProperty("error")){
            test.failReason  = testResults.error;
            store.dispatch(updateTestState(test, TEST_STATE.FAILED, false, false));
        }else{
            if(testResults.httpResponseValidation && testResults.httpResponseValidation.status === 1
                && ((testResults.workspaceValidation && testResults.workspaceValidation.status === 1) 
                || (testResults.httpResponseHeadersValidation && testResults.httpResponseHeadersValidation.status === 1))){
                        //Actions if a test was successful
                    store.dispatch(updateTestState(testResults, TEST_STATE.COMPLETED, true, true));
                    store.dispatch(updateComplianceNumber(testResults.index));
                    store.dispatch(updateCoverageNumber(testResults.index));
                    store.dispatch(updateChildrenTests(testResults));
            }else{ 
                    //Actions if a test failed
                    let isCompliant = false;
                    if (testResults.httpResponseValidation && testResults.httpResponseValidation.status === 1) {
                        isCompliant = true;
                        store.dispatch(updateComplianceNumber(testResults.index));                        
                    };
                    store.dispatch(updateTestState(testResults, TEST_STATE.FAILED, isCompliant, false));
            }
        }
    } 
    store.dispatch(updateTestsNumber(test.index));
    if (test.subTests && test.subTests.length !== 0) {
        for (let j = 0; j < test.subTests.length; j++) {
            /* In order to mark as failed Item Queries if the items to request are unknown */
            if (test.subTests[j].requireItems === true && (!test.subTests[j].items || test.subTests[j].items.length === 0)) {
                test.subTests[j].failReason = "Unable to run, due to missing items";
                store.dispatch(updateTestState(test.subTests[j], TEST_STATE.UNABLE_TO_RUN, false, false));
                store.dispatch(updateTestsNumber(test.subTests[j].index));
            }else {
                await runTest(endpoint, test.subTests[j], format);
            }
        }
    }    
}
