const { DATA_QUERY_KEY } = require('sdmx-tck-api/src/constants/data-queries-constants/DataQueryKey');
const { SDMX_STRUCTURE_TYPE } = require('sdmx-tck-api/src/constants/SdmxStructureType');
const STRUCTURE_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var Utils = require('sdmx-tck-api').utils.Utils;
var SdmxDataObjects = require('sdmx-tck-api').model.SdmxDataObjects;
var TckError = require('sdmx-tck-api').errors.TckError;
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var HelperManager = require('../manager/HelperManager.js');
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
class DataSemanticChecker{

    static checkWorkspace(test, preparedRequest, workspace){
        return new Promise((resolve,reject) => {
            var query = preparedRequest.request;
            try {
                let validation = {};
                if (test.testType === TEST_TYPE.DATA_IDENTIFICATION_PARAMETERS) {
                    validation = DataSemanticChecker.checkResourceIdentification(test,query,workspace)
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

    static async checkResourceIdentification(test,query,workspace){
        if(!query){
            throw new Error("Missing mandatory parameter 'query'")
        }
        if(!workspace || !workspace instanceof SdmxDataObjects){
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if(!test){
            throw new Error("Missing mandatory parameter 'test'")
        }
       
        if(query.provider ==="all"){
            return this._checkIdentification(query,workspace)
        }
        return  this._checkProviderIdentification(test,query,workspace)
        
    }

    static async _checkProviderIdentification(test,query,workspace){
        try{
            if(!query){
                throw new Error("Missing mandatory parameter 'query'")
            }
            if(!test){
                throw new Error("Missing mandatory parameter 'test'")
            }
            if(!workspace || !workspace instanceof SdmxDataObjects){
                throw new Error("Missing mandatory parameter 'workspace'")
            }
            
            if(workspace.getStructureRefs().find(ref=> ref.getStructureType()!== SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key)){
                return {status:FAILURE_CODE, error:"Error in Identification:All structure references must be "+SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key}
            }
                
            let praRefs = workspace.getStructureRefs();
            for(let i in praRefs){
                if(!test.structureWorkspace.exists(praRefs[i])){
                    return {status:FAILURE_CODE, error:"Error in Identification: "+praRefs[i]+" is not related to requested DF"}
                }

                let praObj = test.structureWorkspace.getSdmxObject(praRefs[i]);
            
                if(query.provider.indexOf("+")!== -1){
                    if(!praObj.getChildren().find(child=>child.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key
                        && child.getIdentifiableIds().indexOf(query.provider.split("+")[i])!==-1)){
                        return {status:FAILURE_CODE, error:"Error in Identification: "+praRefs[i]+" is not related to requested DF"}
                    }
                }else if(query.provider.indexOf(",")!==-1){
                    if(!praObj.getChildren().find(child => 
                        child.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key
                        && child.getIdentifiableIds().indexOf(query.provider.split(",")[1])!==-1
                        && child.getAgencyId() === query.provider.split(",")[0])){
                            return {status:FAILURE_CODE, error:"Error in Identification: The Maintainable of "+praRefs[i]+" does not contain the requested providerId."}
                        }                
                }else{
                    if(!praObj.getChildren().find(child=>child.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key
                        && child.getIdentifiableIds().indexOf(query.provider)!==-1)){
                        return {status:FAILURE_CODE, error:"Error in Identification: "+praRefs[i]+" is not related to requested DF"}
                        }
                    }
                }
                return {status:SUCCESS_CODE}
                

                
                
                
                

                
                //    new StructureReference(test.identifiers.structureType,test.identifiers.agencyId,test.identifiers.id,test.identifiers.version)))
                // let helpTestParams = {
                //     testId: "/"+STRUCTURE_REST_RESOURCE.provisionagreement+"/agency/id/version?references="+STRUCTURE_REFERENCE_DETAIL.CHILDREN,
                //     index: TEST_INDEX.Structure,
                //     apiVersion: test.apiVersion,
                //     resource: STRUCTURE_REST_RESOURCE.provisionagreement,
                //     reqTemplate: {references:STRUCTURE_REFERENCE_DETAIL.CHILDREN},
                //     identifiers: {structureType:praRef.getStructureType(),agency:praRef.getAgencyId(),id:praRef.getId(),version:praRef.getVersion()},
                //     testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS
                // }
                // //TODO:DO THIS IN EVERY HELPING TEST
                // if(!praRef.getAgencyId()){helpTestParams.reqTemplate.agency="all"}
                // let helperWorkspace = await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(helpTestParams),test.apiVersion,url);
                // console.log(test)
                
            
        }catch(e){
            console.log(e)
        }
        
        
    }

    static _checkIdentification(query,workspace){
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

        //TODO:IF THERE ARE MANY DATASETS WE HAVE TO SEARCH FOR EVERY ONE OF THEM?
        let series = workspace.getAllSeries();
        let result = series.filter(serieObj => {
            return !serieObj.complyWithRequestedKey(key)
        })
        if(result.length > 0){return {status:FAILURE_CODE, error:"Error in Extenden Resource Identification: There are series that do not comply with the requested key." + JSON.stringify(result)} }
        return {status:SUCCESS_CODE}

    }
}

module.exports = DataSemanticChecker;