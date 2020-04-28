var isDefined = require('../utils/Utils').isDefined;

class XSDSimpleType {
    constructor(props,enumerations) {
       this.name = props.$.name;
       this.restrictionBase =  props.restriction[0].$.base;
       this.enumerations = enumerations;
    };
    
    setName(name){
        this.name = name;
    }
    getName(){
        return this.name;
    }
    setRestrictionBase(restrictionBase){
        this.restrictionBase = restrictionBase;
    }
    getRestrictionBase(){
        return this.restrictionBase;
    }
    setEnumerations(enumerations){
        this.enumerations = enumerations
    }
    getEnumerations(){
        return this.enumerations;
    }
};

module.exports = XSDSimpleType;