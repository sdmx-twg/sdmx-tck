const { DATA_QUERY_KEY } = require('sdmx-tck-api/src/constants/data-queries-constants/DataQueryKey');

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
                }else if(test.testType === TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS){
                    validation = DataSemanticChecker.checkExtendedResourceIdentification(test,query, workspace)
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
        let requestedVersion = (identifiers[2] === "latest" || !identifiers[2]) ? null:identifiers[2]

        let reformedQuery = {agency:requestedAgencyId,
                        id:requestedId,
                        version:requestedVersion}

        let structureId = workspace.getStructureId();
        if(Utils.isSpecificAgency(reformedQuery) && Utils.isSpecificItem(reformedQuery) && Utils.isSpecificVersion(reformedQuery)){
            if(structureId.getAgencyId()!==requestedAgencyId || structureId.getId()!==requestedId || structureId.getVersion()!==requestedVersion){
                return {status:FAILURE_CODE, error:"Error in Identification"}
            }
        }else if (Utils.isSpecificAgency(reformedQuery) && Utils.isSpecificItem(reformedQuery) && !Utils.isSpecificVersion(reformedQuery)){
             if(structureId.getAgencyId()!==requestedAgencyId || structureId.getId()!==requestedId){
                return {status:FAILURE_CODE, error:"Error in Identification"}
            }
        }else if (!Utils.isSpecificAgency(reformedQuery) && Utils.isSpecificItem(reformedQuery) && !Utils.isSpecificVersion(reformedQuery)){
            if(structureId.getAgencyId()!==requestedAgencyId){
               return {status:FAILURE_CODE, error:"Error in Identification"}
           }
        }

        return {status:SUCCESS_CODE}
    }

    static checkExtendedResourceIdentification(test,query,workspace){
        if(!query){
            throw new Error("Missing mandatory parameter 'query'")
        }
        if(!test){
            throw new Error("Missing mandatory parameter 'test'")
        }
        if(!workspace || !workspace instanceof SdmxDataObjects){
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if(test.reqTemplate.key === DATA_QUERY_KEY.PARTIAL_KEY || test.reqTemplate.key === DATA_QUERY_KEY.MANY_KEYS){
            return this._validateSeriesAgainstKey(query.key,workspace)
        }
        return {status:SUCCESS_CODE}

    }

    static _validateSeriesAgainstKey(key,workspace){
        if(!key){
            throw new Error("Missing mandatory parameter 'key'")
        }
        if(!workspace || !workspace instanceof SdmxDataObjects){
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        let keyArray = key.split(".")
        keyArray = keyArray.filter(elem => {
            return elem && elem!==""
        })
        //TODO:IF THERE ARE MANY DATASETS WE HAVE TO SEARCH FOR EVERY ONE OF THEM?
        let series = workspace.getAllSeries();
        let result = series.filter(serieObj => {
            for(let i in keyArray){
                if(keyArray[i].indexOf("+") !== -1){
                    let keysWithOr = keyArray[i].split("+")
                    for(let j in keysWithOr){
                        if(!serieObj.hasOneOfTheAttributes(keysWithOr)){return true}
                    } 
                }else{
                    if(!serieObj.hasAttribute(keyArray[i])){return true}
                }
            }
        })
        if(result.length > 0){return {status:FAILURE_CODE, error:"Error in Extenden Resource Identification: There are series that do not comply with the requested key." + JSON.stringify(result)} }
        return {status:SUCCESS_CODE}

    }
}

module.exports = DataSemanticChecker;