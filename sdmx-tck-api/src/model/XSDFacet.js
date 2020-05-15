var isDefined = require('../utils/Utils').isDefined;

class XSDFacet {
    constructor(props,type) {
       this.type = type;
       this.value = props.$.value;
    };
    
    setType(type){
        this.type = type;
    }
    getType(){
        return this.type;
    }
    setValue(value){
        this.value = value;
    }
    getValue(){
        return this.value;
    }
};

module.exports = XSDFacet;