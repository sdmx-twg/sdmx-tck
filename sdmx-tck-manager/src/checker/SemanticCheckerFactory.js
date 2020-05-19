var StructuresSemanticChecker = require("./StructuresSemanticChecker.js");
var ContentConstraintReferencePartialChecker = require("./ContentConstraintReferencePartialChecker.js")
var SchemasSemanticChecker = require('./SchemasSemanticChecker.js')

const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

class SemanticCheckerFactory {
    static getChecker(test) {
        if(test.index === TEST_INDEX.Structure){
            if(test.testType === TEST_TYPE.STRUCTURE_REFERENCE_PARTIAL){
                return ContentConstraintReferencePartialChecker;
            }
            return StructuresSemanticChecker;
        }else if(test.index === TEST_INDEX.Schema){
            return SchemasSemanticChecker;
        }
        
    }
};

module.exports = SemanticCheckerFactory;