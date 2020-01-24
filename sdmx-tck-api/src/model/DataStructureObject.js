var MaintainableObject = require('./MaintainableObject.js');
var SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
var StructureReference = require('../model/StructureReference.js');


class DataStructureObject extends MaintainableObject {
    constructor(props, components, dimensions,children, detail) {
        super(SDMX_STRUCTURE_TYPE.DSD.key, props, children, detail);

        this.setDimensions(dimensions);
        this.setComponents(components);
    };
    setDimensions(dimensions){
        this.dimensions = dimensions;
    };
    getDimensions(){
        return this.dimensions;
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
        for (let i=0;i<this.dimensions.length;i++){
            if(this.dimensions[i].dimensionId === componentId){
                if(this.dimensions[i].dimensionReferences){
                    for(let j=0;j<this.dimensions[i].dimensionReferences.length;j++){
                        if(this.dimensions[i].dimensionReferences[j].structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key){
                            return new StructureReference(
                                this.dimensions[i].dimensionReferences[j].structureType,
                                this.dimensions[i].dimensionReferences[j].agencyId,
                                this.dimensions[i].dimensionReferences[j].id,
                                this.dimensions[i].dimensionReferences[j].version,
                            )
                        }
                    }
                }
            }
        }
        return {};
    };

    
    //Check whether a KeyValue exists as a dimension in the provided dsd
    componentExistsInDSD(componentId){
        for (let i=0;i<this.dimensions.length;i++){
            if(this.dimensions[i].dimensionId === componentId){
                return true;
            }
        }
        return false;
    };
};

module.exports = DataStructureObject;