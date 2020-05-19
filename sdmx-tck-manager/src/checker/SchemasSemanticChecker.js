const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;

class SchemasSemanticChecker {

    static checkWorkspace(test, preparedRequest, workspace) { 
        return new Promise((resolve, reject) => {
            var query = preparedRequest.request;
            try {
                let validation = {};
                if (test.testType === TEST_TYPE.SCHEMA_IDENTIFICATION_PARAMETERS) {
                    validation = SchemasSemanticChecker.checkIdentification(query, workspace)
                }
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }

    static checkIdentification (query,sdmxObjects){
        //1. Check SimpleTypes

        //2. Check ComplexTypes
    }
}

module.exports = SchemasSemanticChecker;