import { store } from '../store/AppStore';

import ACTION_NAMES from '../constants/ActionsNames';

import { getTestItems } from '../handlers/helperFunctions'

var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;

export async function handleTestRun(testResults) {
    console.log("Handle results of test " + testResults.testId + " = " + JSON.stringify(testResults.workspace));

    if (testResults.httpResponseValidation && testResults.httpResponseValidation.status === 1 && testResults.workspaceValidation.status === 1) {
        console.log("PASSED:" + testResults.testId);
        
        // if (testResults.requireRandomSdmxObject === true) {
        //     var sdmxObj;
        //     /*If the Rest Resource is "structure" then we have to call the getRandomSdmxObject() function*/
        //     if (testResults.resource === "structure") {
        //         sdmxObj = testResults.workspace.getRandomSdmxObject();
        //     } else {
        //         sdmxObj = testResults.workspace.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.fromRestResource(testResults.resource));
        //     }
        //     // performAction(ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS, testResults, sdmxObj);
        // }
        // performAction(ACTION_NAMES.UPDATE_TEST_STATE, testResults, null, TEST_STATE.COMPLETED);
        // performAction(ACTION_NAMES.UPDATE_COVERAGE_NUMBER, testResults);
        // performAction(ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER, testResults);
    }
};

export const performAction = (action, test, sdmxObj, result) => {
	switch (action) {
		case ACTION_NAMES.UPDATE_TEST_STATE:
			store.dispatch({ type: action, data: { testInfo: test, state: result } });
			break;
		case (ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS):
			let items = [];
			if (sdmxObj instanceof ItemSchemeObject) {
				items = getTestItems(sdmxObj.getItems());
			}
			store.dispatch({ type: action, data: { testInfo: test, randomObj: sdmxObj, items: items } });
			break;
		case (ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER):
			store.dispatch({ type: action, data: test.index });
			break;
		case (ACTION_NAMES.UPDATE_COVERAGE_NUMBER):
			store.dispatch({ type: action, data: test.index });
			break;
		case (ACTION_NAMES.UPDATE_TESTS_NUMBER):
			store.dispatch({ type: action, data: test.index });
			break;
		default:
			break;
	}
};