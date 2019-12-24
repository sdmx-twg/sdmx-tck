import { store } from '../store/AppStore';
import ACTION_NAMES from '../constants/ActionsNames';

const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;


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

export function fetchTests(endpoint, apiVersion, testIndices) {
    let body = { endpoint, apiVersion, testIndices };
    return fetch('/prepare-tests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

async function requestTestRun(endpoint, test) {
    let body = { endpoint, test };
    const response = await fetch('/execute-test', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    return await response.json();
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

async function runTests(endpoint, tests) {
    for (let i = 0; i < tests.length; i++) {
        for (let j = 0; j < tests[i].subTests.length; j++) {
            await runTest(endpoint, tests[i].subTests[j]);
        }
    }
};

export async function runTest(endpoint, test) {
   store.dispatch(updateTestsNumber(test.index));
   if(test.state!==TEST_STATE.COMPLETED && test.state!==TEST_STATE.FAILED && test.state!==TEST_STATE.UNABLE_TO_RUN ){
        let testResults = await requestTestRun(endpoint, test);
                
        if(testResults.httpResponseValidation && testResults.httpResponseValidation.status === 1
            && testResults.workspaceValidation && testResults.workspaceValidation.status === 1){
                 //Actions if a test was successfull
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
