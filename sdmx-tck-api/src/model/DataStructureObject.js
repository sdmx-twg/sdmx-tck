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
    //Return a reference from the codelist referenced by the chosen dimension.
    //If the codeList is not found it returns an empty obj
    getDimensionReferencedCodelist(selectedkeyValueId){
        for (let i=0;i<this.dimensions.length;i++){
            if(this.dimensions[i].dimensionId === selectedkeyValueId){
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

     //Find a KeyValue from a Cube Region that exists in the selected DSD's dimensions.
    findMatchingKeyValue(constraintCubeRegions){
        let keyValue;
        for(let i=0;i<constraintCubeRegions.length;i++){
            for(let j=0;j<constraintCubeRegions[i].KeyValue.length;j++){
                keyValue = constraintCubeRegions[i].KeyValue[j]
                let keyValFound  = this.keyValueExistsInDSD(keyValue.id);
                if(keyValFound){
                    return keyValue;
                }
            }
        }
        return {};
    }
    
    //Check whether a KeyValue exists as a dimension in the provided dsd
    keyValueExistsInDSD(selectedkeyValueId){
        for (let i=0;i<this.dimensions.length;i++){
            if(this.dimensions[i].dimensionId === selectedkeyValueId){
                return true;
            }
        }
        return false;
    };
};

module.exports = DataStructureObject;