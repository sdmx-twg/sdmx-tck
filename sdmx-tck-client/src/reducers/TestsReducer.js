
import {configSchemaTests,configDataTests,configRegistrationTests,getDataFromParent,updateTestsStatus,increaseRunTestsNum, passIdentifiersToChildren, increaseTestCompliantNumber, increaseTestCoverageNumber } from "../handlers/helperFunctions";
import ACTION_NAMES from '../constants/ActionsNames';

/*
 * The reducer which depending the action type,
 * updates properly the previous state in order to produce the new state of the app. 
 */
const testsManagerReducer = (state = { tests: [] }, action) => {
	switch (action.type) {
		case ACTION_NAMES.INITIALISE_TESTS_MODEL:
			return { tests: action.tests };
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
		case ACTION_NAMES.GET_DATA_FROM_PARENT:
			return getDataFromParent(state,action)
		case ACTION_NAMES.CONFIG_SCHEMA_TESTS:
			return configSchemaTests(state,action)
		case ACTION_NAMES.CONFIG_DATA_TESTS:
			return configDataTests(state,action)
		case ACTION_NAMES.CONFIG_REGISTRATION_TESTS:
			return configRegistrationTests(state,action)
		case ACTION_NAMES.PREREQUISITES_FAILED:
			return { tests: [], executionInfo: { error: action.error } };
		default:
			return state;
	}
}
export default testsManagerReducer;