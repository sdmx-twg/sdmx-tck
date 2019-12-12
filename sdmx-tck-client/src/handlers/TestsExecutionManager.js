import { store } from '../store/AppStore';

import ACTION_NAMES from '../constants/ActionsNames';

import { getTestItems } from '../handlers/helperFunctions'

var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var MaintainableObject = require('sdmx-tck-api').model.MaintainableObject;
var TEST_STATE = require('sdmx-tck-api').constants.TEST_TYPE;
var SdmxObjects = require('sdmx-tck-api').model.SdmxObjects;

export async function handleTestRun(testResults) {
    //console.log("Handle results of test " + testResults.testId + " = " + JSON.stringify(testResults.workspace));
	console.log(testResults)
	performAction(ACTION_NAMES.UPDATE_TESTS_NUMBER, testResults);
    if (testResults.httpResponseValidation && testResults.httpResponseValidation.status === 1 && testResults.workspaceValidation.status === 1) {
        console.log("PASSED:" + testResults.testId);
        
        if (testResults.requireRandomSdmxObject === true) {           
			if(testResults.dataForChildren){
				console.log(testResults.dataForChildren instanceof MaintainableObject)
				//performAction(ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS, testResults, testResults.dataForChildren);
			}
        }
         performAction(ACTION_NAMES.UPDATE_TEST_STATE, testResults, null, TEST_STATE.COMPLETED);
		 performAction(ACTION_NAMES.UPDATE_COVERAGE_NUMBER, testResults);
         performAction(ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER, testResults);
	}else{
		performAction(ACTION_NAMES.UPDATE_TEST_STATE, testResults, null, TEST_STATE.FAILED);
		if (testResults.httpResponseValidation && testResults.httpResponseValidation.status === 1 && testResults.workspaceValidation.status === 0) {
			performAction(ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER, testResults);
		}
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