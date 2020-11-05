var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var Utils = require('sdmx-tck-api').utils.Utils;
var SdmxDataObjects = require('sdmx-tck-api').model.SdmxDataObjects;
var TckError = require('sdmx-tck-api').errors.TckError;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
class DataSemanticChecker{

    static checkWorkspace(test, preparedRequest, workspace){
        return new Promise((resolve,reject) => {
            var query = preparedRequest.request;
            try {
                let validation = {};
                if (test.testType === TEST_TYPE.DATA_IDENTIFICATION_PARAMETERS) {
                    validation = DataSemanticChecker.checkIdentification(query, workspace)
                }
                // } else if (test.testType === TEST_TYPE.STRUCTURE_REFERENCE_PARAMETER) {
                //     validation = StructuresSemanticChecker.checkReferences(query, workspace);
                // } else if (test.testType === TEST_TYPE.STRUCTURE_DETAIL_PARAMETER) {
                //     validation = StructuresSemanticChecker.checkDetails(query, workspace);
                // } else if(test.testType === TEST_TYPE.STRUCTURE_TARGET_CATEGORY){
                //     validation = StructuresSemanticChecker.checkTargetCategory(query, workspace);
                // }
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }

    static checkIdentification(query, workspace){
        if(!query){
            throw new Error("Missing mandatory parameter 'query'")
        }
        if(!workspace || !workspace instanceof SdmxDataObjects){
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        let identifiers = query.flow.split(',');
        let requestedAgencyId = identifiers[0]
        let requestedId = identifiers[1]
        let requestedVersion = identifiers[2]

        if(Utils.isDefined(requestedAgencyId) && Utils.isDefined(requestedId) && Utils.isDefined(requestedVersion)){
            let structureId = workspace.getStructureId();
            if(structureId.getAgencyId()!==requestedAgencyId || structureId.getId()!==requestedId || structureId.getVersion()!==requestedVersion){
                return {status:FAILURE_CODE, error:"Error in Identification"}
            }
        }
        return {status:SUCCESS_CODE}
    }
}

module.exports = DataSemanticChecker;