import { store } from '../store/AppStore';

import ACTION_NAMES from '../constants/ActionsNames';
// import ItemSchemeObject from '../model/ItemSchemeObject';
// import { getTestItems } from '../handlers/helperFunctions'

const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').SDMX_STRUCTURE_TYPE;
const TEST_STATE = require('sdmx-tck-api').TEST_STATE;

export const runTests = async (tests, apiVersion, endpoint) => {
	for (let i = 0; i < tests.length; i++) {
		await executeTest(tests[i], apiVersion, endpoint);
	}
};

const executeTest = async (toRun, apiVersion, endpoint) => {
	performAction(ACTION_NAMES.UPDATE_TEST_STATE, toRun, null, TEST_STATE.RUNNING);

	fetch("/execute-test?test=" + JSON.stringify(toRun) + "&apiVersion=" + apiVersion + "&endpoint=" + endpoint)
		.then(async (response) => {

			if (toRun.requireRandomSdmxObject === true) {
				var sdmxObj;
				/*If the Rest Resource is "structure" then we have to call the getRandomSdmxObject() function*/
				if (toRun.resource === "structure") {
					sdmxObj = toRun.workspace.getRandomSdmxObject();
				} else {
					sdmxObj = toRun.workspace.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource));
				}
				performAction(ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS, toRun, sdmxObj);
			}
			performAction(ACTION_NAMES.UPDATE_TEST_STATE, toRun, null, TEST_STATE.COMPLETED);
			performAction(ACTION_NAMES.UPDATE_COVERAGE_NUMBER, toRun);

			if (toRun.subTests && toRun.subTests.length !== 0) {
				for (let j = 0; j < toRun.subTests.length; j++) {
					/*In order to mark as failed Item Queries if the items to request are unknown*/
					if (toRun.subTests[j].requireItems === true && (!toRun.subTests[j].items || toRun.subTests[j].items.length === 0)) {
						performAction(ACTION_NAMES.UPDATE_TEST_STATE, toRun.subTests[j], null, TEST_STATE.UNABLE_TO_RUN);
					} else {
						await executeTest(toRun.subTests[j], apiVersion, endpoint);
					}
				}
			}
		}).catch((err) => {
			console.log(err);
		});
};


export const performAction = (action, test, sdmxObj, result) => {
	switch (action) {
		case ACTION_NAMES.HTTP_RESPONSE_VALIDATED:
			store.dispatch({ type: action, data: { testInfo: test, result: result } });
			break;
		case ACTION_NAMES.UPDATE_TEST_STATE:
			store.dispatch({ type: action, data: { testInfo: test, state: result } });
			break;
		case (ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS):
			// let items = [];
			// if (sdmxObj instanceof ItemSchemeObject) {
			// 	items = getTestItems(sdmxObj.getItems());
			// }
			// store.dispatch({ type: action, data: { testInfo: test, randomObj: sdmxObj, items: items } });
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