import { selectTests } from '../handlers/helperFunctions';
import TestModelBuilder from '../builders/TestsModelBuilder';
import { ACTION_NAMES } from '../constants/ActionsNames';

describe('Select tests to Run', function () {
    it("mark tests",function(){
        var testArray = TestModelBuilder.createTestsModel();
       
        var list = ["Structure"];
        var action = { type:ACTION_NAMES.MARK_TESTS_TO_RUN,
            data:list}
        testArray = selectTests(testArray,action)
        var counter = 0;
        for(let i=0;i<1;i++){
            for(let j=0;j<testArray[i].subTests.length;j++){
                if(testArray[i].subTests[j].run === true){
                    counter++;
                }
                for(let k=0;k<testArray[i].subTests[j].subTests.length;k++){
                    if(testArray[i].subTests[j].subTests[k].run === true){
                        counter++;
                    }
                    for(let p=0;p<testArray[i].subTests[j].subTests[k].subTests.length;p++){ 
                        if(testArray[i].subTests[j].subTests[k].subTests[p].run === true){
                            counter++;
                        }
                        for(let h=0;h<testArray[i].subTests[j].subTests[k].subTests[p].subTests.length;h++){ 
                            if(testArray[i].subTests[j].subTests[k].subTests[p].subTests[h].run === true){
                                counter++;
                            }
                        }       
                        
                    }
                }
            }
        }
        /*According to a specific example the counter has to match the number 26*/
        if(counter === 50){
            console.log("success")
        }
        
    });
    
});
