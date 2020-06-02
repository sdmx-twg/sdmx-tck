
var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var Utils = require('sdmx-tck-api').utils.Utils;
var DataKeySetObject = require('sdmx-tck-api').model.DataKeySetObject
var CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject
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
                //Get the constraint obj from workspace
                let constraint = workspace.getSdmxObject(new StructureReference(test.identifiers.structureType,test.identifiers.agency,test.identifiers.id,test.identifiers.version))
                
                //Get info about the constrainable artefact that led to the dsd, which led us to the codelist that will
                // be checked along with a keyValue
                let constraintData = ContentConstraintReferencePartialChecker.getDataFromConstraint(workspace,constraint)
                if(!constraintData){
                     throw new Error ('Unable to find a DSD that references a dimension constrained by the content constraint')
                }

                let codeListRef = constraintData.codelistRef;
                let keyValueToCheckData = constraintData.keyValueData;
                let constrainable = constraintData.selectedConstrainable;
               
                //Get the reference partial test object.
                let referencePartialTest = ContentConstraintReferencePartialChecker.referencepartialTestBuilder(test,constrainable);
                /*Executes the request to get the partial codelist*/
                HelperManager.getWorkspace(referencePartialTest, test.apiVersion, preparedRequest.service.url).
                    then((referencePartialTestWorkspace) => {
                        /* The referencepartial test's workspace validation*/
                        let validation = ContentConstraintReferencePartialChecker.checkReferencePartialTestWorkspace(referencePartialTestWorkspace,keyValueToCheckData,codeListRef,constraint);
                        /*Due to the second req of the reference partial testing from content constraint we need to show the last URL in the GUI
                        (constrainable's request with reference partial)*/
                        validation.sourceOfWorkspace = referencePartialTest.httpResponse.url;
                        resolve(validation)
                    }).catch((error) => {
                        //inform the model that the referencepartial request failed
                        test.httpResponseValidation = referencePartialTest.httpResponseValidation
                        reject(new TckError(error.message))
                        
                    });
            } catch (err) {
                reject(new TckError(err.message));
            }
        });
    };
    
    /**
     * Function that returns the reference of the codelist that is under validation, the constrainable
     * with which the referencepartial test will be performed as well as the KeyValue, 
     * with the values of which the codes of the codelist will be validated.
     * @param {*} workspace the workspace of content constraint descendants
     * @param {*} constraint the constraint object
     */
    static getDataFromConstraint(workspace,constraint){
            if(!Utils.isDefined(workspace) || !(workspace instanceof SdmxStructureObjects)){
                throw new Error('Missing mandatory parameter "workspace"')
            }
            if(!Utils.isDefined(constraint)){
                throw new Error('Requested Content Constraint Artefact not found in workspace')
            }
            if(constraint.getType()!== "Allowed"){
                throw new Error('There is no Content Constraint of type "Allowed" to proceed with this test.')
            }
            //Get children and components from the constraint object
            let constrainableArtefacts = constraint.getChildren();
            if (!Utils.isDefined(constrainableArtefacts) || constrainableArtefacts.length === 0) {
                throw new Error("Missing constrainable artefacts");
            }

            //Search in each constrainable for a referenced dsd which restricts, via a codelist, a dimension which exists as a keyValue in the 
            //chosen constraint.
            for(let counter=0;counter<constrainableArtefacts.length;counter++){
                let constrainableArtefactRef = constrainableArtefacts[counter]
                let dsd = ContentConstraintReferencePartialChecker.getDsdFromConstrainable(workspace,constrainableArtefactRef)
                if(dsd){
                    let selectedkeyValueData = constraint.getMatchingKeyValueDataInDSD(dsd);
                    if(selectedkeyValueData){
                        return {codelistRef: dsd.getReferencedCodelistInComponent(selectedkeyValueData.getId()),
                                keyValueData: selectedkeyValueData,
                                selectedConstrainable: constrainableArtefactRef}
                    }
                }
            }   
            return null;
    }

    /**
     * Checks whether the partial codelist follows the constraints.If yes it returns true else it returns false.
     * @param {*} keyValueData object containing the keyValue with the constraint values 
     *                         and the source of the keyvalue (cuberegion or datakeyset).It also contains isWildCarded prop in case of DataKeySets.
     * @param {*} codesArray array with the codes of the partial codelist.
     * @param {*} constraintObj the constraint from which the the keyValue was found
     */
    static constraintValuesValidation(keyValue,codesArray,constraintObj){

        if(codesArray.length === 0){
            throw new Error('No codes to check')
        }
        if(Object.entries(keyValue).length === 0){
            throw new Error('No KeyValue Data')
        }
        if(keyValue.getOrigin() === DataKeySetObject.name){
            let values = constraintObj.getValuesFromKeyValuesWithSameId(keyValue)
            let keyValIsWildCarded = constraintObj.isKeyValueWildCarded(keyValue)
           
            let includedValues = [];
            let excludedValues = [];
            
            //split the values of a keyValue to inclusives and exclusives.
            values.forEach((valueObj) =>{
                if(valueObj.includeType === "true"){
                    includedValues.push(valueObj.value)
                }else if(valueObj.includeType === "false"){
                    excludedValues.push(valueObj.value)
                }
            });
            
            // if the keyValue is wildcarded or there more than one excluded values - all codes are accepted in the partial codelist 
            if(keyValIsWildCarded || excludedValues.length > 1){
                console.log("wildcarted")
                return true;
            }
            if(includedValues.length > 0){
                if(excludedValues.length === 0 || (excludedValues.length === 1 && includedValues.indexOf(excludedValues[0]) !== -1)){
                    console.log("no excluded - or 1 excluded")
                    return includedValues.every(val => codesArray.includes(val));
                }else{
                    console.log("included & 1 excluded")
                    return (includedValues.every(val => codesArray.includes(val)) 
                            && codesArray.indexOf(excludedValues[0]) === -1) 
                }
            }else{
                console.log("only 1 excluded")
                return (codesArray.indexOf(excludedValues[0]) === -1) 
            }
                
        }else if(keyValue.getOrigin()===CubeRegionObject.name){
            if(keyValue.includeType === 'true'){
                let includedValues = [];
                keyValue.values.forEach((value) => includedValues.push(value))
                return includedValues.every(val => codesArray.includes(val));
        
            }else if(keyValue.includeType === 'false'){
                for(let i=0;i<keyValue.values.length;i++){
                    if(codesArray.indexOf(keyValue.values[i]) !== -1){
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
     * @param {*} constraintObj the constraint from which the the keyValue was found
     */
    static checkReferencePartialTestWorkspace(workspace,keyValueData,codeListRef,constraintObj){
        
        if (!Utils.isDefined(workspace) || !(workspace instanceof SdmxStructureObjects)) {
            throw new Error("Missing workspace of constrainable referencepartial request");
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
        if(!ContentConstraintReferencePartialChecker.constraintValuesValidation(keyValueData,codesArray,constraintObj)){
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
     * Function that returns the dsd object that is linked with the chosen constrainable.Return null if dsd not found.
     * @param {*} sdmxObjects the workspace of content constraint descendants
     * @param {*} constrainableArtefactRef the reference of a constrainable.
     */
    static getDsdFromConstrainable(sdmxObjects,constrainableArtefactRef){
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxStructureObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        if (!Utils.isDefined(constrainableArtefactRef)) {
            throw new Error("Missing mandatory parameter 'constrainableArtefactRef'.");
        }

        if(constrainableArtefactRef.getStructureType() === SDMX_STRUCTURE_TYPE.DATAFLOW.key){
            let constrainableStruct = sdmxObjects.getSdmxObject(constrainableArtefactRef)
            //If the constrainable artefact exists in Content Constraint 'descendants' request's workspace
            if(constrainableStruct){
                let dsdRef = ContentConstraintReferencePartialChecker.getRefOfSpecificStructureType(sdmxObjects.getChildren(constrainableArtefactRef),SDMX_STRUCTURE_TYPE.DSD.key)
                if(Object.entries(dsdRef).length !== 0 && sdmxObjects.exists(dsdRef)){
                    let dsd = sdmxObjects.getSdmxObject(dsdRef)
                    if(dsd){
                        return dsd;
                    }
                    
                }
            }
        }else if(constrainableArtefactRef.getStructureType() === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key){
            let constrainableStruct = sdmxObjects.getSdmxObject(constrainableArtefactRef)
            //If the constrainable artefact exists in Content Constraint 'descendants' request's workspace
            if(constrainableStruct){
                let dataflowRef = ContentConstraintReferencePartialChecker.getRefOfSpecificStructureType(sdmxObjects.getChildren(constrainableArtefactRef),SDMX_STRUCTURE_TYPE.DATAFLOW.key)
                if(Object.entries(dataflowRef).length !== 0 && sdmxObjects.exists(dataflowRef)){
                    let dsdRef = ContentConstraintReferencePartialChecker.getRefOfSpecificStructureType(sdmxObjects.getChildren(dataflowRef),SDMX_STRUCTURE_TYPE.DSD.key)
                    if(Object.entries(dsdRef).length !== 0 && sdmxObjects.exists(dsdRef)){
                        let dsd = sdmxObjects.getSdmxObject(dsdRef)
                        if(dsd){
                            return dsd;
                        }
                    }   
                }
            }
        }else if(constrainableArtefactRef.getStructureType() === SDMX_STRUCTURE_TYPE.DSD.key){
            //If the constrainable artefact exists in Content Constraint 'descendants' request's workspace
            let constrainableStruct = sdmxObjects.getSdmxObject(constrainableArtefactRef)
            if(constrainableStruct){
                return constrainableStruct;
            }
        }
        return null;
    }
    /**
     * Builds the referencepartial test for the selected constrainable artefact.
     * Returns the test obj of the constrainable.
     * @param {*} test the test object of the above test.
     * @param {*} constrainable constrainable artefact reference
     */
    static referencepartialTestBuilder(test,constrainable){
        if (!Utils.isDefined(constrainable)) {
            throw new Error("Missing mandatory constrainable artefact.");
        }
        if(!Utils.isDefined(test)){
            throw new Error("Missing mandatory parameter: 'descendants' test .");
        }
        let resource;
        let template = {detail:"referencepartial"};
        let referencePartialTest = {};

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
        
        return referencePartialTest;
    }
};


module.exports = ContentConstraintReferencePartialChecker;