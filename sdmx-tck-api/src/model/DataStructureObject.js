var MaintainableObject = require('./MaintainableObject.js');
var SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
var StructureReference = require('../model/StructureReference.js');
const DSD_COMPONENTS_NAMES = require('../constants/DSDComponents.js').DSD_COMPONENTS_NAMES;


class DataStructureObject extends MaintainableObject {
    constructor(props, components,children, detail) {
        super(SDMX_STRUCTURE_TYPE.DSD.key, props, children, detail);

        this.setComponents(components);
    };
   
    setComponents(components) {
        this.components = components;
    };
    getComponents() {
        return this.components;
    }

    //Return a reference from the codelist referenced by the chosen component.
    //If the codeList is not found it returns an empty obj
    getReferencedCodelistInComponent(componentId){
        let codedComponents = this.getComponents().filter(
            component => (component.getType() === DSD_COMPONENTS_NAMES.DIMENSION || component.getType() === DSD_COMPONENTS_NAMES.ATTRIBUTE));

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
        let codedComponents = this.getComponents().filter(
            component => (component.getType() === DSD_COMPONENTS_NAMES.DIMENSION || component.getType() === DSD_COMPONENTS_NAMES.ATTRIBUTE));

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
};

module.exports = DataStructureObject;