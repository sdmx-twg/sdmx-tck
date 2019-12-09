var StructuresSemanticChecker = require("./StructuresSemanticChecker.js");

class SemanticCheckerFactory {
    static getChecker(query) {
        // TODO check query params to decide which semantic checker to return.
        return StructuresSemanticChecker;
    }
};

module.exports = SemanticCheckerFactory;