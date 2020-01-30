
var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var Utils = require('sdmx-tck-api').utils.Utils;

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

                if(Object.entries(finalTestData.codelistTest).length === 0){
                    throw new Error ('Not specified test for Code List under validation')
                }
                if(Object.entries(finalTestData.keyValueToCheck).length === 0){
                    throw new Error ('Not specified Key Value under validation')
                }

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

    /*Checks whether the partial codelist is following the constraints set.
    If the Key Value is included then the validation is the following:
        If the Codes from the partial codelist are a subset of the values in constraint then 
        the validation is successful. In any other case the validation fails.
    
    If the Key Value is excluded then the validation is the following:
        If the Codes from the partial codelist include any constraint value then the validation fails. In the case
        that no constraint value in included in the codes the validation is considered successful.  */
    static specificValueValidation(keyValue,codesArray){
        if(codesArray.length === 0){
            throw new Error('No codes to check')
        }
        if(keyValue.value.length === 0){
            throw new Error('No constraint values to check')
        }

        if(keyValue.includeType === 'true'){
            console.log("include")
            let includedValues = [];
            for(let i=0;i<keyValue.value.length;i++){
                includedValues.push(keyValue.value[i].value)
            }
            return codesArray.every(val => includedValues.includes(val));

        }else if(keyValue.includeType === 'false'){
            console.log("exclude")
            for(let i=0;i<keyValue.value.length;i++){
                if(codesArray.indexOf(keyValue.value[i].value) !== -1){
                    return false;
                }
            }
            return true;
            
        }   
    }
    //Check the partial codelist workspace if it is compatible with the constraint and return the appropriate info.
    static checkCodelistWorkspace(workspace,keyValue){
        if(!Utils.isDefined(workspace)){
            throw new Error("Missing codelist request's workspace");
        }
        let codesArray =[];
        for(let i=0;i<workspace.structures.CODE_LIST[0].getItems().length;i++){
            codesArray.push(workspace.structures.CODE_LIST[0].getItems()[i].id);
        }
        if(!SpecialReferencePartialChecker.specificValueValidation(keyValue,codesArray)){
            return { status: FAILURE_CODE, error: "Codelist is incompatible with the given code values constraints."};
        }
        return { status: SUCCESS_CODE }
    }

    //Get the reference of a specific structureType
    static getRefsOfSpecificStructureType(refs,structureType){
        
        if(refs.length>0){
            for(let i=0;i<refs.length;i++){
                if(refs[i].getStructureType() === structureType){
                    return refs[i];
                }
            }
        }
        return {};
    }

     //Find a KeyValue from a Cube Region that exists as a dimension in the selected DSD.
     static findMatchingKeyValue(constraintCubeRegions,dsd){
        let keyValue;
        for(let i=0;i<constraintCubeRegions.length;i++){
            let keyValues = constraintCubeRegions[i].getKeyValue();
            for(let j=0;j<keyValues.length;j++){
                keyValue = keyValues[j];
                let keyValFound  = dsd.componentExistsInDSD(keyValue.id);
                if(keyValFound && keyValue.value && keyValue.value.length>0){
                    return keyValue;
                }
            }
        }
        return {};
    }

    static findTheCodeListAndKeyValue(sdmxObjects,constrainableArtefacts,constraintCubeRegions){
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        if (!Utils.isDefined(constrainableArtefacts) || constrainableArtefacts.length === 0) {
            throw new Error("Missing constrainable artefacts");
        }
        if (!Utils.isDefined(constraintCubeRegions) || constraintCubeRegions.length === 0) {
            throw new Error("Missing Cube Regions.");
        }
        for(let counter=0;counter<constrainableArtefacts.length;counter++){
            if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key){
                let structureList = sdmxObjects.getSdmxObjectsWithCriteria(constrainableArtefacts[counter].structureType,constrainableArtefacts[counter].agency,constrainableArtefacts[counter].id,constrainableArtefacts[counter].version)
                console.log(structureList)
                //If the constrainable artefact exists in Content Constraint 'descendats' request's workspace
                if(structureList.length !== 0){
                    let structureRef = new StructureReference(constrainableArtefacts[counter].structureType, structureList[0].agencyId, structureList[0].id, structureList[0].version);
                    let dsdRef = SpecialReferencePartialChecker.getRefsOfSpecificStructureType(sdmxObjects.getChildren(structureRef),SDMX_STRUCTURE_TYPE.DSD.key)
                    let dsd = sdmxObjects.getSdmxObject(dsdRef)
                    let selectedkeyValue = SpecialReferencePartialChecker.findMatchingKeyValue(constraintCubeRegions,dsd)
                    if(Object.entries(selectedkeyValue).length !== 0){
                        console.log("--------------------SELECTED DSD------------------------")
                        console.log(dsdRef)
                        console.log("--------------------SELECTED CONSTRAINABLE------------------------")
                        console.log(structureRef)
                        return {codelistRef:dsd.getReferencedCodelistInComponent(selectedkeyValue.id),
                                keyValue:selectedkeyValue}
                    }
                }
               
                
            }else if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key){
                let structureList = sdmxObjects.getSdmxObjectsWithCriteria(constrainableArtefacts[counter].structureType,constrainableArtefacts[counter].agency,constrainableArtefacts[counter].id,constrainableArtefacts[counter].version)
                let structureRef = new StructureReference(constrainableArtefacts[counter].structureType, structureList[0].agencyId, structureList[0].id, structureList[0].version);
                let dataflowRef = SpecialReferencePartialChecker.getRefsOfSpecificStructureType(sdmxObjects.getChildren(structureRef),SDMX_STRUCTURE_TYPE.DATAFLOW.key)

                console.log("--------------------SELECTED DATAFLOW------------------------")
                console.log(dataflowRef)
                let dsdRef = SpecialReferencePartialChecker.getRefsOfSpecificStructureType(sdmxObjects.getChildren(dataflowRef),SDMX_STRUCTURE_TYPE.DSD.key)

                console.log("--------------------SELECTED DSD------------------------")
                console.log(dsdRef)
                let dsd = sdmxObjects.getSdmxObject(dsdRef)

                let selectedkeyValue = SpecialReferencePartialChecker.findMatchingKeyValue(constraintCubeRegions,dsd);
                if(Object.entries(selectedkeyValue).length !== 0){
                    console.log("--------------------SELECTED DSD------------------------")
                    console.log(dsdRef)
                    console.log("--------------------SELECTED CONSTRAINABLE------------------------")
                    console.log(structureRef)
                    return {codelistRef:dsd.getReferencedCodelistInComponent(selectedkeyValue.id),
                            keyValue:selectedkeyValue}
                }

            }else if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.DSD.key){
                let structureList = sdmxObjects.getSdmxObjectsWithCriteria(constrainableArtefacts[counter].structureType,constrainableArtefacts[counter].agency,constrainableArtefacts[counter].id,constrainableArtefacts[counter].version)
                let structureRef = new StructureReference(constrainableArtefacts[counter].structureType, structureList[0].agencyId, structureList[0].id, structureList[0].version);
                let dsdRef = structureRef

                let dsd = structureList[0];
                let selectedkeyValue = SpecialReferencePartialChecker.findMatchingKeyValue(constraintCubeRegions,dsd);
                if(Object.entries(selectedkeyValue).length !== 0){
                    console.log("--------------------SELECTED DSD------------------------")
                    console.log(dsdRef)
                    console.log("--------------------SELECTED CONSTRAINABLE------------------------")
                    console.log(structureRef)
                    return {codelistRef:dsd.getReferencedCodelistInComponent(selectedkeyValue.id),
                            keyValue:selectedkeyValue}
                }

            }
        }
        return {};
        
    }
    static referencepartialTestBuilder(test,sdmxObjects){
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        if(!Utils.isDefined(test)){
            throw new Error("Missing mandatory parameter: 'descendants' test .");
        }
        let resource = "codelist";
        let template = {detail:"referencepartial"};
        let codelistTest = {};

        //Get from constraint the constrainable artefacts as well as the cube region(s).
        let constraint = sdmxObjects.getSdmxObject(new StructureReference(test.identifiers.structureType,test.identifiers.agency,test.identifiers.id,test.identifiers.version))
        if(constraint.getType()!== "Allowed"){
            throw new Error('There is no Content Constraint of type "Allowed" to proceed with this test.')
        }
        let constrainableArtefacts = constraint.getChildren();
        let constraintCubeRegions = constraint.getCubeRegion();
        console.log("-------------------CONSTRAINABLE ARTEFACTS---------------------")
        console.log(constrainableArtefacts)
        console.log("-------------------CUBE REGIONS---------------------")
        console.log(constraintCubeRegions)

        //According to the constrainable artefact selected the function will return a codelist ref.
        let testData = SpecialReferencePartialChecker.findTheCodeListAndKeyValue(sdmxObjects,constrainableArtefacts,constraintCubeRegions)
        
        let codeListRef = testData.codelistRef;
        let keyValueToCheck = testData.keyValue;
        console.log("-------------------KEYVALUE---------------------")
        console.log(keyValueToCheck)
        console.log("-------------------CODELIST---------------------")
        console.log(codeListRef)
        if(Object.entries(testData).length !== 0 && Object.entries(codeListRef).length !== 0){
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