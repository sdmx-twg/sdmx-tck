import { extractSelectedTests, updateTestsStatus, selectTests } from '../handlers/helperFunctions';
import TestModelBuilder from '../builders/TestsModelBuilder';
import { ACTION_NAMES } from '../constants/ActionsNames';

describe('Extract Running Tests', function () {
    it("extract tests",function(){
        var testArray = TestModelBuilder.createTestsModel();
       
        var list = ["Structure"];
        var action = { type:ACTION_NAMES.MARK_TESTS_TO_RUN,
            data:list}
        testArray = selectTests(testArray,action)
        
        var runArray = extractSelectedTests(testArray)
        var counter = 0;
        for(let i=0;i<runArray.length;i++){
            if(runArray[i].run === true){
                counter++;
            }
            for(let j=0;j<runArray[i].subTests.length;j++){
                
                if(runArray[i].subTests[j].run === true){
                    counter++;
                }
                for(let k=0;k<runArray[i].subTests[j].subTests.length;k++){
                    if(runArray[i].subTests[j].subTests[k].run === true){
                        counter++;
                    }
                    for(let h=0;h<runArray[i].subTests[j].subTests[k].subTests.length;h++){
                        if(runArray[i].subTests[j].subTests[k].subTests[h].run === true){
                            counter++;
                        }
                    }

                }
            }
        }
        var updateAction = { type:ACTION_NAMES.UPDATE_TEST_STATE,
            data:{testInfo:runArray[0].subTests[2].subTests[0],result:"success"}}
            
            var updatedArray = updateTestsStatus(testArray,updateAction)
            console.log(updatedArray[0].subTests[0].subTests[2].subTests[0])
            console.log(updatedArray[0].subTests[1].subTests[2].subTests[0])
            console.log(updatedArray[0].subTests[0].subTests[5].subTests[0])
    });
    
});
