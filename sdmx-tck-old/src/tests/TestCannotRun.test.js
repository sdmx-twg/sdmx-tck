import { extractSelectedTests, selectTests } from '../handlers/helperFunctions';
import TestModelBuilder from '../builders/TestsModelBuilder';
import { ACTION_NAMES } from '../constants/ActionsNames';
import { TEST_STATE } from '../constants/AppConstants';

describe('Extract Running Tests', function () {
    it("extract tests", function () {
        var testArray = TestModelBuilder.createTestsModel();

        var list = ["Structure"];
        var action = {
            type: ACTION_NAMES.MARK_TESTS_TO_RUN,
            data: list
        }
        var testArray1 = selectTests(testArray, action)

        var runArray = extractSelectedTests(testArray1)
        var counter = 0;
        for (let i = 0; i < runArray.length; i++) {
            if (runArray[i].run === true) {
                counter++;
            }
            for (let j = 0; j < runArray[i].subTests.length; j++) {

                if (runArray[i].subTests[j].run === true) {
                    counter++;
                }
                for (let k = 0; k < runArray[i].subTests[j].subTests.length; k++) {
                    if (runArray[i].subTests[j].subTests[k].run === true) {
                        counter++;
                    }
                    for (let h = 0; h < runArray[i].subTests[j].subTests[k].subTests.length; h++) {
                        if (runArray[i].subTests[j].subTests[k].subTests[h].run === true) {
                            counter++;
                        }
                    }

                }
            }
        }
        testArray[0].subTests[0].subTests[2].subTests[0].state = TEST_STATE.FAILED;
        var updateAction = {
            type: ACTION_NAMES.CHILDREN_CANNOT_RUN,
            data: { testInfo: testArray[0].subTests[0].subTests[2].subTests[0], result: TEST_STATE.FAILED }
        }
        //console.log(updatedArray[0].subTests[0].subTests[2])
        // var updatedArray = testsCannotRun(testArray, updateAction);
        // console.log(updatedArray[0].subTests[0].subTests[2].subTests[0].status.text)
    });
});
