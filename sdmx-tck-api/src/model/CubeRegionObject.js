var isDefined = require('../utils/Utils').isDefined;

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
    
   
};

module.exports = CubeRegionObject;