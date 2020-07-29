const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const SCHEMA_FACETS = require('sdmx-tck-api').constants.SCHEMA_FACETS;
const XSD_DATA_TYPE  = require('sdmx-tck-api').constants.XSD_DATA_TYPE;
const DSD_COMPONENTS_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_NAMES;
const COMPONENTS_REPRESENTATION_NAMES = require('sdmx-tck-api').constants.COMPONENTS_REPRESENTATION_NAMES;
const DIMENSION_AT_OBSERVATION_CONSTANTS=require('sdmx-tck-api').constants.DIMENSION_AT_OBSERVATION_CONSTANTS;
const ATTRIBUTE_RELATIONSHIP_NAMES=require('sdmx-tck-api').constants.ATTRIBUTE_RELATIONSHIP_NAMES;
const RELATIONSHIP_REF_ID = require('sdmx-tck-api').constants.RELATIONSHIP_REF_ID;
const ATTRIBUTE_NAMES=require('sdmx-tck-api').constants.ATTRIBUTE_NAMES;
const SCHEMA_ATTRIBUTE_USAGE_VALUES =require('sdmx-tck-api').constants.SCHEMA_ATTRIBUTE_USAGE_VALUES;
const SCHEMA_ATTRIBUTE_NAMES = require('sdmx-tck-api').constants.SCHEMA_ATTRIBUTE_NAMES;
const SCHEMA_ATTRIBUTE_TYPES = require('sdmx-tck-api').constants.SCHEMA_ATTRIBUTE_TYPES;
const SCHEMA_ANYATTRIBUTE_NAMESPACES = require('sdmx-tck-api').constants.SCHEMA_ANYATTRIBUTE_NAMESPACES;
const COMPLEX_TYPES_NAMES = require('sdmx-tck-api').constants.COMPLEX_TYPES_NAMES;
const COMPLEX_TYPES_COMPOSITORS_NAMES = require('sdmx-tck-api').constants.COMPLEX_TYPES_COMPOSITORS_NAMES;
const COMPLEX_TYPES_RESTRICTION_BASE = require('sdmx-tck-api').constants.COMPLEX_TYPES_RESTRICTION_BASE;
const SCHEMA_ELEMENT_NAMES = require('sdmx-tck-api').constants.SCHEMA_ELEMENT_NAMES;
const SCHEMA_ELEMENT_REF = require('sdmx-tck-api').constants.SCHEMA_ELEMENT_REF;
const SCHEMA_ELEMENT_TYPES = require('sdmx-tck-api').constants.SCHEMA_ELEMENT_TYPES;
const OCCURENCIES_VALUES = require('sdmx-tck-api').constants.OCCURENCIES_VALUES;
const SCHEMA_ELEMENT_FORMS = require('sdmx-tck-api').constants.SCHEMA_ELEMENT_FORMS;
const SCHEMA_SIMPLE_TYPE_NAMES = require('sdmx-tck-api').constants.SCHEMA_SIMPLE_TYPE_NAMES;
const SCHEMA_SIMPLE_TYPE_RESTRICTION_BASE = require('sdmx-tck-api').constants.SCHEMA_SIMPLE_TYPE_RESTRICTION_BASE;
var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var Utils = require('sdmx-tck-api').utils.Utils;
var TckError = require('sdmx-tck-api').errors.TckError;
var SdmxSchemaObjects = require('sdmx-tck-api').model.SdmxSchemaObjects;
var SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var ContentConstraintObject = require('sdmx-tck-api').model.ContentConstraintObject;
var ContentConstraintReferencePartialChecker = require('./ContentConstraintReferencePartialChecker.js')
var ConstraintKeyValueObject =require('sdmx-tck-api').model.ConstraintKeyValueObject
var CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject
var DataKeySetObject = require('sdmx-tck-api').model.DataKeySetObject;
var XSDReferenceElement = require('sdmx-tck-api').model.XSDReferenceElement
var XSDLocalElement = require('sdmx-tck-api').model.XSDLocalElement
var DataStructureAttributeObject = require('sdmx-tck-api').model.DataStructureAttributeObject;
var DataStructureObject  = require('sdmx-tck-api').model.DataStructureObject
class SchemasSemanticChecker {

