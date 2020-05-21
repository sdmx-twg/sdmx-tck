
var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var Utils = require('sdmx-tck-api').utils.Utils;
var CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject
var DataKeySetObject = require('sdmx-tck-api').model.DataKeySetObject
var SdmxObjects = require('sdmx-tck-api').model.SdmxObjects;
var SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var Utils = require('sdmx-tck-api').utils.Utils;
var TckError = require('sdmx-tck-api').errors.TckError;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
var HelperManager = require("../manager/HelperManager.js");
var STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;

/*Special class that handles the content constraint reference partial testing. Due to its complexity the referencepartial testing 
consists of two subparts. The first is a content constraint with reference = descendants request. 
From that request a specific codelist is retrieved. The second subpart is the request using the
constrainable (DSD/DF/PRA) that led us to the codelist, with detail=referencepartial and references = children/descendants
depending on the constraint. The codelist retrieved above must be found and validated in the second request's workspace.*/


class ContentConstraintReferencePartialChecker {
     
    /**
     * Returns the result of the referece partial test which is ether a success code in case of success 
     * or a failure code in case of an error or failure.
     * @param {*} test the test object of the above test.
     * @param {*} preparedRequest the http query parameters
     * @param {*} workspace the workspace of content constraint descendants
     */
    static checkWorkspace(test, preparedRequest, workspace) {
        return new Promise((resolve, reject) => {
            try {
                /*Returns an object containing:
                    a) The codelist under validation 
                    b) The KeyValue with which the partial codelist will be validated.
                    c) The referencepartial test object
                    */
                
                let finalTestData = ContentConstraintReferencePartialChecker.referencepartialTestBuilder(test,workspace);
                /*Executes the request to get the partial codelist*/
                HelperManager.getWorkspace(finalTestData.referencePartialTest, test.apiVersion, preparedRequest.service.url).
                    then((referencePartialTestWorkspace) => {
                        /* The referencepartial test's workspace validation*/
                        let validation = ContentConstraintReferencePartialChecker.checkReferencePartialTestWorkspace(referencePartialTestWorkspace,finalTestData.keyValueToCheckData,finalTestData.codeListRef);
                        /*Due to the second req of the reference partial testing from content constraint we need to show the last URL in the GUI
                        (constrainable's request with reference partial)*/
                        validation.sourceOfWorkspace = finalTestData.referencePartialTest.httpResponse.url;
                        resolve(validation)
                    }).catch((error) => {
                        //inform the model that the referencepartial request failed
                        test.httpResponseValidation = finalTestData.referencePartialTest.httpResponseValidation
                        reject(new TckError(error.message))
                        
                    });
            } catch (err) {
                reject(new TckError(err.message));
            }
        });
    };
    
