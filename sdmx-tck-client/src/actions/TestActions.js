import { handleTestRun } from "../handlers/TestsExecutionManager";

export function initialiseTestsModel(tests) {
    return { type: 'INITIALISE_TESTS_MODEL', tests: tests };
};

export function prepareTestsFailed(error) {
    return { type: 'PREPARE_TESTS_FAILED', error: error };
};

export function fetchTests(endpoint, apiVersion, testIndices) {
    let body = {endpoint, apiVersion, testIndices};
    return fetch('/prepare-tests', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body) });
};

async function requestTestRun(endpoint, test) {
    let body = { endpoint, test };
    const response = await fetch('/execute-test', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body) });
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
    let testResults = await requestTestRun(endpoint, test);
    
    await handleTestRun(testResults);
    
    // if (test.subTests && test.subTests.length !== 0) {
    //     for (let j = 0; j < test.subTests.length; j++) {
    //         /*In order to mark as failed Item Queries if the items to request are unknown*/
    //         if (test.subTests[j].requireItems === true && (!test.subTests[j].items || test.subTests[j].items.length === 0)) {
    //             performAction(ACTION_NAMES.UPDATE_TEST_STATE, test.subTests[j], null, TEST_STATE.UNABLE_TO_RUN);
    //         } else {
    //             await runTest(endpoint, test.subTests[j]);
    //         }
    //     }
    // }
}
