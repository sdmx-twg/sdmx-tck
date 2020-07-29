const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SCHEMA_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.SCHEMA_IDENTIFICATION_PARAMETERS

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
			testsArray[i].numOfRunTests +=1;
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
			testsArray[i].numOfValidRequests +=1;
			break;
		}
	}
	return testsArray;
};

export const increaseTestCoverageNumber = (prevStore, action) => {
	var testsArray = [...prevStore];

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === action.testIndex) {
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
					//In Target category case we need only one item in the form of array
					if(test.subTests[i].testType === TEST_TYPE.STRUCTURE_TARGET_CATEGORY){
						test.subTests[i].items = [runTest.randomItems[0]];
					}else{
						test.subTests[i].items = runTest.randomItems;
					}
					
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
export function passConstraintDataToSchemaTests(schemaTests,schemaTestsData){
	if (schemaTests.subTests && Array.isArray(schemaTests.subTests)) {
		for (let i = 0; i < schemaTests.subTests.length; i++) {
				//PASS IDENTIFIERS FOR XSD TESTS USING CONSTRAINTS
				if(schemaTests.subTests[i].testType === TEST_TYPE.SCHEMA_IDENTIFICATION_PARAMETERS_WITH_CONSTRAINTS 
					|| schemaTests.subTests[i].testType === TEST_TYPE.SCHEMA_FURTHER_DESCRIBING_PARAMETERS_WITH_CONSTRAINTS){
						if(schemaTestsData.constraintData && schemaTestsData.constraintData[schemaTests.subTests[i].resource]){
							schemaTests.subTests[i].identifiers.structureType = schemaTestsData.constraintData[schemaTests.subTests[i].resource].identifiers.structureType
							schemaTests.subTests[i].identifiers.agency = schemaTestsData.constraintData[schemaTests.subTests[i].resource].identifiers.agencyId
							schemaTests.subTests[i].identifiers.id = schemaTestsData.constraintData[schemaTests.subTests[i].resource].identifiers.id
							schemaTests.subTests[i].identifiers.version = schemaTestsData.constraintData[schemaTests.subTests[i].resource].identifiers.version
	
							//PASS CONSTRAINT OBJECTS - USED TO VALIDATE THE ENUMERATIONS IN XSD
							/*We do not pass the constraints data in the /schema/resource/agency/id/latest test as when executed, the version (latest) 
							of the artefact's XSD returned by the service may differ from the version of the artefact that is constrained in the 
							constraint.So that artefact may follow different restrictions.
							As a result this kind of tests we will follow a different procedure to validate the enumerations*/
							if(schemaTests.subTests[i].reqTemplate.version !== SCHEMA_IDENTIFICATION_PARAMETERS.AGENCY_ID.template.version){
								schemaTests.subTests[i].constraintParent = schemaTestsData.constraintData[schemaTests.subTests[i].resource].constraintParent
							}
						}
					//PASS IDENTIFIERS TO XSD TESTS WIThOUT THE USE OF CONSTRAINT
					}else{
						if(schemaTestsData.randomData[schemaTests.subTests[i].resource]){
							schemaTests.subTests[i].identifiers.structureType = schemaTestsData.randomData[schemaTests.subTests[i].resource].structureType
							schemaTests.subTests[i].identifiers.agency = schemaTestsData.randomData[schemaTests.subTests[i].resource].agencyId
							schemaTests.subTests[i].identifiers.id = schemaTestsData.randomData[schemaTests.subTests[i].resource].id
							schemaTests.subTests[i].identifiers.version = schemaTestsData.randomData[schemaTests.subTests[i].resource].version
						}
					}

			if (schemaTests.subTests[i].subTests && Array.isArray(schemaTests.subTests[i].subTests)) {
				passConstraintDataToSchemaTests(schemaTests.subTests[i],schemaTestsData)
			}
		}
	}
}
export const configSchemaTests = (prevStore,action) =>{
	var testsArray = [...prevStore];

	for (let i = 0; i < testsArray.length; i++) {
		if (testsArray[i].id === action.testIndex) {
			passConstraintDataToSchemaTests(testsArray[i],action.schemaTestsData);
		}
	}
	return testsArray;
}

export const findCorrectChild = (childToFind,searchArray) =>{
	for(let i=0;i<searchArray.length;i++){
		if(childToFind.structureType === searchArray[i].structureType
			&&childToFind.agencyId === searchArray[i].agencyId
			&&childToFind.id === searchArray[i].id
			&&childToFind.version === searchArray[i].version){
				return {found:"true",data: searchArray[i]};
			}
	}
	return {found:"false"};
}

const searchParent = (possibleParents,child) => {
		for(let j=0;j<possibleParents.length;j++){
			if(possibleParents[j].subTests){
				for(let k=0;k<possibleParents[j].subTests.length;k++){
					if(possibleParents[j].subTests[k].testId === child.testId && possibleParents[j].state === TEST_STATE.COMPLETED){
						let parentDataObj = possibleParents[j].workspace;
						possibleParents[j].subTests[k].parentWorkspace = parentDataObj;
						return true
					}
					searchParent(possibleParents[j].subTests,child)
				}
			}
			
		}
		return false;
	}
export const getDataFromParent = (prevStore,action) =>{
	var testsArray = [...prevStore];
	for(let i=0;i<testsArray.length;i++){
		if(testsArray[i].subTests){
			let found = searchParent(testsArray[i].subTests,action.test)
			if(found){
				break;
			}
		}
	}
	return testsArray;
}
/**
 * Find and mark the tests that have run as completed or failed.
 * @param {*} prevStore 
 * @param {*} action 
 */
export const updateTestsStatus = (prevStore, action) => {
	var testsArray = [...prevStore];
	for (let i = 0; i < testsArray.length; i++) {
		updateTestStatus(testsArray, testsArray[i], action);
	}
	return testsArray;
};

function updateTestStatus(testsArray, test, action) {
	if (action.test.testId === test.testId) {
		//Saving state and duration, in order to be saved to the store.
		test.state = action.state;
		test.startTime = action.test.startTime;
		test.endTime = action.test.endTime;
		test.workspace = action.test.workspace;
		test.identifiers = action.test.identifiers;
		test.httpResponseValidation = action.test.httpResponseValidation;
		test.workspaceValidation = action.test.workspaceValidation;
		
		if (action.state === TEST_STATE.FAILED) {
			test.failReason = action.test.failReason;
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