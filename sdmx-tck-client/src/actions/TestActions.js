import { store } from '../store/AppStore';
import ACTION_NAMES from '../constants/ActionsNames';
import { TEST_INDEX } from 'sdmx-tck-api/src/constants/TestIndex';

const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const DATA_QUERY_MODE = require('sdmx-tck-api').constants.DATA_QUERY_MODE
const TCK_VERSION = require('sdmx-tck-api').constants.TCK_VERSION;
const EXPORT_FORMATS = require('sdmx-tck-api').constants.EXPORT_FORMATS;
var Utils = require('sdmx-tck-api').utils.Utils;

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

export function updateTestState(test, state) {
    return { type: ACTION_NAMES.UPDATE_TEST_STATE, test: test, state: state };
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

export function fetchTests(endpoint, apiVersion, testIndices) {
    let body = { endpoint, apiVersion, testIndices };
    return fetch('/tck-api/prepare-tests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

async function requestTestRun(endpoint, test) {
     try{
        
        let body = { endpoint, test };
        const response = await fetch('/tck-api/execute-test', {
            method: 'POST',
           
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await response.json();
     }catch(err){
             return {error:err.toString()};
     }

};

async function configureSchemaTests(endpoint,apiVersion) {
    try{
       let body = { endpoint,apiVersion };
       const response = await fetch('/tck-api/configure-schema-tests', {
           method: 'POST',
          
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(body)
       });
       return await response.json();
    }catch(err){
            return {error:err.toString()};
    }

};

async function configureDataTests(endpoint,apiVersion) {
    try{
       let body = { endpoint,apiVersion };
       const response = await fetch('/tck-api/configure-data-tests', {
           method: 'POST',
          
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(body)
       });
       return await response.json();
    }catch(err){
            return {error:err.toString()};
    }

};

export function prepareTests(endpoint, apiVersion, testIndices) {
    return function (dispatch) {
        return fetchTests(endpoint, apiVersion, testIndices)
            .then((response) => {
                return response.json();
            }).then((tests) => {
                return dispatch(initialiseTestsModel(tests));
            }).then((action) => {
                runTests(endpoint, action.tests);
            }).catch((error) => {
                dispatch(prepareTestsFailed(error));
            });
    };
};

export async function exportReport(wsInfo,apiVersion,format,tests) {
    try{
        let swVersion = TCK_VERSION;
        let body = { swVersion,apiVersion,wsInfo,format,tests };
        const response =  await fetch('/tck-api/export-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        await _downloadReport(format,response)
      
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
    let data;
    let dataType;
    let fileName;
    if(format === EXPORT_FORMATS.EXCEL){
        data = await response.arrayBuffer();
        dataType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64"
        fileName = "SDMX-TCK-Report.xlsx"
    }else if(format === EXPORT_FORMATS.XML){
        data = await response.text();
        dataType = "text/xml";
        fileName = "SDMX-TCK-Report.xml"
    }
    var blob = new Blob([data],{type:dataType });
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName
    link.click();
}


async function getPrerequisiteDataForTests(endpoint,tests){
    if(TEST_INDEX.Schema === tests.id){
        let apiVersion = (tests.subTests && Array.isArray(tests.subTests) && tests.subTests.length>0)?tests.subTests[0].apiVersion:undefined;
        let schemaTestsData = await configureSchemaTests(endpoint,apiVersion);
        store.dispatch(XSDTestsData(schemaTestsData,tests.id));  
    }
    if(TEST_INDEX.Data === tests.id){
        let apiVersion = (tests.subTests && Array.isArray(tests.subTests) && tests.subTests.length>0)?tests.subTests[0].apiVersion:undefined;
        let dataQueriesData = await configureDataTests(endpoint,apiVersion);
        store.dispatch(DataQueriesData(dataQueriesData,tests.id))
    }
}

async function runTests(endpoint, tests) {
    for (let i = 0; i < tests.length; i++) {
        await getPrerequisiteDataForTests(endpoint,tests[i]);
        for (let j = 0; j < tests[i].subTests.length; j++) {
            await runTest(endpoint, tests[i].subTests[j]);
        }
    }
};

export async function runTest(endpoint, test) {
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
        let testResults = await requestTestRun(endpoint, test);
        if(Object.keys(testResults).length === 1 && testResults.hasOwnProperty("error")){
            test.failReason  = testResults.error;
            store.dispatch(updateTestState(test, TEST_STATE.FAILED));
        }else{
            if(testResults.httpResponseValidation && testResults.httpResponseValidation.status === 1
                && ((testResults.workspaceValidation && testResults.workspaceValidation.status === 1) 
                || (testResults.httpResponseHeadersValidation && testResults.httpResponseHeadersValidation.status === 1))){
                        //Actions if a test was successful
                    store.dispatch(updateTestState(testResults, TEST_STATE.COMPLETED));
                    store.dispatch(updateComplianceNumber(testResults.index));
                    store.dispatch(updateCoverageNumber(testResults.index));
                    store.dispatch(updateChildrenTests(testResults));
            }else{ 
                        //Actions if a test failed
                    store.dispatch(updateTestState(testResults, TEST_STATE.FAILED));
                    if (testResults.httpResponseValidation && testResults.httpResponseValidation.status === 1) {
                        store.dispatch(updateComplianceNumber(testResults.index));
                    };
            }
        }
    } 
    store.dispatch(updateTestsNumber(test.index));
    if (test.subTests && test.subTests.length !== 0) {
        for (let j = 0; j < test.subTests.length; j++) {
            /* In order to mark as failed Item Queries if the items to request are unknown */
            if (test.subTests[j].requireItems === true && (!test.subTests[j].items || test.subTests[j].items.length === 0)) {
                test.subTests[j].failReason = "Unable to run, due to missing items";
                store.dispatch(updateTestState(test.subTests[j], TEST_STATE.UNABLE_TO_RUN));
                store.dispatch(updateTestsNumber(test.subTests[j].index));
            }else {
                await runTest(endpoint, test.subTests[j]);
            }
        }
    }    
}
