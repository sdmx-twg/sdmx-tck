var StructuresSemanticChecker = require("./StructuresSemanticChecker.js");
var SpecialReferencePartialChecker = require("./SpecialReferencePartialChecker.js")
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;

class SemanticCheckerFactory {
    static getChecker(query,testType) {
        if(testType === TEST_TYPE.STRUCTURE_REFERENCE_PARTIAL){
            return SpecialReferencePartialChecker;
        }
        // TODO check query params to decide which semantic checker to return.
        return StructuresSemanticChecker;
    }
};

module.exports = SemanticCheckerFactory;