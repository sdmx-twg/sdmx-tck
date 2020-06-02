var MaintainableObject = require('./MaintainableObject.js');
const SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

class ConstraintKeyValueObject {
    constructor(props,origin,includeType, values) {
        this.id = props.$.id;
        //origin property stores the info about whether the keyValue belongs to cubeRegion or DataKeySet
        this.origin = origin; 
        this.includeType = includeType
        this.values = values
        
    };
    setId(id){
        this.id=id;
    }
    getId(){
        return this.id;
    }
    setOrigin(origin){
        this.origin = origin
    }
    getOrigin(){
        return this.origin
    }
    setIncludeType(includeType){
        this.includeType = includeType
    }
    getIncludeType(){
        return this.includeType
    }
    setValues(values){
        this.values = values;
    }
    getValues(){
        return this.values
    }
    
};

module.exports = ConstraintKeyValueObject;