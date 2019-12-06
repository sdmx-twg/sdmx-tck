import StructuresSemanticChecker from "./StructuresSemanticChecker"

export default class SemanticCheckerFactory {
    static getChecker(query) {
        // TODO check query params to decide which semantic checker to return.
        return StructuresSemanticChecker;
    }
};