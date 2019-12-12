const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const SdmxObjects = require('sdmx-tck-api').model.SdmxObjects;

export const getTestItems = (items) => {
	let testItems = [];
	if (items.length >= 2) {
		testItems.push(items[0].id);
		testItems.push(items[1].id);
		return testItems;
	} else if (items.length === 1) {
		return [];
	}
};

export const extractScore = (testsArray) => {
	let numOfCompliantResponses = 0;
	let numOfFullResponses = 0;
	let numOfRunTests = 0;
	let numOfTests = 0;

	for (let i = 0; i < testsArray.length; i++) {
		numOfCompliantResponses += Number(testsArray[i].numOfValidRequests);
		numOfFullResponses += Number(testsArray[i].numOfValidTestResponses);
		numOfRunTests += Number(testsArray[i].numOfRunTests);
		numOfTests += Number(testsArray[i].sumOfTests);
	}
	let complianceScore = parseFloat(Number(numOfCompliantResponses) / Number(numOfTests)).toFixed(2)
	let coverageScore = parseFloat(Number(numOfFullResponses) / Number(numOfTests)).toFixed(2);

	let scores = { complianceScore: complianceScore, coverageScore: coverageScore, numOfTests: numOfTests, numOfRunTests: numOfRunTests };

	return scores;
};
export const increaseExecutedTestsNumber = (prevStore, action) => {
	var testsArray = [...prevStore];

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === action.data) {
			testsArray[i].numOfRunTests = testsArray[i].numOfRunTests + 1;
			break;
		}
	}
	return testsArray;
};


export const increaseRunTestsNum = (prevStore, action) => {
	var testsArray = [...prevStore];

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === action.testIndex) {
			testsArray[i].numOfRunTests += 1;
		}
	}
	return testsArray;
};


export const increaseTestCompliantNumber = (prevStore, action) => {
	var testsArray = [...prevStore];

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === action.testIndex) {
			testsArray[i].numOfValidRequests = testsArray[i].numOfValidRequests + 1;
			break;
		}
	}
	return testsArray;
};

export const increaseTestCoverageNumber = (prevStore, action) => {
	var testsArray = [...prevStore];

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === action.testInde) {
			testsArray[i].numOfValidTestResponses = testsArray[i].numOfValidTestResponses + 1;
			break;
		}
	}
	return testsArray;
};

/*
Functionality
1. Iterate over a copy array of the state
2. Find in which Tests the "run" property equals true (are selected to run)
3. Organise them into an array and return it.
*/
export function extractSelectedTests(testsArray) {
	let array = [];
	testsArray.forEach((test) => {
		test.subTests.forEach((subTest) => {
			array.push(subTest);
		});
	});
	return array;
};

/**
 * If the parent in not found yet in the store keep looking recursively. 
 * When its found pass the identifiers to its children (only to its adjacent children).
 */
const searchChildTestsToPassIdentifiers = (test, runTest) => {
	if (runTest.testId === test.testId) {
		// if the test is found, pass identifiers to its children.
		if (test.subTests && Array.isArray(test.subTests)) {
			for (let i = 0; i < test.subTests.length; i++) {
				if (test.subTests[i].requireRandomSdmxObject === true) {
					test.subTests[i].identifiers.structureType = runTest.randomStructure.structureType;
					test.subTests[i].identifiers.agency = runTest.randomStructure.agencyId;
					test.subTests[i].identifiers.id = runTest.randomStructure.id;
					test.subTests[i].identifiers.version = runTest.randomStructure.version;
				}
				if (test.subTests[i].requireItems) {
					test.subTests[i].items = runTest.items;
				}
			}
		}
	} else if (test.subTests && Array.isArray(test.subTests)) {
		for (let i = 0; i < test.subTests.length; i++) {
			searchChildTestsToPassIdentifiers(test.subTests[i], runTest);
		}
	}
};

/*
 * When a parent needs to pass to its children identifiers this function is called
 */
export const passIdentifiersToChildren = (prevStore, action) => {
	var testsArray = [...prevStore];

	var runTest = action.test;

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === runTest.index) {
			searchChildTestsToPassIdentifiers(testsArray[i], runTest);
		}
	}
	return testsArray;
};

/**
 * Find and mark the tests that have run as completed or failed.
 * @param {*} prevStore 
 * @param {*} action 
 */
export const updateTestsStatus = (prevStore, action) => {
	var testsArray = [...prevStore];

	/** updateTestStatus is called when a test starts to run and  when a test ends successfully or not.
	 * However the number of running tests must be increased once for each one.
	 */
	if ((action.data.state === TEST_STATE.COMPLETED || action.data.state === TEST_STATE.FAILED) || action.data.state === TEST_STATE.UNABLE_TO_RUN) {
		increaseRunTestsNum(testsArray, action.data.testInfo);
	}

	for (let i = 0; i < testsArray.length; i++) {
		updateTestStatus(testsArray, testsArray[i], action);
	}
	return testsArray;
};

function updateTestStatus(testsArray, test, action) {
	if (action.data.testInfo.testId === test.testId) {
		test.state = action.data.state;
		if (action.data.state === TEST_STATE.RUNNING) {
			test.startTime = new Date();
		} else if (action.data.state === TEST_STATE.FAILED || action.data.state === TEST_STATE.COMPLETED) {
			test.endTime = new Date();
		}
		if (action.data.state === TEST_STATE.FAILED) {
			test.failReason = action.data.error;
			// if the test failed, change the status of its children to "Unable to run".
			updateChildTestsStatus(testsArray, test);
		}
	} else {
		// if the test is not found in this level, continue the search to its children.
		if (test.subTests) {
			for (let j = 0; j < test.subTests.length; j++) {
				updateTestStatus(testsArray, test.subTests[j], action);
			}
		}
	}
};

/**
 * If a test was not able to run change the status of its children to "Unable to Run".
 */
function updateChildTestsStatus(testsArray, parentTest) {
	if (parentTest && parentTest.subTests) {
		for (let i = 0; i < parentTest.subTests.length; i++) {

			increaseRunTestsNum(testsArray, parentTest.subTests[i]);

			parentTest.subTests[i].state = TEST_STATE.UNABLE_TO_RUN;
			parentTest.subTests[i].failReason = "Unable to run, due to failed prerequisites";

			updateChildTestsStatus(testsArray, parentTest.subTests[i]);
		}
	}
};