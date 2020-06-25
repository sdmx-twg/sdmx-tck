const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const SCHEMA_FACETS = require('sdmx-tck-api').constants.SCHEMA_FACETS;
const XSD_DATA_TYPE  = require('sdmx-tck-api').constants.XSD_DATA_TYPE;
const DSD_COMPONENTS_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_NAMES;
const COMPONENTS_REPRESENTATION_NAMES = require('sdmx-tck-api').constants.COMPONENTS_REPRESENTATION_NAMES;
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
var XSDReferenceElement = require('sdmx-tck-api').model.XSDReferenceElement
var XSDLocalElement = require('sdmx-tck-api').model.XSDLocalElement
var DataStructureAttributeObject = require('sdmx-tck-api').model.DataStructureAttributeObject;
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

        let dimensionAtObservation = (query.obsDimension)?query.obsDimension:"TIME_PERIOD"
        if(query.explicit){
            let measureDimension = artefact.getComponents().filter(component => component.getType() === DSD_COMPONENTS_NAMES.MEASURE_DIMENSION);
            if(measureDimension.length !== 0){
                dimensionAtObservation = measureDimension[0].getId()
            }
        }
       
        //1. Check SimpleTypes
        // let simpleTypeValidation = await SchemasSemanticChecker.checkXSDSimpleTypes(test,artefact,query,sdmxObjects)
        // return simpleTypeValidation

        //2. Check ComplexTypes
        let complexTypeValidation = await SchemasSemanticChecker.checkXSDComplexTypes(test,artefact,query,sdmxObjects,dimensionAtObservation)
        return complexTypeValidation;
    }
    static async checkXSDSimpleTypes(test,artefact,query,sdmxObjects){
        //1. Check SimpleTypes without enums
         let simpleTypeWithoutEnumValidation = await SchemasSemanticChecker.checkXSDSimpleTypesWithoutEnums(test,artefact,query,sdmxObjects)
         if(simpleTypeWithoutEnumValidation.status === FAILURE_CODE){return simpleTypeWithoutEnumValidation;}
         
         //REMOVE IT 
         //return simpleTypeWithoutEnumValidation
        //2. Check SimpleTypes with enums
        return await SchemasSemanticChecker.checkXSDSimpleTypesWithEnums(test,query,sdmxObjects)
    }

    static async checkXSDSimpleTypesWithoutEnums(test,artefact,query,sdmxObjects){
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

    static checkXSDComplexTypes (test,artefact,query,sdmxObjects,dimensionAtObservation){
        
       let dataSetTypeValidation = SchemasSemanticChecker.checkXSDDataSetType(artefact,query,sdmxObjects,dimensionAtObservation)
       if(dataSetTypeValidation.status === FAILURE_CODE){return dataSetTypeValidation}
    //    if(query.obsDimension !== "AllDimension"){
    //        let seriesTypeValidation = SchemasSemanticChecker.checkXSDSeriesType(artefact,query,sdmxObjects,dimensionAtObservation)
    //        if(seriesTypeValidation.status === FAILURE_CODE){return seriesTypeValidation}
    //        //return seriesTypeValidation
    //    }
    //    let groupTypeValidation = SchemasSemanticChecker.checkXSDGroupType(artefact,sdmxObjects)
    //    //TODO: GroupType must be checked if there is 1 or more groups in dsd
    //    if(groupTypeValidation.status === FAILURE_CODE){return groupTypeValidation}
    //    return groupTypeValidation;

    //    let obsTypeValidation = SchemasSemanticChecker.checkXSDObsType(test,query,sdmxObjects,dimensionAtObservation)
    //    return obsTypeValidation

          
    }
    static checkXSDDataSetType(artefact,query,sdmxObjects,dimensionAtObservation){
         //CHECK DataSetType
         try{
            //GET THE CORRECT COMPLEX TYPE
            let complexType = sdmxObjects.getXSDComplexTypeByName("DataSetType");
            if(!complexType){throw new Error("Missing complexType 'DataSetType'."); }
            
            //If undefined means that we do not have specified observation dimension so it is its default (TIME_PERIOD)
            let expectedRestrictionBase = (dimensionAtObservation=== "TIME_PERIOD") ? "dsd:TimeSeriesDataSetType" : "dsd:DataSetType"
            
            //CHECK RESTRICTION BASE OF COMPLEX TYPE
            if(complexType.getRestrictionBase()!==expectedRestrictionBase){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: The restriction base should have been "+expectedRestrictionBase+" but instead it is "+complexType.getRestrictionBase()+"."}
            }

            //CHECK IF THE 'DataSetType' CONTAINS A SEQUENCE
            if(complexType.getCompositors().length !== 1){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No compositors found.' "}
            }
            if(complexType.getCompositors()[0].getType()!=="sequence"){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No sequence found. "}
            }

            //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
            let sequence = complexType.getCompositors()[0];
            if(sequence.getElements().filter(element => (element instanceof XSDReferenceElement) && element.getRef() === "common:Annotations" && element.getMinOccurs() === "0").length !== 1){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No valid reference element found in sequence."}
            }
            if(sequence.getElements().filter(element => (element instanceof XSDLocalElement) && element.getType() === "common:DataProviderReferenceType" && element.getMinOccurs() === "0" && element.getForm()==="unqualified").length !== 1){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No valid local element found in sequence."}
            }

            //CHECK GROUP ELEMENT
            if(artefact.getGroups().length > 0){
                let expectedElementType;
                if(artefact.getGroups().length === 1){
                    expectedElementType = artefact.getGroups()[0].getId()
                }else if(artefact.getGroups().length > 1){
                    expectedElementType = "GroupType"
                    
                }
                if(sequence.getElements().filter(element => (element instanceof XSDLocalElement) && element.getName() === "Group" && element.getType() === expectedElementType && element.getMinOccurs() === "0" && element.getMaxOccurs() === "unbounded" && element.getForm()==="unqualified").length !== 1){
                    return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No valid local group element found in sequence."}
                }
            }
    
            //CHECK IF THE SEQUENCE CONTAINS A CHOICE WITH CORRECT PROPS
            if(sequence.getCompositors().length !== 1){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No compositors found inside sequence."}
            }
            if(sequence.getCompositors()[0].getType()!=="choice"){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No choice found inside sequnece."}
            }

            //CHECK IF THE CHOICE CONTAINS THE RIGHT ELEMENTS
            let choice = sequence.getCompositors()[0];
            if(choice.getMinOccurs() !== "0"){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: Minimum occurence of choice is "+choice.getMinOccurs()+" instead of 0."}
            }
             //If undefined means that we do not have specified observation dimension so it is its default (TIME_PERIOD)
             if(choice.getElements().filter(element => 
                (element instanceof XSDLocalElement) 
                && element.getName() === (dimensionAtObservation === "AllDimension")?"Obs":"Series" 
                && element.getType() === (dimensionAtObservation === "AllDimension")?"ObsType":"SeriesType" 
                && element.getMaxOccurs() === "unbounded" 
                && element.getForm()==="unqualified").length !== 1){

                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No Local Elements found in choice."}
            }
            

            //CHECK FOR REPORTING_YEAR_START_DAY ATTRIBUTE
            let reportingYearStartDayAttr = artefact.getComponents().filter(component => component.getId() === "REPORTING_YEAR_START_DAY")
            if((reportingYearStartDayAttr.length === 0) 
                || (reportingYearStartDayAttr.length === 1 && reportingYearStartDayAttr[0].getAttributeRelationship().filter(relationship => relationship.getRelationShipType()==="None").length === 0)){
                    if(!complexType.hasAttribute("REPORTING_YEAR_START_DAY",XSD_DATA_TYPE.MONTH_DAY,"prohibited")){
                        return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No REPORTING_YEAR_START_DAY attribute found."}
                    }
                    
            }

            //CHECK FOR ATTRIBUTE RELATIONSHIPS OF NONE ATTRIBUTES
            let missingAttributes = []
            let attributes = artefact.getComponents().filter(component => component instanceof DataStructureAttributeObject)
            let attributesDeclaringNoneRelationship = attributes.filter(function(attribute){
                let attrRelationships = attribute.getAttributeRelationship()
                return attrRelationships.filter(relationship=>relationship.getRelationshipType()==="None").length>0 === true
            })
            for(let i in attributesDeclaringNoneRelationship){
                if(!complexType.hasStructComponentAsAttribute(attributesDeclaringNoneRelationship[i].getId(),attributesDeclaringNoneRelationship[i],sdmxObjects,"optional")){
                    missingAttributes.push(attributesDeclaringNoneRelationship[i].getId())
                }
            }
            if(missingAttributes.length > 0){
                return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: The following none relationship attributes are missing."+JSON.stringify(missingAttributes)}
            }

            return { status: SUCCESS_CODE };
            }catch(ex){
                console.log(ex)
            }
    
    }
    static checkXSDSeriesType(artefact,query,sdmxObjects,dimensionAtObservation){
        try{
            //GET THE CORRECT COMPLEX TYPE
            let complexType = sdmxObjects.getXSDComplexTypeByName("SeriesType");
            if(!complexType){throw new Error("Missing complexType 'SeriesType'."); }
            
            //If undefined means that we do not have specified observation dimension so it is its default (TIME_PERIOD)
            let expectedRestrictionBase = (dimensionAtObservation === "TIME_PERIOD") ? "dsd:TimeSeriesType" : "dsd:SeriesType"
            
            //CHECK RESTRICTION BASE OF COMPLEX TYPE
            if(complexType.getRestrictionBase()!==expectedRestrictionBase){
                return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: The restriction base should have been "+expectedRestrictionBase+" but instead it is "+complexType.getRestrictionBase()+"."}
            }

            //CHECK IF THE 'DataSetType' CONTAINS A SEQUENCE
            if(complexType.getCompositors().length !== 1){
                return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: No compositors found."}
            }
            if(complexType.getCompositors()[0].getType()!=="sequence"){
                return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: No sequence found."}
            }

            //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
            let sequence = complexType.getCompositors()[0];
            if(sequence.getElements().filter(element => (element instanceof XSDReferenceElement) && element.getRef() === "common:Annotations" && element.getMinOccurs() === "0").length !== 1){
                return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: No valid reference element found in sequence."}
            }
            if(sequence.getElements().filter(element => (element instanceof XSDLocalElement) && element.getName() === "Obs" && element.getType() === "ObsType" && element.getMinOccurs() === "0" && element.getMaxOccurs() === "unbounded" && element.getForm()==="unqualified").length !== 1){
                return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: No valid local element found in sequence."}
            }

           
            let requestedDimensions = artefact.getComponents().filter(component => component.getType() === DSD_COMPONENTS_NAMES.DIMENSION && component.getId() !== dimensionAtObservation )
            for(let i in requestedDimensions){
                if(!complexType.hasStructComponentAsAttribute(requestedDimensions[i].getId(),requestedDimensions[i],sdmxObjects,"required")){
                    missingAttributes.push(requestedDimensions[i].getId())
                }
            }
            if(missingAttributes.length > 0){
                return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
            }

            let reportingYearStartDayAttr = artefact.getComponents().filter(component => component.getId() === "REPORTING_YEAR_START_DAY")
            if((reportingYearStartDayAttr.length === 0) 
                || (reportingYearStartDayAttr.length === 1 && reportingYearStartDayAttr[0].getAttributeRelationship().filter(relationship => relationship.getRelationShipType()==="None").length === 0)){
                    if(!complexType.hasAttribute("REPORTING_YEAR_START_DAY",XSD_DATA_TYPE.MONTH_DAY,"prohibited")){
                        return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No REPORTING_YEAR_START_DAY attribute found."}
                    }
            }

            //CHECK FOR ATTRIBUTES WITH DIMENSION RELATIONSHIPS(NO OBSLEVEL, NO ATTACHMENT GROUP RELATIONSHIP)
            missingAttributes = []
            let attributes = artefact.getComponents().filter(component => component instanceof DataStructureAttributeObject)
            let requestedAttributes = attributes.filter(function(attribute){
                let attrRelationships = attribute.getAttributeRelationship()
                let expression1 = attrRelationships.some(relationship => relationship.getRelationshipType() === "AttachmentGroup");
                let expression2 = attrRelationships.filter(relationship=>relationship.getRelationshipType()==="Dimension" && relationship.getIds() !== dimensionAtObservation).length>0 === true
                return expression1 === false && expression2 === true
            })
            for(let i in requestedAttributes){
                if(!complexType.hasStructComponentAsAttribute(requestedAttributes[i].getId(),requestedAttributes[i],sdmxObjects,"optional")){
                    missingAttributes.push(requestedAttributes[i].getId())
                }
            }
            if(missingAttributes.length > 0){
                return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
            }

            //CHECK FOR ATTRIBUTES WITH DIMENSION RELATIONSHIPS ΤΗΑΤ ARE REFERENCED IN GROUPS
            missingAttributes = []
            let requestedAttributes = attributes.filter(function(attribute){
                let attrRelationships = attribute.getAttributeRelationship()
                let expression1 = dsdGroups[c].getDimensionReferences().length === attrRelationships.length && 
                    attrRelationships.filter(relationship=>relationship.getRelationshipType()==="Dimension" && relationship.getIds().every(id=> dsdGroups[c].getDimensionReferences().indexOf(id)!==-1)).length === attrRelationships.length
                return expression1
            })
            for(let i in requestedAttributes){
                if(!complexType.hasStructComponentAsAttribute(requestedAttributes[i].getId(),requestedAttributes[i],sdmxObjects,"optional")){
                    missingAttributes.push(requestedAttributes[i].getId())
                }
            }
            if(missingAttributes.length > 0){
                return { status: FAILURE_CODE, error: "Error in SeriesType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
            }

            return { status: SUCCESS_CODE };
        }catch(ex){
            console.log(ex)
        }
    }
    static checkXSDGroupType(artefact,sdmxObjects){
    
        if(artefact.getGroups().length>1){
            let abstractGroupTypeValidation =  SchemasSemanticChecker.checkXSDAbstractGroupType(artefact,sdmxObjects,dimensionAtObservation)
            if(abstractGroupTypeValidation.status === FAILURE_CODE){return abstractGroupTypeValidation}
        }
        return SchemasSemanticChecker.checkSpecificXSDGroupType(artefact,sdmxObjects,dimensionAtObservation)
       
       
    }
    static checkXSDAbstractGroupType(artefact,sdmxObjects){
        let complexType = sdmxObjects.getXSDComplexTypeByName("GroupType");
        if(!complexType){throw new Error("Missing complexType 'GroupType'."); }

        if(complexType.getRestrictionBase()!=="dsd:GroupType"){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: The restriction base should have been 'dsd:GroupType' but instead it is "+complexType.getRestrictionBase()+"."}
        }

        if(!complexType.getIsAbstract()){
        return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: The GroupType complex type is not abstract."}
        }
        //CHECK IF THE 'GroupType' CONTAINS A SEQUENCE
        if(complexType.getCompositors().length !== 1){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No compositors found."}
        }
        if(complexType.getCompositors()[0].getType()!=="sequence"){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No sequence found."}
        }

        //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
        let sequence = complexType.getCompositors()[0];
        if(sequence.getElements().filter(element => (element instanceof XSDReferenceElement) && element.getRef() === "common:Annotations" && element.getMinOccurs() === "0").length !== 1){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No valid reference element found in sequence."}
        }

        //CHECK ATTRIBUTES & ANYATTRIBUTE
        if(complexType.getAttributes().filter(attr=>attr.getName() === "type" && attr.getType() === "GroupType.ID" && attr.getUse()==="optional").length === 0){
        return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No optional attribute found with name 'Group.ID'. "}
        }
        if(complexType.getAnyAttributes().filter(attr=>attr.getNamespace()=== "##local").length === 0){
        return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No anyAttribute found. "}
        }

        //CHECK GroupType.ID SIMPLE TYPE
        let simpleType = sdmxObjects.getXSDSimpleTypeByName("GroupType.ID");
        if(!complexType){throw new Error("Missing simpleType 'GroupType.ID'."); }

        if(simpleType.getRestrictionBase()!=="common:IDType"){
            return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: The restriction base of 'GroupType.ID' simpleType should have been 'common:IDType' but instead it is "+complexType.getRestrictionBase()+"."}
        }
        if(simpleType.getEnumerations().length === 0){
        return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: Missing enumerations in simpleType 'GroupType.ID' "}
        }
        if(simpleType.getEnumerations().length !== artefact.getGroups().length){
        return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: Number of enumerations in simpleType 'GroupType.ID' is not correct."}
        }
        if(!artefact.getGroups().every(group=>simpleType.getEnumerations().indexOf(group.getId() !== 1))){
        return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: Invalid enumerations in simpleType 'GroupType.ID'."}
        }
        return { status: SUCCESS_CODE };
 
    }
    static checkSpecificXSDGroupType(artefact,sdmxObjects){
        let dsdGroups = artefact.getGroups()
        let expectedRestrictionBase = (dsdGroups.length > 1)?"GroupType":"dsd:GroupType"
        
        for(let c in dsdGroups){   
            let complexTypeName = (dsdGroups.length > 1)?dsdGroups[c].getId() : "GroupType"
            //GET THE CORRECT COMPLEX TYPE
            let complexType = sdmxObjects.getXSDComplexTypeByName(complexTypeName);
            if(!complexType){throw new Error("Missing complexType "+complexTypeName+" ."); }

            if(complexType.getRestrictionBase()!==expectedRestrictionBase){
                return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: The restriction base should have been "+expectedRestrictionBase+" but instead it is "+complexType.getRestrictionBase()+"."}
            }
            //CHECK IF THE 'GroupType' CONTAINS A SEQUENCE
            if(complexType.getCompositors().length !== 1){
                return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No compositors found."}
            }
            if(complexType.getCompositors()[0].getType()!=="sequence"){
                return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No sequence found."}
            }

            //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
            let sequence = complexType.getCompositors()[0];
            if(sequence.getElements().filter(element => (element instanceof XSDReferenceElement) && element.getRef() === "common:Annotations" && element.getMinOccurs() === "0").length !== 1){
                return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No valid reference element found in sequence."}
            }

            //CHECK IF THERE ARE ATTRIBUTES FOR EACH DIMENSION IN DSD EXCEPT OBSERVATION LEVEL DIMENSION
            let missingAttributes = []
            let requestedDimensions = artefact.getComponents().filter(component => component.getType() === DSD_COMPONENTS_NAMES.DIMENSION && dsdGroups[c].getDimensionReferences().indexOf(component.getId())!==-1 )
            for(let i in requestedDimensions){
                if(!complexType.hasStructComponentAsAttribute(requestedDimensions[i].getId(),requestedDimensions[i],sdmxObjects,"required")){
                    missingAttributes.push(requestedDimensions[i].getId())
                }
            }
            if(missingAttributes.length > 0){
                return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
            }
            let reportingYearStartDayAttr = artefact.getComponents().filter(component => component.getId() === "REPORTING_YEAR_START_DAY")
                if((reportingYearStartDayAttr.length === 0) 
                    || (reportingYearStartDayAttr.length === 1 && reportingYearStartDayAttr[0].getAttributeRelationship().filter(relationship => relationship.getRelationShipType()==="None").length === 0)){
                        if(!complexType.hasAttribute("REPORTING_YEAR_START_DAY",XSD_DATA_TYPE.MONTH_DAY,"prohibited")){
                            return { status: FAILURE_CODE, error: "Error in DataSetType complex type validation: No REPORTING_YEAR_START_DAY attribute found."}
                        }
                }

                //TODO:CHECK IF THE LOGIC IS CORRECT (FOR ATTACHMENT GROUP AND DIMENSIONS)
                missingAttributes = []
                let attributes = artefact.getComponents().filter(component => component instanceof DataStructureAttributeObject)
                let requestedAttributes = attributes.filter(function(attribute){
                    let attrRelationships = attribute.getAttributeRelationship()
                    let expression1 = attrRelationships.filter(relationship => relationship.getRelationshipType() === "AttachmentGroup" && relationship.getIds().indexOf("Group")!==-1).length>0;
                    let expression2 = dsdGroups[c].getDimensionReferences().length === attrRelationships.length && 
                        attrRelationships.filter(relationship=>relationship.getRelationshipType()==="Dimension" && relationship.getIds().every(id=> dsdGroups[c].getDimensionReferences().indexOf(id)!==-1)).length === attrRelationships.length
                    return expression1 || expression2 
                })
                for(let i in requestedAttributes){
                    if(!complexType.hasStructComponentAsAttribute(requestedAttributes[i].getId(),requestedAttributes[i],sdmxObjects,"optional")){
                        missingAttributes.push(requestedAttributes[i].getId())
                    }
                }
                if(missingAttributes.length > 0){
                    return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
                }
                
                //CHECK FOR ATTRIBUTE WITH FIXED VALUE
                let expectedAttrType = (dsdGroups.length > 1)?"GroupType.ID" : "common:IDType"
                if(!complexType.hasAttribute("type",expectedAttrType,"optional")){
                    return { status: FAILURE_CODE, error: "Error in GroupType complex type validation: No optional attribute with name 'type' and type "+expectedAttrType+" and fixed value found "}
                }
               
        }
        return { status: SUCCESS_CODE };
    }
    static checkXSDObsType(test,artefact,query,sdmxObjects,dimensionAtObservation){
        if(query.explicit){
            let complexTypesOfMeasureDimensionConceptsValidation = SchemasSemanticChecker.checkComplexTypesOfMeasureDimensionConcepts(test,artefact,sdmxObjects)
            if(complexTypesOfMeasureDimensionConceptsValidation.status === FAILURE_CODE){return complexTypesOfMeasureDimensionConceptsValidation}
        }
        return SchemasSemanticChecker.checkObsTypeContentModel(test,artefact,sdmxObjects,dimensionAtObservation)
        
    }
    static checkObsTypeContentModel(test,artefact,sdmxObjects,dimensionAtObservation){
        
        let complexType = sdmxObjects.getXSDComplexTypeByName("ObsType");
        if(!complexType){throw new Error("Missing complexType 'ObsType'."); }

        let expectedRestrictionBase = (dimensionAtObservation!=="TIME_PERIOD") ? "dsd:ObsType" : "dsd:TimeSeriesObsType"
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
        if(complexType.getCompositors()[0].getType()!=="sequence"){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No sequence found."}
        }

        //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE
        let sequence = complexType.getCompositors()[0];
        if(sequence.getElements().filter(element => (element instanceof XSDReferenceElement) && element.getRef() === "common:Annotations" && element.getMinOccurs() === "0").length !== 1){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No valid reference element found in sequence."}
        }

        if(dimensionAtObservation!=="TIME_PERIOD"){
            if(complexType.getAttributes().filter(attr => attr.getType()==="common:TimePeriodType" && attr.getName()==="TIME_PERIOD" && attr.getUse()==="prohibited").length === 0){
                //return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No prohibited attribute with name 'TIME_PERIOD' and type 'common:TimePeriodType' found. "}
            }
        }
        let missingAttributes=[];

        //IF THE DIMENSION AT THE OBSERVATION IS NOT TIME PERIOD THEN CHECK ITS ATTRIBUTE EXISTANCE
        if(dimensionAtObservation!=="TIME_PERIOD"){
            let requestedDimensions = artefact.getComponents().filter(component => component.getId() === dimensionAtObservation )
            for(let i in requestedDimensions){
                if(!complexType.hasStructComponentAsAttribute(requestedDimensions[i].getId(),requestedDimensions[i],sdmxObjects,"required")){
                    missingAttributes.push(requestedDimensions[i].getId())
                }
            }
            if(missingAttributes.length > 0){
                //return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
            }
        }
        //CHECK FOR PRIMARY MEASURE ATTRIBUTE
        missingAttributes = []
        let requestedDimensions = artefact.getComponents().filter(component => component.getType()===DSD_COMPONENTS_NAMES.PRIMARY_MEASURE && component.getId() === "OBS_VALUE")
        for(let i in requestedDimensions){
            if(!complexType.hasStructComponentAsAttribute(requestedDimensions[i].getId(),requestedDimensions[i],sdmxObjects,"optional")){
                missingAttributes.push(requestedDimensions[i].getId())
            }
        }
        if(missingAttributes.length > 0){
            //return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
        }

        //CHECK FOR ATTRIBUTES FOR EVERY ATTRIBUTE WITH RELATIONSHIP WITH PRIMARY MEASURE OR DIMENSION AT OBSERVATION
        
        missingAttributes = []
        let attributes = artefact.getComponents().filter(component => component instanceof DataStructureAttributeObject)
        let requestedAttributes = attributes.filter(function(attribute){
            let attrRelationships = attribute.getAttributeRelationship()
            let expression1 = attrRelationships.filter(relationship => relationship.getRelationshipType()==="Dimension" && relationship.getIds().indexOf(dimensionAtObservation)!==-1).length>0;
            let expression2 = attrRelationships.filter(relationship => relationship.getRelationshipType()==="PrimaryMeasure").length>0;
            return expression1 || expression2 
        })
        for(let i in requestedAttributes){
            if(!complexType.hasStructComponentAsAttribute(requestedAttributes[i].getId(),requestedAttributes[i],sdmxObjects,"optional")){
                missingAttributes.push(requestedAttributes[i].getId())
            }
        }
        if(missingAttributes.length > 0){
            //return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: The following attributes are missing."+JSON.stringify(missingAttributes)}
        }

        //CHECK FOR ATTRIBUTE WITH NAME TYPE
        let expectedAttrType;
        let expectedUsage;
        if(query.explicit){
            let conceptSchemeObj = artefact.getConceptObjectOfMeasureDimension(test.structureWorkspace)
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
            expectedUsage = "optional"
        }else{
            expectedAttrType = "common:IDType"
            expectedUsage = "prohibited"
        }
        if(!complexType.hasAttribute("type",expectedAttrType,expectedUsage)){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No attribute found with name: type, type: "+expectedAttrType+", usage "+expectedUsage+"."}
        }
        return {status:SUCCESS_CODE}
    }

    static checkComplexTypesOfMeasureDimensionConcepts(test,artefact,sdmxObjects){
        let conceptSchemeObj = artefact.getConceptObjectOfMeasureDimension(test.structureWorkspace)
        if(!conceptSchemeObj){
            return { status: FAILURE_CODE, error: "Error in ObsType complex type validation: No concept scheme found for measure dimension."} 
        }
        let conceptItems = conceptSchemeObj.getItems()
        let primaryMeasure = artefact.getComponents().filter(component => component.getType() === DSD_COMPONENTS_NAMES.PRIMARY_MEASURE);
        for(let i in conceptItems){
            let complexType = sdmxObjects.getXSDComplexTypeByName(conceptItems[i].id);
            if(!complexType){throw new Error("Missing complexType '" +conceptItems[i].id+ "'."); }

             //CHECK IF THE COMPLEX TYPE CONTAINS A SEQUENCE
            if(complexType.getCompositors().length !== 1){
                return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No compositors found."}
            }
            if(complexType.getCompositors()[0].getType()!=="sequence"){
                return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No sequence found."}
            }

            //CHECK THAT THE SEQUENCE CONTAINS THE CORRECT REFERENCE & LOCAL ELEMENTS
            let sequence = complexType.getCompositors()[0];
            if(sequence.getElements().filter(element => (element instanceof XSDReferenceElement) && element.getRef() === "common:Annotations" && element.getMinOccurs() === "0").length !== 1){
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
            let expectedUsage = "optional"

            console.log(expectedAttrType)
            console.log(expectedUsage)
            console.log(conceptItems[i].getId())
            if(!complexType.hasAttribute("type",expectedAttrType,expectedUsage,conceptItems[i].getId())){
                return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No valid attribute found with name type."}
            }

            // console.log(conceptItems[i].references)
            // console.log(conceptItems[i].representation)
            // console.log(primaryMeasure[0].getReferences())
            //TODO: MUST BE CHECKED
            if((conceptItems[i].representation) && conceptItems[i].representation.getType() ===  COMPONENTS_REPRESENTATION_NAMES.TEXT_FORMAT){
                console.log(conceptItems[i].id + "@1")
                if(primaryMeasure.length === 1 && JSON.stringify(primaryMeasure[0].getRepresentation()) !== JSON.stringify(conceptItems[i].representation)){
                    if(!complexType.hasAttribute(primaryMeasure[0].getId(),XSD_DATA_TYPE.getMapping(conceptItems[i].getRepresentation().getTextType()),"optional")){
                        return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No valid attribute found with name "+primaryMeasure[0].getId()+", type "+conceptItems[i].representation.textType+" and usage optional."}
                    }
                }
            }else{
                console.log(conceptItems[i].id + "@2")
                if(primaryMeasure.length === 1 && !primaryMeasure[0].getReferences().some(ref=>JSON.stringify(ref) === JSON.stringify(conceptItems[i].references))){
                    if(!complexType.hasStructComponentAsAttribute(primaryMeasure[0].getId(),conceptItems[i],sdmxObjects,"optional")){
                        return { status: FAILURE_CODE, error: "Error in complex type '" + conceptItems[i].id+ "' validation: No valid attribute found with name "+primaryMeasure[0].getId()+" ."}
                    }
                }
            }
        }
        return {status:SUCCESS_CODE}
    }
}
module.exports = SchemasSemanticChecker;