    static checkWorkspace(test, preparedRequest, workspace) { 
        return new Promise((resolve, reject) => {
            var query = preparedRequest.request;
            try {
                let validation = {};
                validation = SchemasSemanticChecker.checkXSDComponents(test,query, workspace)
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }

    static checkXSDComponents (test,query,sdmxObjects){
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(test)) {
            throw new Error("Missing mandatory parameter 'test'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //GET THE DSD OBJECT
        let structureType = SDMX_STRUCTURE_TYPE.fromRestResource(query.context)
        let agency = query.agency
        let id = query.id
        //TODO: Change the solution because,getSdmxObjectsWithCriteria does not guarantee a single dsdObject to be returned when the version is not defined.
        // WORKAROUND - Until a better solution is found.
        // Because the version is extracted from the request it can contain values such as 'latest', 'all'. 
        // In case of 'latest' we check if the workspace contains exactly one structure 
        // but the problem here is that the version of the returned structure is not known beforehand 
        // and the workspace cannot be filtered using the 'latest' for the structure version.
        let version = (query.version!=='latest')?query.version : null;

        let dsdObject = test.structureWorkspace.getDSDObjectForXSDTests(structureType,agency,id,version)

        //CALCULATE DIMENSION AT OBSERVATION
        let dimensionAtObservation = (query.obsDimension)? query.obsDimension : DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD;
        if(query.explicit){
            let measureDimension = dsdObject.getComponents().find(component => component.getType() === DSD_COMPONENTS_NAMES.MEASURE_DIMENSION);
            if(measureDimension){
                dimensionAtObservation = measureDimension.getId()
            }
        }
       
        //CHECK XSD SPECIFIC RULES
        //1. Check SimpleTypes
        let simpleTypeValidation = SchemasSemanticChecker.checkXSDSimpleTypes(test,query,dsdObject,sdmxObjects)
        if(simpleTypeValidation.status === FAILURE_CODE){return simpleTypeValidation;}

        //2. Check ComplexTypes
        let complexTypeValidation = SchemasSemanticChecker.checkXSDComplexTypes(test,dsdObject,query,sdmxObjects,dimensionAtObservation)
        if(complexTypeValidation.status === FAILURE_CODE){return complexTypeValidation;}
        
        // //CHECK DEFAULT DIMENSION AT OBSERVATION RULES
        let defaultRulesValidation = SchemasSemanticChecker.checkDefaultRules(dsdObject,sdmxObjects,dimensionAtObservation)
        return defaultRulesValidation
    }

    static checkDefaultRules(dsdObject,sdmxObjects,dimensionAtObservation){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(dimensionAtObservation)) {
            throw new Error("Missing mandatory parameter 'dimensionAtObservation'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //DEFAULT RULES CHECK FOR DIMENSIONS
        let timeDimension = dsdObject.getComponents().find(component => component.getType() === DSD_COMPONENTS_NAMES.TIME_DIMENSION);
        let measureDimension = dsdObject.getComponents().find(component => component.getType() === DSD_COMPONENTS_NAMES.MEASURE_DIMENSION);
    
        //GET THE CORRECT COMPLEX TYPE
        let complexType = sdmxObjects.getXSDComplexTypeByName(COMPLEX_TYPES_NAMES.OBS_TYPE);
        if(!complexType){throw new Error("Missing complexType "+COMPLEX_TYPES_NAMES.OBS_TYPE+"."); }

        if(timeDimension){
            if(!complexType.hasAttribute(SCHEMA_ATTRIBUTE_NAMES.TIME_PERIOD)){
                return { status: FAILURE_CODE, error: "Error in default rules validation: TIME_PERIOD is defined in dsd but it is not in ObsType complex type"}
            }
        }else if(!timeDimension && measureDimension){
            if(!complexType.hasAttribute(measureDimension.getId())){
                return { status: FAILURE_CODE, error: "Error in default rules validation: Measure Dimension is defined in dsd but it is not in ObsType complex type"}
            }
        }else{
            let dimensions = dsdObject.getComponents().filter(component => component.getType() === DSD_COMPONENTS_NAMES.DIMENSION)
            for(let i in dimensions){
                if(!complexType.hasAttribute(dimensions[i].getId())){
                    return { status: FAILURE_CODE, error: "Error in default rules validation: Dimension "+dimensions[i].getId()+" is not in ObsType complex type"}
                }
            }
            
        }

        //FLAT (ALLDIMENSIONS) CHECK
        if(dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.ALLDIMENSIONS){
            let dimensions = dsdObject.getComponents().filter(component => component.getType() === DSD_COMPONENTS_NAMES.DIMENSION)
            for(let i in dimensions){
                if(!complexType.hasAttribute(dimensions[i].getId())){
                    return { status: FAILURE_CODE, error: "Error in default rules validation: Dimension "+dimensions[i].getId()+" is not in ObsType complex type"}
                }
            }
        }
       

        //CHECK DEFAULT RULES FOR ATTRIBUTES WITH SINGLE RELATIONSHIP DIMENSION
        let attributes = dsdObject.getComponents().filter(component => component instanceof DataStructureAttributeObject)
        let attributesDeclaringSingleDimensionRelationship = attributes.filter(function(attribute){
            let attrRelationships = attribute.getAttributeRelationship()
            let expression1 = attrRelationships.length === 1;
            let expression2 = attrRelationships.filter(relationship=>relationship.getRelationshipType()===ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION).length === 1
            return expression1 && expression2
        })
        for(let i in attributesDeclaringSingleDimensionRelationship){
            let dimensionId = attributesDeclaringSingleDimensionRelationship[i].getAttributeRelationship()[0].getId()
            let complexTypeContainingDimension = sdmxObjects.getComplexTypeThatContainsAttribute(dimensionId)
            if(!complexTypeContainingDimension || !complexTypeContainingDimension.hasAttribute(attributesDeclaringSingleDimensionRelationship[i].getId())){
                return { status: FAILURE_CODE, error: "Error in default rules validation: Attribute: "+attributesDeclaringSingleDimensionRelationship[i].getId()+" does not follow dimension: "+dimensionId+"."};
            }
        }

        //CHECK DEFAULT RULES FOR ATTRIBUTES WITH MULTIPLE DIMENSIONS RELATIONSHIP
        let complexTypesContainingDimensions = []
        let attributesDeclaringMultipleDimensionsRelationship = attributes.filter(function(attribute){
            let attrRelationships = attribute.getAttributeRelationship()
            let expression1= attrRelationships.filter(relationship=>relationship.getRelationshipType()!==ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION).length === 0
            let expression2= attrRelationships.filter(relationship=>relationship.getRelationshipType()===ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION).length > 1
            
            return expression1 && expression2
        })

        for(let i in attributesDeclaringMultipleDimensionsRelationship){
            complexTypesContainingDimensions=[]
            for(let j in attributesDeclaringMultipleDimensionsRelationship[i].getAttributeRelationship()){
                let dimensionId = attributesDeclaringMultipleDimensionsRelationship[i].getAttributeRelationship()[j].getId()
                let complexTypeContainingAttribute = sdmxObjects.getComplexTypeThatContainsAttribute(dimensionId);
                if(complexTypeContainingAttribute && !complexTypesContainingDimensions.find(complexType => complexType.getName() === complexTypeContainingAttribute.getName())){
                    complexTypesContainingDimensions.push(complexTypeContainingAttribute)
                }
                
            }

            if(complexTypesContainingDimensions.some(complexType => complexType.getName()===COMPLEX_TYPES_NAMES.OBS_TYPE)){
                let obsTypeComplexType = complexTypesContainingDimensions.find(complexType => complexType.getName()===COMPLEX_TYPES_NAMES.OBS_TYPE)
                if(!obsTypeComplexType.hasAttribute(attributesDeclaringMultipleDimensionsRelationship[i].getId())){
                    return { status: FAILURE_CODE, error: "Error in default rules validation: Attribute "+attributesDeclaringMultipleDimensionsRelationship[i].getId()+" does not follow dimension in lowest level (observation level)."};
                }
            }else{
                let seriesTypeComplexType = complexTypesContainingDimensions.find(complexType => complexType.getName()===COMPLEX_TYPES_NAMES.SERIES_TYPE)
                if(!seriesTypeComplexType.hasAttribute(attributesDeclaringMultipleDimensionsRelationship[i].getId())){
                    return { status: FAILURE_CODE, error: "Error in default rules validation: Attribute "+attributesDeclaringMultipleDimensionsRelationship[i].getId()+" does not follow dimension in SeriesType complex type"};
                }
            }
        }
        return { status: SUCCESS_CODE };

    }
    static checkXSDSimpleTypes(test,query,dsdObject,sdmxObjects){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(test)) {
            throw new Error("Missing mandatory parameter 'test'.");
        }
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //1. Check SimpleTypes without enums
        let simpleTypeWithoutEnumValidation = SchemasSemanticChecker.checkXSDSimpleTypesWithoutEnums(dsdObject,sdmxObjects)
        if(simpleTypeWithoutEnumValidation.status === FAILURE_CODE){return simpleTypeWithoutEnumValidation;}
         
        //2. Check SimpleTypes with enums
        return  SchemasSemanticChecker.checkXSDSimpleTypesWithEnums(test,query,dsdObject,sdmxObjects)
    }

    static checkXSDSimpleTypesWithoutEnums(dsdObject,sdmxObjects){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        
        let simpleTypesWithFacets = sdmxObjects.getSimpleTypesWithFacets();
        let dsdComponentsWithFacets = dsdObject.getComponentsWithFacets()
       
        //The number of dsd components must be equal to the number of simple types describing them.
        //This validation handles the case where there are more simpe types than dsd components with data type restriction.
        if(simpleTypesWithFacets.length > dsdComponentsWithFacets.length){
            return { status: FAILURE_CODE, error: "There are more simple types in the XSD than DSD components"};
        }
        
        let errors = [];
        /*This check validates each dsd component against the matching simpleType.
        It fails when :
        a) There are more dsd components than simpleTypes (dsd component is not described by a simple Type)
        b) When the simple Type description of component is incorrect*/
        dsdComponentsWithFacets.forEach(function(component){
                let validSimpleType = simpleTypesWithFacets.find(function(simpleType){
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

                if(!validSimpleType){
                    errors.push({type:component.getType(),id:component.getId()})
                }
        })
        if(errors.length>0){
            return { status: FAILURE_CODE, error: "These components were not refered or were not refered correctly in the XSD " + JSON.stringify(errors) };
        }
        return { status: SUCCESS_CODE };
        
    
    
    }

    static checkXSDSimpleTypesWithEnums(test,query,dsdObject,sdmxObjects){
       
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        if (!Utils.isDefined(test)) {
            throw new Error("Missing mandatory parameter 'test'.");
        }

         /*The content constraint is chosen in the schema tests preparation. There is no guarantee that the maintainable selected from it will be 
        the same as the one returned from a query that the version='latest'. If the maintainable returned from this query is different from the one
        chosen in the first place, then the constraint of might be different and as a result the restrictions of it will be different. In this case the
        only check that we can perform is that the workspace of the XSD contains simple types that represent the enumerated components of the dsd.*/
        if (!Utils.isDefined(test.constraintParent)){
            let notFoundSimpleTypeIds = [];
            dsdObject.getEnumeratedComponents().forEach(comp => {
                if(!sdmxObjects.getEnumeratedSimpleTypeOfComponent(comp.getId())){
                    notFoundSimpleTypeIds.push(comp.getId())
                }
            })
            if(notFoundSimpleTypeIds.length>0){
                return { status: FAILURE_CODE, error: "These components are not represented with enumerated simple types in the XSD: "+ JSON.stringify(notFoundSimpleTypeIds)};
            }
            return { status: SUCCESS_CODE };
        }

        let errors = []
        let dataKeySetsKeyValuesCheckedIds = []
        let constraintObj = ContentConstraintObject.fromJSON(test.constraintParent);
        let constraintComponent = (constraintObj.getCubeRegions().length > 0) ? constraintObj.getCubeRegions():constraintObj.getDataKeySets()
        constraintComponent.forEach(constraintComponent => {
            if(constraintComponent instanceof CubeRegionObject){

                constraintComponent.getKeyValues().forEach(keyValue =>{
                    let outcome = this.validateKeyValueAgainstSimpleTypeEnum(sdmxObjects,keyValue,constraintObj)
                    if(!outcome.result){
                        errors.push({name:outcome.chosenSimpleType.getName()})
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

                            let outcome = this.validateKeyValueAgainstSimpleTypeEnum(sdmxObjects,keyValue,constraintObj)
                            if(!outcome.result){
                                errors.push({name:outcome.chosenSimpleType.getName()})
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
        if (!Utils.isDefined(constraintObj) || !(constraintObj instanceof ContentConstraintObject)) {
            throw new Error("Missing mandatory parameter 'ContentConstraintObject'.");
        }
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
        return {result:ContentConstraintReferencePartialChecker.constraintValuesValidation(keyValue,enums,constraintObj),
                chosenSimpleType:chosenSimpleType}

    }

    static checkXSDComplexTypes (test,dsdObject,query,sdmxObjects,dimensionAtObservation){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(test)) {
            throw new Error("Missing mandatory parameter 'test'.");
        }
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(dimensionAtObservation)) {
            throw new Error("Missing mandatory parameter 'dimensionAtObservation'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //CHECK DATASETTYPE
        let dataSetTypeValidation = SchemasSemanticChecker.checkXSDDataSetType(dsdObject,sdmxObjects,dimensionAtObservation)
        if(dataSetTypeValidation.status === FAILURE_CODE){return dataSetTypeValidation}
        
        //CHECK SERIESTYPE
        let seriesTypeValidation = SchemasSemanticChecker.checkXSDSeriesType(dsdObject,sdmxObjects,dimensionAtObservation)
        if(seriesTypeValidation.status === FAILURE_CODE){return seriesTypeValidation}

        //CHECK GROUPTYPE
        let groupTypeValidation = SchemasSemanticChecker.checkXSDGroupType(dsdObject,sdmxObjects,dimensionAtObservation)
        if(groupTypeValidation.status === FAILURE_CODE){return groupTypeValidation}

        //CHECK OBSTYPE
        let obsTypeValidation = SchemasSemanticChecker.checkXSDObsType(test,dsdObject,query,sdmxObjects,dimensionAtObservation)
        return obsTypeValidation

          
    }
    static checkXSDDataSetType(dsdObject,sdmxObjects,dimensionAtObservation){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(dimensionAtObservation)) {
            throw new Error("Missing mandatory parameter 'dimensionAtObservation'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //CHECK DataSetType
       
        //GET THE CORRECT COMPLEX TYPE
        let complexType = sdmxObjects.getXSDComplexTypeByName(COMPLEX_TYPES_NAMES.DATA_SET_TYPE);
        if(!complexType){throw new Error("Missing complexType "+COMPLEX_TYPES_NAMES.DATA_SET_TYPE+"."); }
        
        //If undefined means that we do not have specified observation dimension so it is its default (TIME_PERIOD)
        let expectedRestrictionBase = (dimensionAtObservation=== DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD)?
            COMPLEX_TYPES_RESTRICTION_BASE.DSD_TIME_SERIES_DATA_SET_TYPE : COMPLEX_TYPES_RESTRICTION_BASE.DSD_DATA_SET_TYPE
        
        //CHECK RESTRICTION BASE OF COMPLEX TYPE
        if(complexType.getRestrictionBase()!==expectedRestrictionBase){
            return { status: FAILURE_CODE, 
                        error: "Error in DataSetType complex type validation: The restriction base should have been "+expectedRestrictionBase+" but instead it is "+complexType.getRestrictionBase()+"."}
        }

        //CHECK IF THE 'DataSetType' CONTAINS A SEQUENCE
        if(complexType.getCompositors().length !== 1){
            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No compositors found."}
        }
        if(complexType.getCompositors()[0].getType()!==COMPLEX_TYPES_COMPOSITORS_NAMES.SEQUENCE){
            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No sequence found."}
        }

        //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
        let sequence = complexType.getCompositors()[0];
        if(!sequence.getElements().find(element => (element instanceof XSDReferenceElement) 
        && element.getRef() === SCHEMA_ELEMENT_REF.COMMON_ANNOTATIONS 
        && element.getMinOccurs() === OCCURENCIES_VALUES.ZERO)){
            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No valid reference element found in sequence."}
        }

        if(!sequence.getElements().find(element => (element instanceof XSDLocalElement) 
        && element.getName() === SCHEMA_ELEMENT_NAMES.DATA_PROVIDER 
        && element.getType() === SCHEMA_ELEMENT_REF.COMMON_DATA_PROVIDER_REFERENCE 
        && element.getMinOccurs() === OCCURENCIES_VALUES.ZERO 
        && element.getForm() === SCHEMA_ELEMENT_FORMS.UNQUALIFIED)){
            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No valid local element found in sequence."}
        }
        
        //CHECK GROUP ELEMENT
        if(dsdObject.getGroups().length > 0){
            let expectedElementType;
            if(dsdObject.getGroups().length === 1){
                expectedElementType = dsdObject.getGroups()[0].getId()
            }else if(dsdObject.getGroups().length > 1){
                expectedElementType = SCHEMA_ELEMENT_TYPES.GROUP_TYPE
                
            }
            if(!sequence.getElements().find(element => (element instanceof XSDLocalElement) && element.getName() === SCHEMA_ELEMENT_NAMES.GROUP && element.getType() === expectedElementType && element.getMinOccurs() === OCCURENCIES_VALUES.ZERO && element.getMaxOccurs() === OCCURENCIES_VALUES.UNBOUNDED && element.getForm()===SCHEMA_ELEMENT_FORMS.UNQUALIFIED)){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No valid local group element found in sequence."}
            }
        }

        //CHECK IF THE SEQUENCE CONTAINS A CHOICE WITH CORRECT PROPS
        if(sequence.getCompositors().length !== 1){
            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No compositors found inside sequence."}
        }
        if(sequence.getCompositors()[0].getType()!=="choice"){
            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No choice found inside sequence."}
        }

        //CHECK IF THE CHOICE CONTAINS THE RIGHT ELEMENTS
        let choice = sequence.getCompositors()[0];
        if(choice.getMinOccurs() !== OCCURENCIES_VALUES.ZERO){
            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: Minimum occurence of choice is "+choice.getMinOccurs()+" instead of 0."}
        }
    

        //CHECK IF THE ELEMENT IN CHOICE IS VALID
        let validName = (dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.ALLDIMENSIONS)?SCHEMA_ELEMENT_NAMES.OBS:SCHEMA_ELEMENT_NAMES.SERIES;
        let validType = (dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.ALLDIMENSIONS)?SCHEMA_ELEMENT_TYPES.OBS_TYPE:SCHEMA_ELEMENT_TYPES.SERIES_TYPE;
        if(!choice.getElements().find(element => 
        (element instanceof XSDLocalElement) 
        && (element.getName() ===  validName)
        && (element.getType() === validType)
        && (element.getMaxOccurs() === OCCURENCIES_VALUES.UNBOUNDED)
        && (element.getForm()===SCHEMA_ELEMENT_FORMS.UNQUALIFIED))){
        
            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No valid Local Element found in choice."}
        }
        

        //CHECK FOR REPORTING_YEAR_START_DAY ATTRIBUTE
        let reportingYearStartDayAttr = dsdObject.getComponents().find(component => component.getId() === ATTRIBUTE_NAMES.REPORTING_YEAR_START_DAY)
        if((!reportingYearStartDayAttr) 
            || (reportingYearStartDayAttr && !reportingYearStartDayAttr.getAttributeRelationship().find(relationship => relationship.getRelationShipType()===ATTRIBUTE_RELATIONSHIP_NAMES.NONE))){
                if(!complexType.hasAttribute(ATTRIBUTE_NAMES.REPORTING_YEAR_START_DAY,XSD_DATA_TYPE.MONTH_DAY,SCHEMA_ATTRIBUTE_USAGE_VALUES.PROHIBITED)){
                    return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No REPORTING_YEAR_START_DAY attribute found."}
                }
                
        }

        //CHECK FOR ATTRIBUTE RELATIONSHIPS OF NONE ATTRIBUTES
        let missingAttributes = []
        let attributes = dsdObject.getComponents().filter(component => component instanceof DataStructureAttributeObject)
        let attributesDeclaringNoneRelationship = attributes.filter(function(attribute){
            let attrRelationships = attribute.getAttributeRelationship()
            return attrRelationships.filter(relationship=>relationship.getRelationshipType()===ATTRIBUTE_RELATIONSHIP_NAMES.NONE).length>0 === true
        })
        for(let i in attributesDeclaringNoneRelationship){
            if(!complexType.hasStructComponentAsAttribute(attributesDeclaringNoneRelationship[i].getId(),attributesDeclaringNoneRelationship[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
                missingAttributes.push(attributesDeclaringNoneRelationship[i].getId())
            }
        }
        if(missingAttributes.length > 0){
            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: The following none relationship attributes are missing."+JSON.stringify(missingAttributes)}
        }

        return { status: SUCCESS_CODE };
    
    }
    static checkXSDSeriesType(dsdObject,sdmxObjects,dimensionAtObservation){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(dimensionAtObservation)) {
            throw new Error("Missing mandatory parameter 'dimensionAtObservation'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //GET THE CORRECT COMPLEX TYPE
        let complexType = sdmxObjects.getXSDComplexTypeByName(COMPLEX_TYPES_NAMES.SERIES_TYPE);
        if(dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.ALLDIMENSIONS){
            if(complexType){throw new Error("Complex Type "+COMPLEX_TYPES_NAMES.SERIES_TYPE+" is invalid when dimensionAtObservation equals AllDimensions."); }
            return { status: SUCCESS_CODE };
        }else{
            if(!complexType){throw new Error("Missing complexType "+COMPLEX_TYPES_NAMES.SERIES_TYPE+"."); }
        }
        
        //If undefined means that we do not have specified observation dimension so it is its default (TIME_PERIOD)
        let expectedRestrictionBase = (dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD) ? COMPLEX_TYPES_RESTRICTION_BASE.DSD_TIME_SERIES_TYPE : COMPLEX_TYPES_RESTRICTION_BASE.DSD_SERIES_TYPE
        
        //CHECK RESTRICTION BASE OF COMPLEX TYPE
        if(complexType.getRestrictionBase()!==expectedRestrictionBase){
            return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: The restriction base should have been "+expectedRestrictionBase+" but instead it is "+complexType.getRestrictionBase()+"."}
        }

        //CHECK IF THE 'SeriesType' CONTAINS A SEQUENCE
        if(complexType.getCompositors().length !== 1){
            return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: No compositors found."}
        }
        if(complexType.getCompositors()[0].getType()!==COMPLEX_TYPES_COMPOSITORS_NAMES.SEQUENCE){
            return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: No sequence found."}
        }


        //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
        let sequence = complexType.getCompositors()[0];
        if(!sequence.getElements().find(element => (element instanceof XSDReferenceElement) && element.getRef() === SCHEMA_ELEMENT_REF.COMMON_ANNOTATIONS && element.getMinOccurs() === OCCURENCIES_VALUES.ZERO)){
            return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: No valid reference element found in sequence."}
        }
        if(!sequence.getElements().find(element => (element instanceof XSDLocalElement) && element.getName() === SCHEMA_ELEMENT_NAMES.OBS && element.getType() === SCHEMA_ELEMENT_TYPES.OBS_TYPE && element.getMinOccurs() === OCCURENCIES_VALUES.ZERO && element.getMaxOccurs() === OCCURENCIES_VALUES.UNBOUNDED && element.getForm()===SCHEMA_ELEMENT_FORMS.UNQUALIFIED)){
            return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: No valid local element found in sequence."}
        }

        let missingAttributes = []
        let requestedDimensions = dsdObject.getComponents().filter(component => component.getType() === DSD_COMPONENTS_NAMES.DIMENSION && component.getId() !== dimensionAtObservation )

        for(let i in requestedDimensions){
            if(!complexType.hasStructComponentAsAttribute(requestedDimensions[i].getId(),requestedDimensions[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.REQUIRED)){
                missingAttributes.push(requestedDimensions[i].getId())
            }
        }
        if(missingAttributes.length > 0){
            return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
        }

        let reportingYearStartDayAttr = dsdObject.getComponents().find(component => component.getId() === ATTRIBUTE_NAMES.REPORTING_YEAR_START_DAY)
        if((!reportingYearStartDayAttr) 
            || (reportingYearStartDayAttr && !reportingYearStartDayAttr.getAttributeRelationship().find(relationship => relationship.getRelationShipType()==="None"))){
                if(!complexType.hasAttribute(ATTRIBUTE_NAMES.REPORTING_YEAR_START_DAY,XSD_DATA_TYPE.MONTH_DAY,SCHEMA_ATTRIBUTE_USAGE_VALUES.PROHIBITED)){
                    return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: No REPORTING_YEAR_START_DAY attribute found."}
                }
        }

        //CHECK FOR ATTRIBUTES WITH DIMENSION RELATIONSHIPS(NO OBSLEVEL, NO ATTACHMENT GROUP RELATIONSHIP)
        missingAttributes = []
        let attributes = dsdObject.getComponents().filter(component => component instanceof DataStructureAttributeObject)
        
        let requestedAttributes = attributes.filter(function(attribute){
            let attrRelationships = attribute.getAttributeRelationship()
            let expression1 = attrRelationships.some(relationship => relationship.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.ATTACHMENT_GROUP);
            let expression2 = attrRelationships.filter(relationship=>relationship.getRelationshipType()=== ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION && relationship.getId() !== dimensionAtObservation).length>0 === true
            return expression1 === false && expression2 === true
        })

        for(let i in requestedAttributes){
            if(!complexType.hasStructComponentAsAttribute(requestedAttributes[i].getId(),requestedAttributes[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
                missingAttributes.push(requestedAttributes[i].getId())
            }
        }
        if(missingAttributes.length > 0){
            return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
        }

        //CHECK FOR ATTRIBUTES WITH DIMENSION RELATIONSHIPS ΤΗΑΤ ARE REFERENCED IN GROUPS
        let dsdGroups = dsdObject.getGroups()
        for(let c in dsdGroups){
            missingAttributes = []
            requestedAttributes = attributes.filter(function(attribute){
                let attrRelationships = attribute.getAttributeRelationship()
                let expression1 = attrRelationships.filter(relationship => (relationship.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.GROUP || relationship.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.ATTACHMENT_GROUP) && dsdGroups[c].getId()===relationship.getId()).length>0;
                let expression2 = dsdGroups[c].getDimensionReferences().length === attrRelationships.length && 
                    attrRelationships.filter(relationship=>relationship.getRelationshipType()===ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION && dsdGroups[c].getDimensionReferences().indexOf(relationship.getId())!==-1).length === attrRelationships.length
                return expression1 || expression2 
            })
            for(let i in requestedAttributes){
                if(!complexType.hasStructComponentAsAttribute(requestedAttributes[i].getId(),requestedAttributes[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
                    missingAttributes.push(requestedAttributes[i].getId())
                }
            }
            if(missingAttributes.length > 0){
                return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
            }
        }
        

        return { status: SUCCESS_CODE };
    }
    static checkXSDGroupType(dsdObject,sdmxObjects,dimensionAtObservation){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(dimensionAtObservation)) {
            throw new Error("Missing mandatory parameter 'dimensionAtObservation'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        if(dsdObject.getGroups().length>1){
            let abstractGroupTypeValidation =  SchemasSemanticChecker.checkXSDAbstractGroupType(dsdObject,sdmxObjects,dimensionAtObservation)
            if(abstractGroupTypeValidation.status === FAILURE_CODE){return abstractGroupTypeValidation}
        }
        return SchemasSemanticChecker.checkSpecificXSDGroupType(dsdObject,sdmxObjects,dimensionAtObservation)
       
       
    }
    static checkXSDAbstractGroupType(dsdObject,sdmxObjects){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        let complexType = sdmxObjects.getXSDComplexTypeByName(COMPLEX_TYPES_NAMES.GROUP_TYPE);
        if(!complexType){throw new Error("Missing complexType "+COMPLEX_TYPES_NAMES.GROUP_TYPE+"."); }
        
        if(complexType.getRestrictionBase()!==COMPLEX_TYPES_RESTRICTION_BASE.DSD_GROUP_TYPE){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: The restriction base should have been 'dsd:GroupType' but instead it is "+complexType.getRestrictionBase()+"."}
        }

        if(!complexType.getIsAbstract()){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: The GroupType complex type is not abstract."}
        }
        //CHECK IF THE 'GroupType' CONTAINS A SEQUENCE
        if(complexType.getCompositors().length !== 1){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No compositors found."}
        }
        if(complexType.getCompositors()[0].getType()!==COMPLEX_TYPES_COMPOSITORS_NAMES.SEQUENCE){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No sequence found."}
        }

        //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
        let sequence = complexType.getCompositors()[0];
        if(!sequence.getElements().find(element => (element instanceof XSDReferenceElement) && element.getRef() === SCHEMA_ELEMENT_REF.COMMON_ANNOTATIONS && element.getMinOccurs() === OCCURENCIES_VALUES.ZERO)){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No valid reference element found in sequence."}
        }
    
        //CHECK ATTRIBUTES & ANYATTRIBUTE
        if(!complexType.getAttributes().find(attr=>attr.getName() === SCHEMA_ATTRIBUTE_NAMES.TYPE && attr.getType() === SCHEMA_ATTRIBUTE_TYPES.GROUP_TYPE_ID && attr.getUse()===SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No optional attribute found with type 'GroupType.ID'. "}
        }
        if(!complexType.getAnyAttributes().find(attr=>attr.getNamespace()=== SCHEMA_ANYATTRIBUTE_NAMESPACES.LOCAL)){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No anyAttribute found. "}
        }

        //CHECK GroupType.ID SIMPLE TYPE
        let simpleType = sdmxObjects.getXSDSimpleTypeByName(SCHEMA_SIMPLE_TYPE_NAMES.GROUP_TYPE_ID);
        if(!simpleType){throw new Error("Missing simpleType "+SCHEMA_SIMPLE_TYPE_NAMES.GROUP_TYPE_ID+"."); }

        if(simpleType.getRestrictionBase()!==SCHEMA_SIMPLE_TYPE_RESTRICTION_BASE.COMMON_ID_TYPE){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: The restriction base of 'GroupType.ID' simpleType should have been 'common:IDType' but instead it is "+simpleType.getRestrictionBase()+"."}
        }
        if(simpleType.getEnumerations().length === 0){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: Missing enumerations in simpleType 'GroupType.ID' "}
        }
        if(simpleType.getEnumerations().length !== dsdObject.getGroups().length){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: Number of enumerations in simpleType 'GroupType.ID' is not correct."}
        }
        if(!dsdObject.getGroups().every(group=>simpleType.getEnumerations().indexOf(group.getId()) !== -1)){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: Invalid enumerations in simpleType 'GroupType.ID'."}
        }
        return { status: SUCCESS_CODE };
 
    }
    static checkSpecificXSDGroupType(dsdObject,sdmxObjects){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        let dsdGroups = dsdObject.getGroups()
        let expectedRestrictionBase = (dsdGroups.length > 1)?COMPLEX_TYPES_RESTRICTION_BASE.GROUP_TYPE:COMPLEX_TYPES_RESTRICTION_BASE.DSD_GROUP_TYPE
        for(let c in dsdGroups){   
            let complexTypeName = (dsdGroups.length > 1)?dsdGroups[c].getId() : COMPLEX_TYPES_NAMES.GROUP_TYPE
            //GET THE CORRECT COMPLEX TYPE
            let complexType = sdmxObjects.getXSDComplexTypeByName(complexTypeName);
            if(!complexType){throw new Error("Missing complexType "+complexTypeName+" ."); }

            if(complexType.getRestrictionBase()!==expectedRestrictionBase){
                return { status: FAILURE_CODE, error: "Error in "+complexTypeName+" complex type validation: The restriction base should have been "+expectedRestrictionBase+" but instead it is "+complexType.getRestrictionBase()+"."}
            }
            //CHECK IF THE 'GroupType' CONTAINS A SEQUENCE
            if(complexType.getCompositors().length !== 1){
                return { status: FAILURE_CODE, error: "Error in "+complexTypeName+" complex type validation: No compositors found."}
            }
            if(complexType.getCompositors()[0].getType()!=="sequence"){
                return { status: FAILURE_CODE, error: "Error in "+complexTypeName+" complex type validation: No sequence found."}
            }

            //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
            let sequence = complexType.getCompositors()[0];
            if(!sequence.getElements().find(element => (element instanceof XSDReferenceElement) && element.getRef() === SCHEMA_ELEMENT_REF.COMMON_ANNOTATIONS && element.getMinOccurs() === OCCURENCIES_VALUES.ZERO)){
                return { status: FAILURE_CODE, error: "Error in "+complexTypeName+" complex type validation: No valid reference element found in sequence."}
            }

            //CHECK IF THERE ARE ATTRIBUTES FOR EACH DIMENSION IN DSD EXCEPT OBSERVATION LEVEL DIMENSION
            let missingAttributes = []
            let requestedDimensions = dsdObject.getComponents().filter(component => component.getType() === DSD_COMPONENTS_NAMES.DIMENSION && dsdGroups[c].getDimensionReferences().indexOf(component.getId())!==-1 )

            for(let i in requestedDimensions){
                if(!complexType.hasStructComponentAsAttribute(requestedDimensions[i].getId(),requestedDimensions[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.REQUIRED)){
                    missingAttributes.push(requestedDimensions[i].getId())
                }
            }
            
            if(missingAttributes.length > 0){
                return { status: FAILURE_CODE, error: "Error in "+complexTypeName+" complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
            }
            let reportingYearStartDayAttr = dsdObject.getComponents().find(component => component.getId() === ATTRIBUTE_NAMES.REPORTING_YEAR_START_DAY)
                if((!reportingYearStartDayAttr) 
                    || (reportingYearStartDayAttr && !reportingYearStartDayAttr.getAttributeRelationship().find(relationship => relationship.getRelationShipType()===ATTRIBUTE_RELATIONSHIP_NAMES.NONE))){
                        if(!complexType.hasAttribute(ATTRIBUTE_NAMES.REPORTING_YEAR_START_DAY,XSD_DATA_TYPE.MONTH_DAY,SCHEMA_ATTRIBUTE_USAGE_VALUES.PROHIBITED)){
                            return { status: FAILURE_CODE, error: "Error in "+complexTypeName+" complex type validation: No REPORTING_YEAR_START_DAY attribute found."}
                        }
                }

            //TODO:CHECK IF THE LOGIC IS CORRECT (FOR ATTACHMENT GROUP AND DIMENSIONS)
            missingAttributes = []
            let attributes = dsdObject.getComponents().filter(component => component instanceof DataStructureAttributeObject)
            let requestedAttributes = attributes.filter(function(attribute){
                let attrRelationships = attribute.getAttributeRelationship()
                let expression1 = attrRelationships.filter(relationship => (relationship.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.GROUP || relationship.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.ATTACHMENT_GROUP) && dsdGroups[c].getId()===relationship.getId()).length>0;
                let expression2 = dsdGroups[c].getDimensionReferences().length === attrRelationships.length && 
                    attrRelationships.filter(relationship=>relationship.getRelationshipType()===ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION && dsdGroups[c].getDimensionReferences().indexOf(relationship.getId())!==-1).length === attrRelationships.length
                return expression1 || expression2 
            })
            for(let i in requestedAttributes){
                if(!complexType.hasStructComponentAsAttribute(requestedAttributes[i].getId(),requestedAttributes[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
                    missingAttributes.push(requestedAttributes[i].getId())
                }
            }
            if(missingAttributes.length > 0){
                return { status: FAILURE_CODE, error: "Error in "+complexTypeName+" complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
            }
            
            //CHECK FOR ATTRIBUTE WITH FIXED VALUE
            let expectedAttrType = (dsdGroups.length > 1)?SCHEMA_ATTRIBUTE_TYPES.GROUP_TYPE_ID : SCHEMA_ATTRIBUTE_TYPES.COMMON_ID_TYPE
            if(!complexType.hasAttribute("type",expectedAttrType,SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
                return { status: FAILURE_CODE, error: "Error in "+complexTypeName+" complex type validation: No optional attribute with name 'type' and type "+expectedAttrType+" and fixed value found "}
            }
               
        }
        return { status: SUCCESS_CODE };
    }
    static checkXSDObsType(test,dsdObject,query,sdmxObjects,dimensionAtObservation){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(test)) {
            throw new Error("Missing mandatory parameter 'test'.");
        }
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(dimensionAtObservation)) {
            throw new Error("Missing mandatory parameter 'dimensionAtObservation'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        if(query.explicit){
            let complexTypesOfMeasureDimensionConceptsValidation = SchemasSemanticChecker.checkComplexTypesOfMeasureDimensionConcepts(test,dsdObject,sdmxObjects)
            if(complexTypesOfMeasureDimensionConceptsValidation.status === FAILURE_CODE){return complexTypesOfMeasureDimensionConceptsValidation}
        }
        return SchemasSemanticChecker.checkObsTypeContentModel(test,dsdObject,query,sdmxObjects,dimensionAtObservation)
        
    }
    static checkObsTypeContentModel(test,dsdObject,query,sdmxObjects,dimensionAtObservation){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(test)) {
            throw new Error("Missing mandatory parameter 'test'.");
        }
        if (!Utils.isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!Utils.isDefined(dimensionAtObservation)) {
            throw new Error("Missing mandatory parameter 'dimensionAtObservation'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        let complexType = sdmxObjects.getXSDComplexTypeByName(COMPLEX_TYPES_NAMES.OBS_TYPE);
        if(!complexType){throw new Error("Missing complexType "+COMPLEX_TYPES_NAMES.OBS_TYPE+"."); }
        
        let expectedRestrictionBase = (dimensionAtObservation!==DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD) ? COMPLEX_TYPES_RESTRICTION_BASE.DSD_OBS_TYPE : COMPLEX_TYPES_RESTRICTION_BASE.DSD_TIME_SERIES_OBS_TYPE
        if(complexType.getRestrictionBase()!==expectedRestrictionBase){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: The restriction base should have been "+expectedRestrictionBase+" but instead it is "+complexType.getRestrictionBase()+"."}
        }

        //IF THE DIMENSION AT OBSERVATION IS NOT TIME_PERIOD THEN THE COMPLEX TYPE MUST BE ABSTRACT
        if(query.explicit){
            if(!complexType.getIsAbstract()){
                return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: The ObsType complex type is not abstract."}
            }
        }

        //CHECK IF THE 'ObsType' CONTAINS A SEQUENCE
        if(complexType.getCompositors().length !== 1){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No compositors found."}
        }
        if(complexType.getCompositors()[0].getType()!==COMPLEX_TYPES_COMPOSITORS_NAMES.SEQUENCE){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No sequence found."}
        }

        //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE
        let sequence = complexType.getCompositors()[0];
        if(!sequence.getElements().find(element => (element instanceof XSDReferenceElement) && element.getRef() === SCHEMA_ELEMENT_REF.COMMON_ANNOTATIONS && element.getMinOccurs() === OCCURENCIES_VALUES.ZERO)){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No valid reference element found in sequence."}
        }

        if(dimensionAtObservation!==DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD){
            if(!complexType.getAttributes().find(attr => attr.getType()===SCHEMA_ATTRIBUTE_TYPES.COMMON_TIME_PERIOD_TYPE && attr.getName()===SCHEMA_ATTRIBUTE_NAMES.TIME_PERIOD && attr.getUse()===SCHEMA_ATTRIBUTE_USAGE_VALUES.PROHIBITED)){
                return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No prohibited attribute with name 'TIME_PERIOD' and type 'common:TimePeriodType' found. "}
            }
        }
        let missingAttributes=[];

        //IF THE DIMENSION AT THE OBSERVATION IS NOT TIME PERIOD THEN CHECK ITS ATTRIBUTE EXISTANCE
        if(dimensionAtObservation!==DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD){
            let requestedDimensions = dsdObject.getComponents().filter(component => component.getId() === dimensionAtObservation )
            for(let i in requestedDimensions){
                if(!complexType.hasStructComponentAsAttribute(requestedDimensions[i].getId(),requestedDimensions[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.REQUIRED)){
                    missingAttributes.push(requestedDimensions[i].getId())
                }
            }
            if(missingAttributes.length > 0){
                return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
            }
        }
        //CHECK FOR PRIMARY MEASURE ATTRIBUTE
        missingAttributes = []
        let requestedDimensions = dsdObject.getComponents().filter(component => component.getType()===DSD_COMPONENTS_NAMES.PRIMARY_MEASURE)
        for(let i in requestedDimensions){
            if(!complexType.hasStructComponentAsAttribute(requestedDimensions[i].getId(),requestedDimensions[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
                missingAttributes.push(requestedDimensions[i].getId())
            }
        }
        if(missingAttributes.length > 0){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
        }

        //CHECK FOR ATTRIBUTES FOR EVERY ATTRIBUTE WITH RELATIONSHIP WITH PRIMARY MEASURE OR DIMENSION AT OBSERVATION
        
        missingAttributes = []
        let attributes = dsdObject.getComponents().filter(component => component instanceof DataStructureAttributeObject)
        let requestedAttributes = attributes.filter(function(attribute){
            let attrRelationships = attribute.getAttributeRelationship()
            let expression1 = attrRelationships.filter(relationship => relationship.getRelationshipType()===ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION && relationship.getId()===dimensionAtObservation).length>0;
            let expression2 = attrRelationships.filter(relationship => relationship.getRelationshipType()===ATTRIBUTE_RELATIONSHIP_NAMES.PRIMARY_MEASURE).length>0;
            return expression1 || expression2 
        })
        for(let i in requestedAttributes){
            if(!complexType.hasStructComponentAsAttribute(requestedAttributes[i].getId(),requestedAttributes[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
                missingAttributes.push(requestedAttributes[i].getId())
            }
        }
        if(missingAttributes.length > 0){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
        }

        //CHECK FOR ATTRIBUTE WITH NAME TYPE
        let expectedAttrType;
        let expectedUsage;
        if(query.explicit){
            let conceptSchemeObj = dsdObject.getConceptObjectOfMeasureDimension(test.structureWorkspace)
            if(!conceptSchemeObj){
                return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No concept scheme found for measure dimension."} 
            }
            let conceptSchemeIds = [];
            conceptSchemeObj.getItems().forEach(function(item){
                conceptSchemeIds.push(item.id)
            })
            let reqSimpleType = sdmxObjects.getXSDSimpleTypesWithEnumsCriteria(conceptSchemeIds);
            if(!reqSimpleType){
                return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No simple type found representing measure dimension."} 
            }

            expectedAttrType = reqSimpleType.getName()
            expectedUsage = SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL
        }else{
            expectedAttrType = SCHEMA_ATTRIBUTE_TYPES.COMMON_ID_TYPE
            expectedUsage = SCHEMA_ATTRIBUTE_USAGE_VALUES.PROHIBITED
        }
        if(!complexType.hasAttribute(SCHEMA_ATTRIBUTE_NAMES.TYPE,expectedAttrType,expectedUsage)){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No attribute found with name: type, type: "+expectedAttrType+", usage "+expectedUsage+"."}
        }
        return {status:SUCCESS_CODE}
    }
    static checkComplexTypesOfMeasureDimensionConcepts(test,dsdObject,sdmxObjects){
        if (!Utils.isDefined(dsdObject) || !(dsdObject instanceof DataStructureObject)) {
            throw new Error("Missing mandatory parameter 'dsdObject'.");
        }
        if (!Utils.isDefined(test)) {
            throw new Error("Missing mandatory parameter 'test'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        let conceptSchemeObj = dsdObject.getConceptObjectOfMeasureDimension(test.structureWorkspace)
        if(!conceptSchemeObj){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: Unable to find measure dimension or concept scheme inside for measure dimension."} 
        }
        let conceptItems = conceptSchemeObj.getItems()
        let primaryMeasure = dsdObject.getComponents().find(component => component.getType() === DSD_COMPONENTS_NAMES.PRIMARY_MEASURE);
        for(let i in conceptItems){
            let complexType = sdmxObjects.getXSDComplexTypeByName(conceptItems[i].id);
            if(!complexType){throw new Error("Missing complexType '" +conceptItems[i].id+ "'."); }

             //CHECK IF THE COMPLEX TYPE CONTAINS A SEQUENCE
            if(complexType.getCompositors().length !== 1){
                return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No compositors found."}
            }
            if(complexType.getCompositors()[0].getType()!==COMPLEX_TYPES_COMPOSITORS_NAMES.SEQUENCE){
                return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No sequence found."}
            }

            //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
            let sequence = complexType.getCompositors()[0];
            if(!sequence.getElements().find(element => (element instanceof XSDReferenceElement) && element.getRef() === SCHEMA_ELEMENT_REF.COMMON_ANNOTATIONS && element.getMinOccurs() === OCCURENCIES_VALUES.ZERO)){
                return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No valid reference element found in sequence."}
            }

            let conceptSchemeIds = [];
            conceptSchemeObj.getItems().forEach(function(item){
                conceptSchemeIds.push(item.id)
            })
            let reqSimpleType = sdmxObjects.getXSDSimpleTypesWithEnumsCriteria(conceptSchemeIds);
            if(!reqSimpleType){
                return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No simple type found representing measure dimension."} 
            }

            let expectedAttrType = reqSimpleType.getName()
            let expectedUsage = SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL

            if(!complexType.hasAttribute(SCHEMA_ATTRIBUTE_NAMES.TYPE,expectedAttrType,expectedUsage,conceptItems[i].getId())){
                return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No valid attribute found with name type."}
            }
            //TODO: MUST BE CHECKED
            if((conceptItems[i].representation) && conceptItems[i].representation.getType() ===  COMPONENTS_REPRESENTATION_NAMES.TEXT_FORMAT){
                if(primaryMeasure && JSON.stringify(primaryMeasure.getRepresentation()) !== JSON.stringify(conceptItems[i].representation)){
                    if(!complexType.hasAttribute(primaryMeasure.getId(),XSD_DATA_TYPE.getMapping(conceptItems[i].getRepresentation().getTextType()),SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
                        return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No valid attribute found with name "+primaryMeasure.getId()+", type "+conceptItems[i].representation.textType+" and usage optional."}
                    }
                }
            }else{
                if(primaryMeasure && !primaryMeasure.getReferences().some(ref=>JSON.stringify(ref) === JSON.stringify(conceptItems[i].references))){
                    if(!complexType.hasStructComponentAsAttribute(primaryMeasure.getId(),conceptItems[i],sdmxObjects,SCHEMA_ATTRIBUTE_USAGE_VALUES.OPTIONAL)){
                        return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No valid attribute found with name "+primaryMeasure.getId()+" ."}
                    }
                }
            }
        }
        return {status:SUCCESS_CODE}
    }
}
module.exports = SchemasSemanticChecker;