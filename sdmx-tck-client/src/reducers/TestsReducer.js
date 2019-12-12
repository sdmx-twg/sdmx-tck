
<<<<<<< HEAD
import { increaseExecutedTestsNumber,updateTestsStatus, passIdentifiersToChildren, increaseTestCompliantNumber, increaseTestCoverageNumber } from "../handlers/helperFunctions";
=======
import { increaseRunTestsNum, passIdentifiersToChildren, increaseTestCompliantNumber, increaseTestCoverageNumber } from "../handlers/helperFunctions";
>>>>>>> e95bffb0e79a59dfb89d73866d5aab24f7f00d09
import ACTION_NAMES from '../constants/ActionsNames';
/*
 * The reducer which depending the action type,
 * updates properly the previous state in order to produce the new state of the app. 
 */
const testsManagerReducer = (state = [], action) => {
	switch (action.type) {
		case ACTION_NAMES.INITIALISE_TESTS_MODEL:
			return action.tests;
<<<<<<< HEAD
		
		case ACTION_NAMES.UPDATE_TEST_STATE:
			var updatedTestsStatusesArray = updateTestsStatus(state, action);
			return updatedTestsStatusesArray;
		case ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS:
			var childrenWithIdentifiers = passIdentifiersToChildren(state, action);
			return childrenWithIdentifiers;
		case ACTION_NAMES.UPDATE_TESTS_NUMBER:
			var updatedTestsNumber = increaseExecutedTestsNumber(state, action);
			return updatedTestsNumber;
		case ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER:
			var updatedTestsCompliantNumber = increaseTestCompliantNumber(state, action)
			return updatedTestsCompliantNumber;
		case ACTION_NAMES.UPDATE_COVERAGE_NUMBER:
			var updateTestsCoverageNumber = increaseTestCoverageNumber(state, action)
			return updateTestsCoverageNumber;
=======
		case ACTION_NAMES.UPDATE_TESTS_NUMBER:
			return increaseRunTestsNum(state, action);
		case ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER:
			return increaseTestCompliantNumber(state, action)
		case ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS:
			return passIdentifiersToChildren(state, action);
		case ACTION_NAMES.UPDATE_COVERAGE_NUMBER:
			return increaseTestCoverageNumber(state, action)
>>>>>>> e95bffb0e79a59dfb89d73866d5aab24f7f00d09
		default:
			return state;
	}
}
export default testsManagerReducer;