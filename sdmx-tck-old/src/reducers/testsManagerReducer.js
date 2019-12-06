
import { selectTests, setHttpResponseValidationResult, updateTestsStatus, passIdentifiersToChildren, increaseTestCompliantNumber, increaseTestCoverageNumber} from "../handlers/helperFunctions";
import TestsModelBuilder from "../builders/TestsModelBuilder";
import { ACTION_NAMES } from '../constants/ActionsNames';

/*The reducer which depending the action type updates properly the previous state in order to produce the new state of the app. */
const testsManagerReducer = (state = [], action) => {

	switch(action.type){
		case ACTION_NAMES.INITIALISE_MODEL:
			const initialStatuses = TestsModelBuilder.createTestsModel(action.data.selectedApiVersion);
			return initialStatuses;
		case ACTION_NAMES.MARK_TESTS_TO_RUN:
			/*Load the initial TCK tests definition*/
			var testsArray = selectTests(state,action);
			return testsArray;
		case ACTION_NAMES.HTTP_RESPONSE_VALIDATED:
			return setHttpResponseValidationResult(state, action);
		case ACTION_NAMES.UPDATE_TEST_STATE:
			var updatedTestsStatusesArray = updateTestsStatus(state, action);
			return updatedTestsStatusesArray;
		case ACTION_NAMES.PASS_IDENTIFIERS_TO_CHILDREN_TESTS:
			var childrenWithIdentifiers = passIdentifiersToChildren(state,action);
			return childrenWithIdentifiers;	
		case ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER:
			var updatedTestsCompliantNumber = increaseTestCompliantNumber(state,action)
			return updatedTestsCompliantNumber;
		case ACTION_NAMES.UPDATE_COVERAGE_NUMBER:
			var updateTestsCoverageNumber = increaseTestCoverageNumber(state,action)
			return updateTestsCoverageNumber;
		default:
			return state;
	}
}
export default testsManagerReducer;