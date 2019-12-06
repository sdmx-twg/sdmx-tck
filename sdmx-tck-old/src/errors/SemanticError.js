import TckError from "./TckError";

export default class SemanticError extends TckError {
    constructor(errorMessage, details) {
        super(errorMessage, 'SEMANTIC_ERROR');

        this.details = details;
    }
};