var MaintainableObject = require('./MaintainableObject.js');
var SDMX_STRUCTURE_TYPE = require('../../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
var StructureReference = require('./StructureReference.js');
const DSD_COMPONENTS_NAMES = require('../../constants/structure-queries-constants/DSDComponents.js').DSD_COMPONENTS_NAMES;
const COMPONENTS_REPRESENTATION_NAMES = require('../../constants/structure-queries-constants/ComponentsRepresentationNames.js').COMPONENTS_REPRESENTATION_NAMES;
const ATTRIBUTE_ASSIGNMENT_STATUS = require('../../constants/structure-queries-constants/DSDAttributeConstants.js').ATTRIBUTE_ASSIGNMENT_STATUS;


class DataStructureObject extends MaintainableObject {
    constructor(props, components,groups,children, detail) {
        super(SDMX_STRUCTURE_TYPE.DSD.key, props, children, detail);

        this.components = components
        this.groups = groups
    };
   
    setGroups(groups){
        this.groups = groups;
    }
    getGroups(){
        return this.groups
    }
    setComponents(components) {
        this.components = components;
    };
    getComponents() {
        return this.components;
    }

    //Return a reference from the codelist referenced by the chosen component.
    //If the codeList is not found it returns an empty obj
    getReferencedCodelistInComponent(componentId){
        let codedComponents = this.getDimensionsAndAttributes();
        if(codedComponents && Array.isArray(codedComponents)){
            for (let i=0;i<codedComponents.length;i++){
                if(codedComponents[i].getId() && codedComponents[i].getId() === componentId){
                    if(codedComponents[i].getReferences() && Array.isArray(codedComponents[i].getReferences())){
                        for(let j=0;j<codedComponents[i].getReferences().length;j++){
                            let reference = codedComponents[i].getReferences()[j];
                            if(reference.structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key){
                                return new StructureReference(
                                    reference.structureType,
                                    reference.agencyId,
                                    reference.id,
                                    reference.version,
                                )
                            }
                        }
                    }
                }
            }
        }
        
        return {};
    };
    
    //Check whether a KeyValue exists as a coded component in the provided dsd
    componentExistsAndItsCodedInDSD(componentId){
        let codedComponents = this.getDimensionsAndAttributes()
        if(codedComponents && Array.isArray(codedComponents)){
            for (let i=0;i<codedComponents.length;i++){
                if(codedComponents[i].getId() && codedComponents[i].getId() === componentId){
                    if(codedComponents[i].getReferences() && Array.isArray(codedComponents[i].getReferences())){
                        for (let j=0;j<codedComponents[i].getReferences().length;j++){
                            let reference = codedComponents[i].getReferences()[j];
                            if(reference.structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key){
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    };

    getConceptObjectOfMeasureDimension(workspace){
        //get measure dimension
        let measureDimension = this.getMeasureDimension()
        if(!measureDimension){
            return null;
        }

        //get concept scheme from measure dimension
        let conceptSchemeRef = measureDimension.getReferences().find(ref => ref.getStructureType() === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key)
        if(!conceptSchemeRef){
            return null;
        }
        
        let conceptSchemeObj = workspace.getSdmxObject(conceptSchemeRef) 
        
        return conceptSchemeObj;
    }

    getRandomDimension(){
        let dimensions = this.getDimensions()
        if(dimensions.length === 0){
            return null;
        }
        let randomIndex = Math.floor(Math.random() * dimensions.length);
		return dimensions[randomIndex];
    }

    getComponentsWithFacets(){
        return this.getComponents().filter(comp=> 
            (comp.getRepresentation()) 
            && comp.getRepresentation().getType() === COMPONENTS_REPRESENTATION_NAMES.TEXT_FORMAT
            && (comp.getRepresentation().getMinLength() 
                || comp.getRepresentation().getMaxLength() 
                || comp.getRepresentation().getMinValue() 
                || comp.getRepresentation().getMaxValue() 
                || comp.getRepresentation().getDecimals()
                || comp.getRepresentation().getPattern()))
    }
    getEnumeratedComponents(){
        return this.getComponents().filter(function(comp){
            return comp.getReferences().some(ref=>ref.getStructureType() === SDMX_STRUCTURE_TYPE.CODE_LIST.key)
        })
    }
    getDimensions(){
       return  this.getComponents().filter(
            component => (component.getType() === DSD_COMPONENTS_NAMES.DIMENSION));
    }
    getAttributes(){
        return  this.getComponents().filter(
            component => (component.getType() === DSD_COMPONENTS_NAMES.ATTRIBUTE));
    }
    getMandatoryAttributes(){
        return this.getAttributes().filter(component=>(component.getAssignementStatus()===ATTRIBUTE_ASSIGNMENT_STATUS.MANDATORY))
    }
    getDimensionsAndAttributes(){
        return  this.getComponents().filter(
            component => (component.getType() === DSD_COMPONENTS_NAMES.DIMENSION || component.getType() === DSD_COMPONENTS_NAMES.ATTRIBUTE));
    }
    getTimeDimension(){
        return this.getComponents().find(
            component => (component.getType() === DSD_COMPONENTS_NAMES.TIME_DIMENSION));
    }
    getMeasureDimension(){
        return this.getComponents().find(
            component => (component.getType() === DSD_COMPONENTS_NAMES.MEASURE_DIMENSION));
    }
    getPrimaryMeasure(){
        return this.getComponents().find(
            component => (component.getType() === DSD_COMPONENTS_NAMES.PRIMARY_MEASURE)); 
    }
    hasMeasureDimension(){
        return this.getComponents().some(comp=>comp.getType() === DSD_COMPONENTS_NAMES.PRIMARY_MEASURE)
    }
    hasTimeDimension(){
        return this.getComponents().some(comp=>comp.getType() === DSD_COMPONENTS_NAMES.TIME_DIMENSION)
    }

    sortRandomKeyAccordingToDimensions(randomKeys){
        if(!randomKeys || typeof randomKeys !== 'object'){
            throw new Error("Missing mandatory parameter 'randomKey'")
        }
        if(!Object.keys(randomKeys).every(key => this.getDimensions().some(dim => dim.getId() === key))){
            throw new Error("Unable to sort randomKey because it does not contain all DSD dimensions.")
        }
        let dimensions = this.getDimensions();
        let sortedKeys = {}
        dimensions.forEach(dimension => {
            sortedKeys[dimension.getId()] = randomKeys[dimension.getId()]
        });
        return sortedKeys;
    }
};

module.exports = DataStructureObject;