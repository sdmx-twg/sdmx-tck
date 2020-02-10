
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
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
var ReferencePartialTestManager = require("../manager/ReferencePartialTestManager.js");

/*Special class that handles the reference partial testing. Due to its complexity the referencepartial testing 
consists of two subparts. The first is a content constraint with reference = descendants request. 
From that request a specific codelist is retrieved. The second subpart is the request for this codelist with detail=referencepartial.
Finally the validation of the second request's workspace determines whether this test was successful or not.   

Flow:

1. Select a Content Constraint of type “allowed”
2. Select one of the Constraint Attachments (e.g. a Dataflow)
3. Select one of the Components constrained in a Cube Region.
4. Check that the Component is contained in the DSD of the selected Constraint Attachment (otherwise select another Component)
5. Perform inclusion/exclusion checks (according to cube region) between the constraint values and the codes of the partial codelist.*/

class SpecialReferencePartialChecker {
     
    /**
     * Validates the whole reference partial test as successful or not.Returns success code in case of success 
     * and failure code in case of an error or failure.
     * @param {*} test the test object of the above test.
     * @param {*} workspace the workspace of content constraint descendants
     */
    static checkWorkspace(test, workspace) {
        return new Promise((resolve, reject) => {
            try {

                /*Returns an object containing:
                    a) The codelist reference partial test info 
                    b) The KeyValue with which the partial codelist will be validated.
                    */
                let finalTestData = SpecialReferencePartialChecker.referencepartialTestBuilder(test,workspace);

                if(Object.entries(finalTestData.codelistTest).length === 0){
                    throw new Error ('Not specified test for Code List under validation')
                }
                if(Object.entries(finalTestData.keyValueToCheck).length === 0){
                    throw new Error ('Not specified Key Value under validation')
                }

                /*Executes the request to get the partial codelist*/
                ReferencePartialTestManager.executeTest(finalTestData.codelistTest, test.apiVersion, test.preparedRequest.service.url).
                    then((partialCLworkspace) => {
                        /*Partial codelist's workspace validation*/
                        let validation = SpecialReferencePartialChecker.checkCodelistWorkspace(finalTestData.codelistTest,partialCLworkspace,finalTestData.keyValueToCheck);
                        resolve(validation)
                    }).catch((error) => {
                        reject(new TckError(error.message))
                        
                    });
            } catch (err) {
                reject(new TckError(err.message));
            }
        });
    };
    
