import { store } from '../index';
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';
import { ACTION_NAMES } from '../constants/ActionsNames';
import SdmxXmlParser from "../parsers/SdmxXmlParser";
import StructureRequestBuilder from '../builders/StructureRequestBuilder';
import ResponseValidator from '../HttpResponseValidator';
import SemanticCheckerFactory from '../checker/SemanticCheckerFactory';
import { TEST_STATE } from '../constants/AppConstants';
import ItemSchemeObject from '../model/ItemSchemeObject';
import { getTestItems } from '../handlers/helperFunctions'
import STRUCTURES_TEST_TYPES from '../constants/StructuresTestTypes';


const sdmx_requestor = require('sdmx-rest');

export const runTests = async (tests, apiVersion, endpoint) => {
	for (let i = 0; i < tests.length; i++) {
		await runTest(tests[i], apiVersion, endpoint);
	}
};


const runTest = async (toRun, apiVersion, endpoint) => {
	
	performAction(ACTION_NAMES.UPDATE_TEST_STATE, toRun, null, TEST_STATE.RUNNING);
	var request = StructureRequestBuilder.prepareRequest(toRun.resource, toRun.reqTemplate, toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items);
	var testedService = sdmx_requestor.getService({
		url: endpoint,
		id: 'EndpointID',
		name: 'The Service under testing',
		api: apiVersion
	});

	/**
	 * If the structure test is of "Representation Type" we have to follow a slightly different chaining
	 */
	if(STRUCTURES_TEST_TYPES.STRUCTURE_QUERY_REPRESENTATION === toRun.testType){
		var representation = {headers:{accept:toRun.reqTemplate.representation}}

		await sdmx_requestor.request2(request, testedService,representation).then((response) => {
			return ResponseValidator.validateHttpResponse(request, response);
		}).then((validation) => {
			performAction(ACTION_NAMES.HTTP_RESPONSE_VALIDATED, toRun, null, validation)
			performAction(ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER, toRun);
	
			return ResponseValidator.validateRepresentation(toRun.reqTemplate.representation,validation.httpResponseValidation.httpResponse);
				
		}).then((representationValidationResult) => {
			performAction(ACTION_NAMES.UPDATE_TEST_STATE, toRun, null, TEST_STATE.COMPLETED);
			performAction(ACTION_NAMES.UPDATE_COVERAGE_NUMBER, toRun);
		}).catch(function (err) {
			store.dispatch({ type: ACTION_NAMES.UPDATE_TEST_STATE, data: { testInfo: toRun, state: TEST_STATE.FAILED, error: err } });
		});

	}else{
		await sdmx_requestor.request2(request, testedService).then((response) => {
			return ResponseValidator.validateHttpResponse(request, response);
		}).then((validation) => {
			performAction(ACTION_NAMES.HTTP_RESPONSE_VALIDATED, toRun, null, validation)
			performAction(ACTION_NAMES.UPDATE_COMPLIANT_TESTS_NUMBER, toRun);

			return validation.httpResponseValidation.httpResponse.text();			
		}).then((xmlBody) => {
			/* TODO
			 * extract the workspace (sdmx structures, datasets in case of data query,
			 * metadata reports is case of metadata query).
			 */
			return new SdmxXmlParser().getIMObjects(xmlBody);
		}).then((workspace) => {
			return SemanticCheckerFactory.getChecker(request).checkWorkspace(toRun, workspace);
		}).then(async (validation) => {			
			if (toRun.requireRandomSdmxObject === true) {
				var sdmxObj;
				/*If the Rest Resource is "structure" then we have to call the getRandomSdmxObject() function*/
				if (toRun.resource === "structure") {
					sdmxObj = validation.workspace.getRandomSdmxObject();
				} else {
					sdmxObj = validation.workspace.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource));
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
						await runTest(toRun.subTests[j], apiVersion, endpoint);
					}
				}
			}
		}).catch(function (err) {
			
			store.dispatch({ type: ACTION_NAMES.UPDATE_TEST_STATE, data: { testInfo: toRun, state: TEST_STATE.FAILED, error: err } });
			
		});
	}
	

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