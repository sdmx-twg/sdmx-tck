
var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;

var SemanticError = require('sdmx-tck-api').errors.SemanticError;


const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const STRUCTURE_QUERY_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_QUERY_DETAIL;

var SdmxObjects = require('sdmx-tck-api').model.SdmxObjects;
var StructureReference = require('sdmx-tck-api').model.StructureReference;

var Utils = require('sdmx-tck-api').utils.Utils;

var TckError = require('sdmx-tck-api').errors.TckError;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
var SpecialManager = require("../manager/SpecialManager.js");


class SpecialReferencePartialChecker {
    static checkWorkspace(test, workspace) {
        return new Promise((resolve, reject) => {
            try {
                let validation = SpecialReferencePartialChecker.referencePartialTestingProcedure(test,workspace);
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    };

    static referencePartialTestingProcedure(test,sdmxObjects){
        if(test.parentData && test.parentData.child){
           
            let t = SpecialReferencePartialChecker.createTestForChild(test,sdmxObjects);
            console.log(t)
            // SpecialManager.executeTest(t, test.apiVersion, "https://registry.sdmx.org/ws/public/sdmxapi/rest/").then(
            //         (result) => { console.log(result)},
            //         (error) => { console.log(error)});
            
        }
        
    }
    //Find a KeyValue from a Cube Region that exists in the selected DSD's dimensions.
    static findMatchingKeyValue(test,dsd){
        let keyValue;
        for(let i=0;i<test.parentData.cubeRegion.length;i++){
            for(let j=0;j<test.parentData.cubeRegion[i].KeyValue.length;j++){
                keyValue = test.parentData.cubeRegion[i].KeyValue[j]
                let keyValFound  = SpecialReferencePartialChecker.keyValueExistsInDSD(keyValue,dsd);
                if(keyValFound){
                    return keyValue;
                }
            }
        }
        return {};
    }
    
    //Check whether a KeyValue exists as a dimension in the provided dsd
    static keyValueExistsInDSD(selectedkeyValue,dsd){
        for (let i=0;i<dsd.dimensions.length;i++){
            if(dsd.dimensions[i].dimensionId === selectedkeyValue.id){
                return true;
            }
        }
        return false;
    };

    //Return a reference from the codelist referenced by the chosen dimension.
    //If the codeList is not found it returns an empty obj
    static getDimensionReferencedCodelist(selectedkeyValue,dsd){
        for (let i=0;i<dsd.dimensions.length;i++){
            if(dsd.dimensions[i].dimensionId === selectedkeyValue.id){
                if(dsd.dimensions[i].dimensionReferences){
                    for(let j=0;j<dsd.dimensions[i].dimensionReferences.length;j++){
                        if(dsd.dimensions[i].dimensionReferences[j].structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key){
                            return new StructureReference(
                                dsd.dimensions[i].dimensionReferences[j].structureType,
                                dsd.dimensions[i].dimensionReferences[j].agencyId,
                                dsd.dimensions[i].dimensionReferences[j].id,
                                dsd.dimensions[i].dimensionReferences[j].version,
                            )
                        }
                    }
                }
            }
        }
        return {};
    };
    
    static findTestStruct(test,sdmxObjects){
        for(let counter=0;counter<test.parentData.child.length;counter++){
            if(test.parentData.child[counter].structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key){
                let structureList = sdmxObjects.getSdmxObjectsWithCriteria(test.parentData.child[counter].structureType,test.parentData.child[counter].agency,test.parentData.child[counter].id,test.parentData.child[counter].version)
                let structureRef = new StructureReference(test.parentData.child[counter].structureType, structureList[0].agencyId, structureList[0].id, structureList[0].version);
                //Validation for only one dsd missing!!!!
                let dsdRef = sdmxObjects.getChildren(structureRef)
                let dsd = sdmxObjects.getSdmxObject(dsdRef[0])
                let selectedkeyValue = SpecialReferencePartialChecker.findMatchingKeyValue(test,dsd)
                if(Object.entries(selectedkeyValue).length !== 0){
                    return SpecialReferencePartialChecker.getDimensionReferencedCodelist(selectedkeyValue,dsd)
                }
                
            }else if(test.parentData.child[counter].structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key){
                 resource = "provisionagreement";
                 references = {references:"descendants"}
    
            }else if(test.parentData.child[counter].structureType === SDMX_STRUCTURE_TYPE.DSD.key){
                let dsdList = sdmxObjects.getSdmxObjectsWithCriteria(test.parentData.child[counter].structureType,test.parentData.child[counter].agency,test.parentData.child[counter].id,test.parentData.child[counter].version)
    
            }
        }
        
    }
    static createTestForChild(test,sdmxObjects){
        let resource = "codelist";
        let references = {references:"referencepartial"};
        let codelistTest = {};
        
        let codeListRef = SpecialReferencePartialChecker.findTestStruct(test,sdmxObjects)
        if(Object.entries(codeListRef).length !== 0){
            codelistTest = {
                testId: "/"+resource+"/agency/id/version?references="+references.references,
                index: test.index,
                run: false,
                apiVersion: test.apiVersion,
                resource: resource,
                requireRandomSdmxObject: true,
                reqTemplate: {references:"referencepartial"},
                identifiers: {structureType:codeListRef.getStructureType(),agency:codeListRef.getAgencyId(),id:codeListRef.getId(),version:codeListRef.getVersion()},
                state: TEST_STATE.WAITING,
                failReason: "",
                testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                subTests: []
            }
        }
        

        return codelistTest;
    }
};


module.exports = SpecialReferencePartialChecker;