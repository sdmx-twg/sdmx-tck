
import { updateTestsStatus, passIdentifiersToChildren, increaseTestCompliantNumber, increaseTestCoverageNumber } from "../handlers/helperFunctions";
import ACTION_NAMES from '../constants/ActionsNames';
/*
 * The reducer which depending the action type,
 * updates properly the previous state in order to produce the new state of the app. 
 */
const testsManagerReducer = (state = [], action) => {
	switch (action.type) {
		case ACTION_NAMES.INITIALISE_TESTS_MODEL:
			return action.tests;
		
		// case ACTION_NAMES.UPDATE_TEST_STATE:
		// 	var updatedTestsStatusesArray = updateTestsStatus(state, action);
		// 	return updatedTestsStatusesArray;
		// case ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS:
		// 	var childrenWithIdentifiers = passIdentifiersToChildren(state, action);
		// 	return childrenWithIdentifiers;
		// case ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER:
		// 	var updatedTestsCompliantNumber = increaseTestCompliantNumber(state, action)
		// 	return updatedTestsCompliantNumber;
		// case ACTION_NAMES.UPDATE_COVERAGE_NUMBER:
		// 	var updateTestsCoverageNumber = increaseTestCoverageNumber(state, action)
		// 	return updateTestsCoverageNumber;
		default:
			return state;
	}
}
export default testsManagerReducer;