
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
var ReferencePartialTestManager = require("../manager/ReferencePartialTestManager.js");


class SpecialReferencePartialChecker {
    static checkWorkspace(test, workspace) {
        return new Promise((resolve, reject) => {
            try {
                let finalTestData = SpecialReferencePartialChecker.referencepartialTestBuilder(test,workspace);
                ReferencePartialTestManager.executeTest(finalTestData.codelistTest, test.apiVersion, test.preparedRequest.service.url).then(
                    (result) => {
                        let validation = SpecialReferencePartialChecker.checkCodelistWorkspace(result.workspace,finalTestData.keyValueToCheck);
                        resolve(validation)
                    },
                    (error) => { 
                        reject (error)
                    });
            } catch (err) {
                reject(new TckError(err));
            }
        });
    };

    static specificValueValidation(specificValue,codesArray){
        if(specificValue.includeType === 'true'){
            if(codesArray.indexOf(specificValue.value)!=-1){
                return true;
            }
        }else if(specificValue.includeType === 'false'){
            if(codesArray.indexOf(specificValue.value) === -1){
                return true;
            }
        }
        return false;
    }
    static checkCodelistWorkspace(workspace,keyValue){
        // console.log(keyValue)
        // console.log(workspace.structures.CODE_LIST[0].getItems())
        let codesArray =[];
        for(let i=0;i<workspace.structures.CODE_LIST[0].getItems().length;i++){
            codesArray.push(workspace.structures.CODE_LIST[0].getItems()[i].id);
        }
        if(keyValue.value){
            for(let i=0;i<keyValue.value.length;i++){
                if(!SpecialReferencePartialChecker.specificValueValidation(keyValue.value[i],codesArray)){
                    return { status: FAILURE_CODE, error: "Codelist is incompatible with the given code values constraints."};
                }
            }
        }
        
        return { status: SUCCESS_CODE }
    }
    static getRefsOfSpecificStructureType(refs,structureType){
        for(let i=0;i<refs.length;i++){
            if(refs[i].getStructureType() === structureType){
                return refs[i];
            }
        }
        return {};
    }

     //Find a KeyValue from a Cube Region that exists in the selected DSD's dimensions.
     static findMatchingKeyValue(constraintCubeRegions,dsd){
        let keyValue;
        for(let i=0;i<constraintCubeRegions.length;i++){
            let keyValues = constraintCubeRegions[i].getKeyValue();
            for(let j=0;j<keyValues.length;j++){
                keyValue = keyValues[j];
                let keyValFound  = dsd.componentExistsInDSD(keyValue.id);
                if(keyValFound){
                    return keyValue;
                }
            }
        }
        return {};
    }

    static findTheCodeListAndKeyValue(test,sdmxObjects,constrainableArtefacts,constraintCubeRegions){
        for(let counter=0;counter<constrainableArtefacts.length;counter++){
            if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key){
                let structureList = sdmxObjects.getSdmxObjectsWithCriteria(constrainableArtefacts[counter].structureType,constrainableArtefacts[counter].agency,constrainableArtefacts[counter].id,constrainableArtefacts[counter].version)
                let structureRef = new StructureReference(constrainableArtefacts[counter].structureType, structureList[0].agencyId, structureList[0].id, structureList[0].version);
                //Validation for only one dsd missing!!!!!!!!
                //It might not be only dsds!!!!!!!!!
                let dsdRef = SpecialReferencePartialChecker.getRefsOfSpecificStructureType(sdmxObjects.getChildren(structureRef),SDMX_STRUCTURE_TYPE.DSD.key)
                let dsd = sdmxObjects.getSdmxObject(dsdRef)
                let selectedkeyValue = SpecialReferencePartialChecker.findMatchingKeyValue(constraintCubeRegions,dsd)
                if(Object.entries(selectedkeyValue).length !== 0){
                    return {codelistRef:dsd.getReferencedCodelistInComponent(selectedkeyValue.id),
                            keyValue:selectedkeyValue}
                }
                
            }else if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key){
                 resource = "provisionagreement";
                 references = {references:"descendants"}
    
            }else if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.DSD.key){
                let dsdList = sdmxObjects.getSdmxObjectsWithCriteria(constrainableArtefacts[counter].structureType,constrainableArtefacts[counter].agency,constrainableArtefacts[counter].id,constrainableArtefacts[counter].version)
    
            }
        }
        return {};
        
    }
    static referencepartialTestBuilder(test,sdmxObjects){
        let resource = "codelist";
        let template = {detail:"referencepartial"};
        let codelistTest = {};
        

        //IT HAS TO BE ALLOWED

        //Get from constraint the constrainable artefacts as well as the cube region(s).
        let constraint = sdmxObjects.getSdmxObject(new StructureReference(test.identifiers.structureType,test.identifiers.agency,test.identifiers.id,test.identifiers.version))
        if(constraint.getType()!== "Allowed"){
            throw new TckError('There is no Content Constraint of type "Allowed" to proceed with this test.')
        }
        let constrainableArtefacts = constraint.getChildren();
        let constraintCubeRegions = constraint.getCubeRegion();

        //According to the constrainable artefact selected the function will return a codelist ref.
        let testData = SpecialReferencePartialChecker.findTheCodeListAndKeyValue(test,sdmxObjects,constrainableArtefacts,constraintCubeRegions)
        
        let codeListRef = testData.codelistRef;
        let keyValueToCheck = testData.keyValue;
        if(Object.entries(testData).length !== 0){
            codelistTest = {
                testId: "/"+resource+"/agency/id/version?detail="+template.detail,
                index: test.index,
                run: false,
                apiVersion: test.apiVersion,
                resource: resource,
                requireRandomSdmxObject: true,
                reqTemplate: template,
                identifiers: {structureType:codeListRef.getStructureType(),agency:codeListRef.getAgencyId(),id:codeListRef.getId(),version:codeListRef.getVersion()},
                state: TEST_STATE.WAITING,
                failReason: "",
                testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                subTests: []
            }
        }
        

        return {codelistTest:codelistTest,keyValueToCheck:keyValueToCheck};
    }
};


module.exports = SpecialReferencePartialChecker;