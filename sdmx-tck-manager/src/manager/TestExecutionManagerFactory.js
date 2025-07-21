var StructureTestExecutionManager = require('./StructureTestExecutionManager.js')
var SchemaTestExecutionManager = require('./SchemaTestExecutionManager.js')
var DataTestsExecutionManager = require('./DataTestsExecutionManager.js')

const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

class TestExecutionManagerFactory{

    static getTestsManager(index){
        if(index === TEST_INDEX.Structure 
            || index === TEST_INDEX.Registration){
            return  StructureTestExecutionManager
        }else if(index === TEST_INDEX.Schema){
            return SchemaTestExecutionManager
        }else if(index === TEST_INDEX.Data){
            return DataTestsExecutionManager
        }
    }


};

module.exports = TestExecutionManagerFactory;