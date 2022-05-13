var TckError = require("./TckError.js");

class SemanticError extends TckError {
    constructor(errorMessage, details) {
        super(errorMessage, 'SEMANTIC_ERROR');

        this.details = details;
    }
};

module.exports = SemanticError;