    /**
     * Checks whether the partial codelist follows the constraints.If yes it returns true else it returns false.
     * @param {*} keyValueData object containing the keyValue with the constraint values 
     *                         and the source of the keyvalue (cuberegion or datakeyset).It also contains isWildCarded prop in case of DataKeySets.
     * @param {*} codesArray array with the codes of the partial codelist.
     */
    static constraintValuesValidation(keyValueData,codesArray){

        if(codesArray.length === 0){
            throw new Error('No codes to check')
        }
        if(Object.entries(keyValueData).length === 0){
            throw new Error('No KeyValue Data')
        }
        let keyValue = keyValueData.keyValue;
        if(!keyValue.values || !Array.isArray(keyValue.values)){
            throw new Error('KeyValue does not contain specific values or these values are malformed')
        }
        if(keyValueData.source && keyValueData.source === DataKeySetObject.name){
            let includedValues = [];
            let excludedValues = [];

            //split the values of a keyValue to inclusives and exclusives.
            for(let i=0;i<keyValue.values.length;i++){
                if(keyValue.values[i].includeType === "true"){
                    includedValues.push(keyValue.values[i].value)
                }else if(keyValue.values[i].includeType === "false"){
                    excludedValues.push(keyValue.values[i].value)
                }
            }
            // if the keyValue is wildcarded or there more than one excluded values - all codes are accepted in the partial codelist 
            if(keyValueData.isWildCarded || excludedValues.length > 1){
                return true;
            }
            if(includedValues.length > 0){
                if(excludedValues.length === 0 || (excludedValues.length === 1 && includedValues.indexOf(excludedValues[0]) !== -1)){
                    return includedValues.every(val => codesArray.includes(val));
                }else{
                    return (includedValues.every(val => codesArray.includes(val)) 
                            && codesArray.indexOf(excludedValues[0]) === -1) 
                }
            }else{
                return (codesArray.indexOf(excludedValues[0]) === -1) 
            }
                
        }else{
            if(keyValue.includeType === 'true'){
                let includedValues = [];
                for(let i=0;i<keyValue.values.length;i++){
                    includedValues.push(keyValue.values[i].value)
                }
                return includedValues.every(val => codesArray.includes(val));
        
            }else if(keyValue.includeType === 'false'){
                for(let i=0;i<keyValue.values.length;i++){
                    if(codesArray.indexOf(keyValue.values[i].value) !== -1){
                        return false;
                    }
                }
                return true;
            } 
        } 
    }
    /**
     * Returns the result of the workspace validation of a partial codelist. In case of success it returns a success code,
     * else in the case of failure it returns a failure code along with the failure reason.
     * @param {*} workspace workspace of constrainable referencepartial request.
     * @param {*} keyValueData object containing the keyValue with the constraint values that will be checked along with 
     * the partial codelist's codes,as well as the source of KeyValue (cuberegion or datakeyset) and the isWildCarded prop in 
     * the case of datakeysets.
     * @param {*} codeListRef the codelist reference which will be validated.
     */
    static checkReferencePartialTestWorkspace(workspace,keyValueData,codeListRef){
        
        if (!Utils.isDefined(workspace) || !(workspace instanceof SdmxStructureObjects)) {
            throw new Error("Missing codelist request's workspace");
        }
        let codesArray =[];
        let codelistObj= workspace.getSdmxObject(codeListRef)
        
        if (!codelistObj || !codelistObj instanceof ItemSchemeObject){
            throw new Error("The codelist under validation "+codeListRef+" is missing from workspace");
        }

        for(let i=0;i<codelistObj.getItems().length;i++){
            codesArray.push(codelistObj.getItems()[i].id);
        }
        
        //If the codelist returned is not partial throw Error.
        if(codelistObj.getIsPartial() !== "true"){
           return { status: FAILURE_CODE, error: "Codelist is not partial."};
        }
        //If the codes of the partial codelist do not follow the constraint
        if(!ContentConstraintReferencePartialChecker.constraintValuesValidation(keyValueData,codesArray)){
            return { status: FAILURE_CODE, error: "Codelist is incompatible with the given code values constraints."};
        }
       
        return { status: SUCCESS_CODE }
    }
     /**
     * Get the reference of a specific structureType from the childrenRefs of a structure 
     * @param {*} childrenRefs children references of a structure.
     * @param {*} structureType the structureType needed.
     */
    static getRefOfSpecificStructureType(childrenRefs,structureType){
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
     * Function that returns the reference of the codelist that is under validation, the constrainable
     * with which the referencepartial test will be performed as well as the KeyValue, 
     * with the values of which the codes of the codelist will be validated.
     * @param {*} sdmxObjects the workspace of content constraint descendants
     * @param {*} constraint the constraint object of the above workspace.
     */
    static findConstrainableAndCodeListAndKeyValue(sdmxObjects,constraint){
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxStructureObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //Get children and components from the constraint object
        let constrainableArtefacts = constraint.getChildren();
        if (!Utils.isDefined(constrainableArtefacts) || constrainableArtefacts.length === 0) {
            throw new Error("Missing constrainable artefacts");
        }
        
        for(let counter=0;counter<constrainableArtefacts.length;counter++){
            if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key){
                let structureList = sdmxObjects.getSdmxObjectsWithCriteria(constrainableArtefacts[counter].structureType,constrainableArtefacts[counter].agency,constrainableArtefacts[counter].id,constrainableArtefacts[counter].version)

                //If the constrainable artefact exists in Content Constraint 'descendants' request's workspace
                if(structureList.length !== 0){
                    let structureRef = new StructureReference(constrainableArtefacts[counter].structureType, structureList[0].agencyId, structureList[0].id, structureList[0].version);
                    
                    let dsdRef = ContentConstraintReferencePartialChecker.getRefOfSpecificStructureType(sdmxObjects.getChildren(structureRef),SDMX_STRUCTURE_TYPE.DSD.key)
                    if(Object.entries(dsdRef).length !== 0 && sdmxObjects.exists(dsdRef)){
                        let dsd = sdmxObjects.getSdmxObject(dsdRef)
                        if(dsd){
                            let selectedkeyValueData = constraint.getMatchingKeyValueDataInDSD(dsd);
                            if(Object.entries(selectedkeyValueData).length !== 0){
                                return {codelistRef:dsd.getReferencedCodelistInComponent(selectedkeyValueData.keyValue.id),
                                    keyValueData:selectedkeyValueData,
                                    selectedConstrainable:structureRef}
                            }
                        }
                        
                    }
                }
            }else if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key){
                let structureList = sdmxObjects.getSdmxObjectsWithCriteria(constrainableArtefacts[counter].structureType,constrainableArtefacts[counter].agency,constrainableArtefacts[counter].id,constrainableArtefacts[counter].version)
                
                //If the constrainable artefact exists in Content Constraint 'descendants' request's workspace
                if(structureList.length !== 0){
                    let structureRef = new StructureReference(constrainableArtefacts[counter].structureType, structureList[0].agencyId, structureList[0].id, structureList[0].version);
                    let dataflowRef = ContentConstraintReferencePartialChecker.getRefOfSpecificStructureType(sdmxObjects.getChildren(structureRef),SDMX_STRUCTURE_TYPE.DATAFLOW.key)
                    if(Object.entries(dataflowRef).length !== 0 && sdmxObjects.exists(dataflowRef)){
                        let dsdRef = ContentConstraintReferencePartialChecker.getRefOfSpecificStructureType(sdmxObjects.getChildren(dataflowRef),SDMX_STRUCTURE_TYPE.DSD.key)
                        if(Object.entries(dsdRef).length !== 0 && sdmxObjects.exists(dsdRef)){
                            
                            let dsd = sdmxObjects.getSdmxObject(dsdRef)
                            if(dsd){
                                let selectedkeyValueData = constraint.getMatchingKeyValueDataInDSD(dsd);
                                if(Object.entries(selectedkeyValueData).length !== 0){
                                    return {codelistRef:dsd.getReferencedCodelistInComponent(selectedkeyValueData.keyValue.id),
                                        keyValueData:selectedkeyValueData,
                                        selectedConstrainable:structureRef}
                                }
                            }
                        }   
                    }
                }
            }else if(constrainableArtefacts[counter].structureType === SDMX_STRUCTURE_TYPE.DSD.key){
                let structureList = sdmxObjects.getSdmxObjectsWithCriteria(constrainableArtefacts[counter].structureType,constrainableArtefacts[counter].agency,constrainableArtefacts[counter].id,constrainableArtefacts[counter].version)
                //If the constrainable artefact exists in Content Constraint 'descendants' request's workspace
                if(structureList.length !== 0){
                    let structureRef = new StructureReference(constrainableArtefacts[counter].structureType, structureList[0].agencyId, structureList[0].id, structureList[0].version);
                    let dsd = structureList[0];
                    let selectedkeyValueData = constraint.getMatchingKeyValueDataInDSD(dsd);
                    if(Object.entries(selectedkeyValueData).length !== 0){
                        return {codelistRef:dsd.getReferencedCodelistInComponent(selectedkeyValueData.keyValue.id),
                            keyValueData:selectedkeyValueData,
                            selectedConstrainable:structureRef}
                    }
                }
            }
        }
        return {};
        
    }
    /**
     * Builds the referencepartial test for the selected constrainable artefact.
     * Returns the test obj of the constrainable,the codelist reference under validation as well as the constraint values
     * that will be checked in the codelist found in the constrainable's workspace.
     * @param {*} test the test object of the above test.
     * @param {*} sdmxObjects the workspace of content constraint descendants
     */
    static referencepartialTestBuilder(test,sdmxObjects){
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxStructureObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        if(!Utils.isDefined(test)){
            throw new Error("Missing mandatory parameter: 'descendants' test .");
        }
        let resource;

        let template = {detail:"referencepartial"};
        let referencePartialTest = {};

        //Get the constraint obj from workspace
        let constraint = sdmxObjects.getSdmxObject(new StructureReference(test.identifiers.structureType,test.identifiers.agency,test.identifiers.id,test.identifiers.version))
        if(!Utils.isDefined(constraint)){
            throw new Error('Requested Content Constraint Artefact not found in workspace')
        }
        if(constraint.getType()!== "Allowed"){
            throw new Error('There is no Content Constraint of type "Allowed" to proceed with this test.')
        }
        //According to the constrainable artefact selected the function will return a codelist ref, a keyvalue and a constrainable
        //to use for the reference partial testing.
        let testData = ContentConstraintReferencePartialChecker.findConstrainableAndCodeListAndKeyValue(sdmxObjects,constraint)
        
        if(Object.entries(testData).length === 0) {
            throw new Error ('Unable to locate a codelist (concerning any KeyValue) through the constrainable artefacts of the constraint')
        }
        let codeListRef = testData.codelistRef;
        let keyValueToCheckData = testData.keyValueData;
        let constrainable = testData.selectedConstrainable;

        if(Object.entries(testData).length !== 0 && Utils.isDefined(constrainable)){

            if(constrainable.structureType === SDMX_STRUCTURE_TYPE.DSD.key){
                resource = SDMX_STRUCTURE_TYPE.DSD.getClass().toLowerCase();
                template.references = STRUCTURE_REFERENCE_DETAIL.CHILDREN;
            }else if(constrainable.structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key){
                resource = SDMX_STRUCTURE_TYPE.DATAFLOW.getClass().toLowerCase();
                template.references = STRUCTURE_REFERENCE_DETAIL.DESCENDANTS;
            }else{
                resource = SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.getClass().toLowerCase();;
                template.references = STRUCTURE_REFERENCE_DETAIL.DESCENDANTS;
            }

            let referencePartialTestParams = {
                testId: "/"+resource+"/agency/id/version?detail="+template.detail+"&references="+template.references,
                index: test.index,
                apiVersion: test.apiVersion,
                resource: resource,
                reqTemplate: template,
                identifiers: {structureType:constrainable.getStructureType(),agency:constrainable.getAgencyId(),id:constrainable.getId(),version:constrainable.getVersion()},
                testType: TEST_TYPE.STRUCTURE_DETAIL_PARAMETER,
                subTests: []
            }
            referencePartialTest = TestObjectBuilder.getTestObject(referencePartialTestParams);
        }
        
        return {referencePartialTest:referencePartialTest,keyValueToCheckData:keyValueToCheckData,codeListRef:codeListRef};

    }
};


module.exports = ContentConstraintReferencePartialChecker;