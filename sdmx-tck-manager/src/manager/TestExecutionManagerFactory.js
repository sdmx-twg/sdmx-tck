var StructureTestExecutionManager = require('./StructureTestExecutionManager.js')
var SchemaTestExecutionManager = require('./SchemaTestExecutionManager.js')
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

class TestExecutionManagerFactory{
   
    static getTestsManager(index){
        if(index === TEST_INDEX.Structure){
           return  StructureTestExecutionManager
        }else if(index === TEST_INDEX.Schema){
            return SchemaTestExecutionManager
        }
    }

  
};

module.exports = TestExecutionManagerFactory;