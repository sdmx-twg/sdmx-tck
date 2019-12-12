
import { updateTestsStatus,increaseRunTestsNum, passIdentifiersToChildren, increaseTestCompliantNumber, increaseTestCoverageNumber } from "../handlers/helperFunctions";
import ACTION_NAMES from '../constants/ActionsNames';
/*
 * The reducer which depending the action type,
 * updates properly the previous state in order to produce the new state of the app. 
 */
const testsManagerReducer = (state = [], action) => {
	switch (action.type) {
		case ACTION_NAMES.INITIALISE_TESTS_MODEL:
			return action.tests;
		case ACTION_NAMES.UPDATE_TESTS_NUMBER:
			return increaseRunTestsNum(state, action);
		case ACTION_NAMES.UPDATE_COMPLIANCE_NUMBER:
			return increaseTestCompliantNumber(state, action)
		case ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS:
			return passIdentifiersToChildren(state, action);
		case ACTION_NAMES.UPDATE_COVERAGE_NUMBER:
			return increaseTestCoverageNumber(state, action)
		case ACTION_NAMES.UPDATE_TEST_STATE:
			return updateTestsStatus(state, action)
		default:
			return state;
	}
}
export default testsManagerReducer;