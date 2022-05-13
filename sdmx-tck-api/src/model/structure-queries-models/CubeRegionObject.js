var isDefined = require('../../utils/Utils').isDefined;

class CubeRegionObject {
    constructor(props,keyValue) {
        this.includeType = (props.$ && props.$.include) ? props.$.include : "true";
        this.keyValue = keyValue
    };
    setKeyValues(keyValue){
        this.keyValue = keyValue;
    }
    getKeyValues(){
        return this.keyValue;
    };
    setIncludeValue(includeType) {
        this.includeType = includeType;
    };
    getIncludeValue() {
        return this.includeType;
    };
    
    getKeyValueById(id){
        if(!id){return;}
        return this.getKeyValues().find(keyVal=>keyVal.getId() === id)
    }

    equals(otherCubeRegion){
        if(!otherCubeRegion || !otherCubeRegion instanceof CubeRegionObject){return false;}
        return this.getKeyValues().every(keyVal =>{
            let otherKeyValue = otherCubeRegion.getKeyValueById(keyVal.getId())
            if(!otherKeyValue){return false;}
            return keyVal.equals(otherKeyValue);
        })
    }
   
};

module.exports = CubeRegionObject;