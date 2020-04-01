var MaintainableObject = require('./MaintainableObject.js');
var SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
var StructureReference = require('../model/StructureReference.js');


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
        let codedComponents = this.components.Dimensions.concat(this.components.Attributes)
        if(codedComponents && Array.isArray(codedComponents)){
            for (let i=0;i<codedComponents.length;i++){
                if(codedComponents[i].componentId && codedComponents[i].componentId === componentId){
                    if(codedComponents[i].componentReferences && Array.isArray(codedComponents[i].componentReferences)){
                        for(let j=0;j<codedComponents[i].componentReferences.length;j++){
                            if(codedComponents[i].componentReferences[j].structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key){
                                return new StructureReference(
                                    codedComponents[i].componentReferences[j].structureType,
                                    codedComponents[i].componentReferences[j].agencyId,
                                    codedComponents[i].componentReferences[j].id,
                                    codedComponents[i].componentReferences[j].version,
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
        let codedComponents = this.components.Dimensions.concat(this.components.Attributes)
        if(codedComponents && Array.isArray(codedComponents)){
            for (let i=0;i<codedComponents.length;i++){
                if(codedComponents[i].componentId && codedComponents[i].componentId === componentId){
                    if(codedComponents[i].componentReferences && Array.isArray(codedComponents[i].componentReferences)){
                        for (let j=0;j<codedComponents[i].componentReferences.length;j++){
                            if(codedComponents[i].componentReferences[j].structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key){
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