    /**
     * Checks whether the partial codelist follows the constraints.If yes it returns true else it returns false.
     * @param {*} keyValue the keyValue containing the constraint values.
     * @param {*} codesArray array with the codes of the partial codelist.
     */
    static constraintValuesValidation(keyValue,codesArray){

        if(codesArray.length === 0){
            throw new Error('No codes to check')
        }

        if(keyValue.includeType === 'true'){
            console.log("include")
            let includedValues = [];
            for(let i=0;i<keyValue.value.length;i++){
                includedValues.push(keyValue.value[i].value)
            }
            return includedValues.every(val => codesArray.includes(val));
    
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
    /**
     * Returns the result of the workspace validation of a partial codelist. In case of success it returns a success code,
     * else in the case of failure it returns a failure code along with the failure reason.
     * @param {*} codeListTestObj the test obj.
     * @param {*} workspace workspace of partial codelist.
     * @param {*} keyValue the keyValue containing the constraint values that will be checked along with the partial codelist's codes.
     */
    static checkCodelistWorkspace(codeListTestObj,workspace,keyValue){
        
        if (!Utils.isDefined(workspace) || !(workspace instanceof SdmxObjects)) {
            throw new Error("Missing codelist request's workspace");
        }
        let codesArray =[];
        let codelistObj= workspace.getSdmxObject(new StructureReference(codeListTestObj.identifiers.structureType,codeListTestObj.identifiers.agency,
                                                        codeListTestObj.identifiers.id,codeListTestObj.identifiers.version))
        for(let i=0;i<codelistObj.getItems().length;i++){
            codesArray.push(codelistObj.getItems()[i].id);
        }
        
        //If the codelist returned is not partial throw Error.
        if(codelistObj.getIsPartial() !== "true"){
            return { status: FAILURE_CODE, error: "Codelist is not partial."};
        }
        //If the codes of the partial codelist follow the constraint
        if(!SpecialReferencePartialChecker.constraintValuesValidation(keyValue,codesArray)){
            return { status: FAILURE_CODE, error: "Codelist is incompatible with the given code values constraints."};
        }
       
        return { status: SUCCESS_CODE }
    }
     /**
     * Get the reference of a specific structureType from the childrenRefs of a structure 
     * @param {*} childrenRefs children references of a structure.
     * @param {*} structureType the structureType needed.
     */
    static getRefsOfSpecificStructureType(childrenRefs,structureType){
        if(childrenRefs.length>0){
            for(let i=0;i<childrenRefs.length;i++){
                if(childrenRefs[i].getStructureType() === structureType){
                    return childrenRefs[i];
                }
            }
        }
        return {};
    }

     /**
     * Find a KeyValue from a Cube Region that exists as a component in the selected DSD.
     * If found the function returns the component else returns empty obj.
     * @param {*} constraintCubeRegions cubeRegion array from the content constraint obj.
     * @param {*} dsdObj the dsd object.
     */
     static findMatchingKeyValue(constraintCubeRegions,dsdObj){
        let keyValue;
        for(let i=0;i<constraintCubeRegions.length;i++){
            let keyValues = constraintCubeRegions[i].getKeyValues();
            for(let j=0;j<keyValues.length;j++){
                keyValue = keyValues[j];
                let keyValFound  = dsdObj.componentExistsAndItsCodedInDSD(keyValue.id)
                if(keyValFound && keyValue.value && keyValue.value.length>0){
                    return keyValue;
                }
            }
        }
        return {};
    }

    /**
     * Function that returns the reference of the codelist that is under validation as well as the KeyValue, 
     * the constraints of which will be validated in the codelist
     * @param {*} sdmxObjects the workspace of content constraint descendants
     * @param {*} constraint the constraint object of the above workspace.
     */
    static findTheCodeListAndKeyValue(sdmxObjects,constraint){
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //Get children and components from the constraint object
        let constrainableArtefacts = constraint.getChildren();
        let constraintCubeRegions = constraint.getCubeRegions();

        if (!Utils.isDefined(constrainableArtefacts) || constrainableArtefacts.length === 0) {
            throw new Error("Missing constrainable artefacts");
        }
        if (!Utils.isDefined(constraintCubeRegions) || constraintCubeRegions.length === 0) {
            throw new Error("Missing Cube Regions.");
        }
        console.log("-------------------CONSTRAINABLE ARTEFACTS---------------------")
        console.log(constrainableArtefacts)
        console.log("-------------------CUBE REGIONS---------------------")
        console.log(constraintCubeRegions)
        for(let counter=0;counter<constrainableArtefacts.length;counter++){
            if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key){
                let structureList = sdmxObjects.getSdmxObjectsWithCriteria(constrainableArtefacts[counter].structureType,constrainableArtefacts[counter].agency,constrainableArtefacts[counter].id,constrainableArtefacts[counter].version)
                console.log(structureList)

                //If the constrainable artefact exists in Content Constraint 'descendants' request's workspace
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
                            keyValueSet:selectedkeyValue}
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
                            keyValueSet:selectedkeyValue}
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
                            keyValueSet:selectedkeyValue}
                }

            }
        }
        return {};
        
    }
    /**
     * Builds the refernecepartial test for the codelist.Returns the test obj of the codelist as well as the constraint values
     * that will be checked in the codelist workspace
     * @param {*} test the test object of the above test.
     * @param {*} sdmxObjects the workspace of content constraint descendants
     */
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

        //Get the constraint obj from workspace
        let constraint = sdmxObjects.getSdmxObject(new StructureReference(test.identifiers.structureType,test.identifiers.agency,test.identifiers.id,test.identifiers.version))
        if(constraint.getType()!== "Allowed"){
            throw new Error('There is no Content Constraint of type "Allowed" to proceed with this test.')
        }
        //According to the constrainable artefact selected the function will return a codelist ref.
        let testData = SpecialReferencePartialChecker.findTheCodeListAndKeyValue(sdmxObjects,constraint)
        
        let codeListRef = testData.codelistRef;
        let keyValueToCheck = testData.keyValueSet;
        console.log("-------------------KEYVALUE---------------------")
        console.log(keyValueToCheck)
        console.log("-------------------CODELIST---------------------")
        console.log(codeListRef)
        if(Object.entries(testData).length !== 0 && Object.entries(codeListRef).length !== 0){
            
            // codeListTestData = {testId: "/"+resource+"/agency/id/version?detail="+template.detail,
            // index: test.index,apiVersion: test.apiVersion,resource: resource,reqTemplate: template,
            // identifiers: {structureType:codeListRef.getStructureType(),agency:codeListRef.getAgencyId(),id:codeListRef.getId(),version:codeListRef.getVersion()},
            // testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,subTests: []};
    
            // codelistTest = TestObjectBuilder.getTestObject(codelistTest,false);


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