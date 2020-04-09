var StructureTestExecutionManager = require('./StructureTestExecutionManager.js')
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

class TestExecutionManagerFactory{
   
    static getTestsManager(index){
        if(index === TEST_INDEX.Structure){
           return  StructureTestExecutionManager
        }
    }

  
};

module.exports = TestExecutionManagerFactory;