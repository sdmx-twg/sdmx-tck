const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const SCHEMA_FACETS = require('sdmx-tck-api').constants.SCHEMA_FACETS;
const XSD_DATA_TYPE  = require('sdmx-tck-api').constants.XSD_DATA_TYPE;
var Utils = require('sdmx-tck-api').utils.Utils;
var SdmxSchemaObjects = require('sdmx-tck-api').model.SdmxSchemaObjects;
var SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var ContentConstraintObject = require('sdmx-tck-api').model.ContentConstraintObject;
var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var ContentConstraintReferencePartialChecker = require('./ContentConstraintReferencePartialChecker.js')
var ConstraintKeyValueObject =require('sdmx-tck-api').model.ConstraintKeyValueObject
var CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject
var DataKeySetObject = require('sdmx-tck-api').model.DataKeySetObject;

class SchemasSemanticChecker {

    static checkWorkspace(test, preparedRequest, workspace) { 
        return new Promise((resolve, reject) => {
            var query = preparedRequest.request;
            try {
                let validation = {};
                if (test.testType === TEST_TYPE.SCHEMA_IDENTIFICATION_PARAMETERS) {
                    validation = SchemasSemanticChecker.checkIdentification(test,query, workspace)
                }
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }

    static async checkIdentification (test,query,sdmxObjects){
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //1. Check SimpleTypes
        let simpleTypeValidation = await SchemasSemanticChecker.checkXSDSimpleTypes(test,query,sdmxObjects)
        return simpleTypeValidation

        //2. Check ComplexTypes
    }
    static async checkXSDSimpleTypes(test,query,sdmxObjects){
        //1. Check SimpleTypes without enums
         let simpleTypeWithoutEnumValidation = await SchemasSemanticChecker.checkXSDSimpleTypesWithoutEnums(test,query,sdmxObjects)
         if(simpleTypeWithoutEnumValidation.status === FAILURE_CODE){return simpleTypeWithoutEnumValidation;}
         
         //REMOVE IT 
         //return simpleTypeWithoutEnumValidation
        //2. Check SimpleTypes with enums
        return await SchemasSemanticChecker.checkXSDSimpleTypesWithEnums(test,query,sdmxObjects)
    }

    static async checkXSDSimpleTypesWithoutEnums(test,query,sdmxObjects){
        try{
            if (!Utils.isDefined(query)) {
                throw new Error("Missing mandatory parameter 'query'.");
            }
            if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
                throw new Error("Missing mandatory parameter 'sdmxObjects'.");
            }
            if (!Utils.isDefined(test) || !(test.structureWorkspace instanceof SdmxStructureObjects)) {
                throw new Error("Missing mandatory parameter 'test'.");
            }
    
            let structureType = SDMX_STRUCTURE_TYPE.fromRestResource(query.context)
            let agency = query.agency
            let id = query.id
            //TODO: Change the solution because,getSdmxObjectsWithCriteria does not guarantee a single artefact to be returned when the version is not defined.
            
    
            // WORKAROUND - Until a better solution is found.
            // Because the version is extracted from the request it can contain values such as 'latest', 'all'. 
            // In case of 'latest' we check if the workspace contains exactly one structure 
            // but the problem here is that the version of the returned structure is not known beforehand 
            // and the workspace cannot be filtered using the 'latest' for the structure version.
    
            let version = (query.version!=='latest')?query.version : null;
    
            let structure = test.structureWorkspace.getSdmxObjectsWithCriteria(structureType,agency,id,version)
            let structureRef = structure[0].asReference();
            let artefact;
    
            //TODO: Check the MSD, MDF cases!!!
            if(query.context === (SDMX_STRUCTURE_TYPE.DSD.getClass().toLowerCase() || SDMX_STRUCTURE_TYPE.MSD.getClass().toLowerCase())){
                artefact = test.structureWorkspace.getSdmxObject(structureRef)
            }else if(query.context === (SDMX_STRUCTURE_TYPE.DATAFLOW.getClass().toLowerCase() || SDMX_STRUCTURE_TYPE.METADATA_FLOW.getClass().toLowerCase())){
                let childRef = test.structureWorkspace.getChildren(structureRef)[0]
                artefact = test.structureWorkspace.getSdmxObject(childRef)
            }else if(query.context === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.getClass().toLowerCase()){
                let childRef = test.structureWorkspace.getChildren(structureRef)[0]
                let descendantRef = test.structureWorkspace.getChildren(childRef)[0]
                artefact = test.structureWorkspace.getSdmxObject(descendantRef)
            }
            //console.log(artefact)
            let simpleTypesWithFacets = sdmxObjects.getSimpleTypesWithFacets().concat(sdmxObjects.getSimpleTypesWithDataTypeRestrictionOnly());
    
            let dsdComponentsWithTextFormatRestriction = artefact.getComponents().filter(comp=> (comp.getRepresentation()) && comp.getRepresentation().getType() === "TEXT_FORMAT")
            
            //The number of dsd components must be equal to the number of simple types describing them.
            //This validation handles the case where there are more simpe types than dsd components with data type restriction.
            if(simpleTypesWithFacets.length > dsdComponentsWithTextFormatRestriction.length){
                return { status: FAILURE_CODE, error: "There are more simple types in the XSD than DSD components"};
            }
           
            let errors = [];
            /*This check validates each dsd component against the matching simpleType.
            It fails when :
            a) There are more dsd components than simpleTypes (dsd component is not described by a simple Type)
            b) When the simple Type description of component is incorrect*/
            dsdComponentsWithTextFormatRestriction.forEach(function(component){
                    console.log(component.getId())
                    let validSimpleType = simpleTypesWithFacets.filter(function(simpleType){
                    let expression = true;
                    expression = expression && (simpleType.getName() === component.getId())
                    expression = expression && (simpleType.getRestrictionBase() === XSD_DATA_TYPE.getMapping(component.getRepresentation().getTextType()))
    
                    if(component.getRepresentation().getMinLength()){
                        expression = expression && (simpleType.getSchemaFacets().filter(facet => 
                            facet.getType() === SCHEMA_FACETS.MIN_LENGTH.value 
                            && component.getRepresentation().getMinLength() === facet.getValue()).length === 1)
                    }
                    if(component.getRepresentation().getMaxLength()){
                        expression = expression && (simpleType.getSchemaFacets().filter(facet => 
                            facet.getType() === SCHEMA_FACETS.MAX_LENGTH.value 
                            && component.getRepresentation().getMaxLength() === facet.getValue()).length === 1)
                    }
                    if(component.getRepresentation().getMinValue()){
                        expression = expression && (simpleType.getSchemaFacets().filter(facet => 
                            (facet.getType() === SCHEMA_FACETS.MIN_EXCLUSIVES.value || facet.getType() === SCHEMA_FACETS.MIN_INCLUSIVE.value)
                            && component.getRepresentation().getMinValue() === facet.getValue()).length === 1)
                    }
                    if(component.getRepresentation().getMaxValue()){
                        expression = expression && (simpleType.getSchemaFacets().filter(facet => 
                            (facet.getType() === SCHEMA_FACETS.MAX_EXCLUSIVES.value || facet.getType() === SCHEMA_FACETS.MAX_INCLUSIVE.value )
                            && component.getRepresentation().getMaxValue() === facet.getValue()).length === 1)
                    }
                    if(component.getRepresentation().getDecimals()){
                        expression = expression && (simpleType.getSchemaFacets().filter(facet => 
                            facet.getType() === SCHEMA_FACETS.FRACTION_DIGITS.value
                            && component.getRepresentation().getDecimals() === facet.getValue()).length === 1)
                    }
                    if(component.getRepresentation().getPattern()){
                        expression = expression && (simpleType.getSchemaFacets().filter(facet => 
                            facet.getType() === SCHEMA_FACETS.PATTERN.value
                            && component.getRepresentation().getPattern() === facet.getValue()).length === 1)
                    }
                    return expression === true
                    })
    
                    if(validSimpleType.length !==1){
                    errors.push({type:component.getType(),id:component.getId()})
                    }
            })
            if(errors.length>0){
                return { status: FAILURE_CODE, error: "These components were not refered or were not refered correctly in the XSD " + JSON.stringify(errors) };
            }
            return { status: SUCCESS_CODE };
            
        }catch(ex){
            console.log(ex)
        }
        
    }

    static async checkXSDSimpleTypesWithEnums(test,query,sdmxObjects){
        
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        if (!Utils.isDefined(test)) {
            throw new Error("Missing mandatory parameter 'test'.");
        }
        if (!Utils.isDefined(test.constraintParent)) {
            throw new Error("Unable to validate enumerations in XSD due to missing constraint data ");
        }

        let errors = []
        let dataKeySetsKeyValuesCheckedIds = []
        let constraintObj = ContentConstraintObject.fromJSON(test.constraintParent);
        //TODO: Make constraint Object ContentConstraintObject
        let constraintComponent = (constraintObj.getCubeRegions().length > 0) ? constraintObj.getCubeRegions():constraintObj.getDataKeySets()
        constraintComponent.forEach(constraintComponent => {
            if(constraintComponent instanceof CubeRegionObject){

                constraintComponent.getKeyValues().forEach(keyValue =>{
                    let result = this.validateKeyValueAgainstSimpleTypeEnum(sdmxObjects,keyValue,constraintObj)
                    if(!result){
                        errors.push({name:chosenSimpleType.getName()})
                    }
                })

            }else if(constraintComponent instanceof DataKeySetObject){

                constraintComponent.getKeys().forEach(key =>{
                    key.forEach(keyValue => {
                        
                        /*DataKeySets are built in a way that keyValues with same ids are located mulitple times in multiple keySets.
                        The validation happens for all keyValues with the same id. The array above stores the ids that have already been checked
                        in order not to be again checked durin the dataKeySets iteration*/
                        if(dataKeySetsKeyValuesCheckedIds.indexOf(keyValue.getId()) === -1){
                            dataKeySetsKeyValuesCheckedIds.push(keyValue.getId())

                            let result = this.validateKeyValueAgainstSimpleTypeEnum(sdmxObjects,keyValue,constraintObj)
                            if(!result){
                                errors.push({name:chosenSimpleType.getName()})
                            }
                        }
                    })
                })
            }
        })
        if(errors.length>0){
            return { status: FAILURE_CODE, error: "These enumerated simple types do not follow the restrictions by their constraint " + JSON.stringify(errors) };
        }
        return { status: SUCCESS_CODE };
    }
    static validateKeyValueAgainstSimpleTypeEnum(sdmxObjects,keyValue,constraintObj){
        console.log(keyValue.getId())
        if(!keyValue || !keyValue instanceof ConstraintKeyValueObject){
            throw new Error("Missing mandatory parameter 'componentId' ")
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //Get simple type that describes the restriction in values of a certain component
        let chosenSimpleType = sdmxObjects.getEnumeratedSimpleTypeOfComponent(keyValue.getId())
        if(!chosenSimpleType){
            throw new Error("Unable to find simpleType for the following component in workspace: "+keyValue.getId())
        }
        let enums = chosenSimpleType.getEnumerations();
        return ContentConstraintReferencePartialChecker.constraintValuesValidation(keyValue,enums,constraintObj)

    }
}
module.exports = SchemasSemanticChecker;