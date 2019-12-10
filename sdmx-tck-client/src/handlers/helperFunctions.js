const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;

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
		if (testsArray[i].run === true) {
			numOfCompliantResponses += Number(testsArray[i].numOfValidRequests);
			numOfFullResponses += Number(testsArray[i].numOfValidTestResponses);
			numOfRunTests += Number(testsArray[i].numOfRunTests);
			numOfTests += Number(testsArray[i].sumOfTests);
		}
	}
	let complianceScore = parseFloat(Number(numOfCompliantResponses) / Number(numOfTests)).toFixed(2)
	let coverageScore = parseFloat(Number(numOfFullResponses) / Number(numOfTests)).toFixed(2);

	let scores = { complianceScore: complianceScore, coverageScore: coverageScore, numOfTests: numOfTests, numOfRunTests: numOfRunTests };

	return scores;
};

export const increaseTestCompliantNumber = (prevStore, action) => {
	var testsArray = [...prevStore];

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === action.data) {
			testsArray[i].numOfValidRequests = testsArray[i].numOfValidRequests + 1;
			break;
		}
	}
	return testsArray;
};

export const increaseTestCoverageNumber = (prevStore, action) => {
	var testsArray = [...prevStore];

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === action.data) {
			testsArray[i].numOfValidTestResponses = testsArray[i].numOfValidTestResponses + 1;
			break;
		}
	}
	return testsArray;
};

const increaseRunTestsNum = (testsArray, runTest) => {
	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === runTest.index) {
			testsArray[i].numOfRunTests += 1;
		}
	}
};

/*
Functionality
1. Iterate over a copy array of the state
2. Find in which Tests the "run" property equals true (are selected to run)
3. Organise them into an array and return it.
*/
export const extractSelectedTests = (testsArray) => {
	let array = [];
	testsArray.forEach((test) => {
		if (test.run === true) {
			test.subTests.forEach((subTest) => {
				array.push(subTest);
			});
		}
	});
	return array;
};

// /**
//  * Change the run status of tests recursively.
//  * If a test is selected to run then its children hierarchy will run.
//  * If a test is not selected to run then its children hierarchy will not run.
//  * @param {*} test
//  * @param {*} run
//  */
// const runTest = (test, run) => {
// 	test.run = run;
// 	if (test.subTests) {
// 		for (let i = 0; i < test.subTests.length; i++) {
// 			runTest(test.subTests[i], run);
// 		}
// 	}
// };
// /*
// Functionality
// 1. Iterate over a copy array of the state
// 2. Find which Tests are selected to run and mark them
// 3. Update the store object.
// */
// export const selectTests = (initialStatuses, action) => {
// 	var testsArray = [...initialStatuses];
// 	for (let i = 0; i < testsArray.length; i++) {
// 		// the action.data is an array that contains the selected indices (Structures, Data, etc.).
// 		// If the selected index is found in the array of indices, mark the tests found under the index as running.
// 		runTest(testsArray[i], action.data.indexOf(testsArray[i].id) !== -1);
// 	}
// 	return testsArray;
// };

/**
 * If the parent in not found yet in the store keep looking recursively. 
 * When its found pass the identifiers to its children (only to its adjacent children).
 */
const searchChildTestsToPassIdentifiers = (test, action) => {
	if (action.data.testInfo.testId === test.testId) {
		// if the test is found, pass identifiers to its children.
		if (test.subTests && Array.isArray(test.subTests)) {
			for (let i = 0; i < test.subTests.length; i++) {
				if (test.subTests[i].requireRandomSdmxObject === true) {
					test.subTests[i].identifiers.structureType = action.data.randomObj.getStructureType();
					test.subTests[i].identifiers.agency = action.data.randomObj.getAgencyId();
					test.subTests[i].identifiers.id = action.data.randomObj.getId();
					test.subTests[i].identifiers.version = action.data.randomObj.getVersion();
				}
				if (test.subTests[i].requireItems) {
					test.subTests[i].items = action.data.items;
				}
			}
		}
	} else if (test.subTests && Array.isArray(test.subTests)) {
		for (let i = 0; i < test.subTests.length; i++) {
			searchChildTestsToPassIdentifiers(test.subTests[i], action);
		}
	}
};

/*
 * When a parent needs to pass to its children identifiers this function is called
 */
export const passIdentifiersToChildren = (prevStore, action) => {
	var testsArray = [...prevStore];

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === action.data.testInfo.index) {
			searchChildTestsToPassIdentifiers(testsArray[i], action);
		}
	}
	return testsArray;
};

export const setHttpResponseValidationResult = (prevStore, action) => {
	var testsArray = [...prevStore];

	updateTestProperty(testsArray, action.data.testInfo, action.data.result);

	return testsArray;
};

const updateTestProperty = (testsArray, testInfo, property) => {
	for (let i = 0; i < testsArray.length; i++) {
		if (testInfo.index === testsArray[i].id) {
			updateProperty(testsArray[i], testInfo, property);
		}
	}
};

const updateProperty = (currentTest, testInfo, property) => {
	if (currentTest.testId === testInfo.testId) {
		Object.assign(testInfo, property);
	} else if (currentTest.subTests) {
		for (let j = 0; j < currentTest.subTests.length; j++) {
			updateProperty(currentTest.subTests[j], testInfo, property);
		}
	}
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