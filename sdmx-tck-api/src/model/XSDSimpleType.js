var isDefined = require('../utils/Utils').isDefined;

class XSDSimpleType {
    constructor(props,schemaFacet,enumerations) {
       this.name = props.$.name;
       this.restrictionBase =  props.restriction[0].$.base;
       this.schemaFacet = schemaFacet;
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
    setSchemaFacet(schemaFacet){
        this.schemaFacet = schemaFacet;
    }
    getSchemaFacet(){
        return this.schemaFacet;
    }
    setEnumerations(enumerations){
        this.enumerations = enumerations
    }
    getEnumerations(){
        return this.enumerations;
    }
};

module.exports = XSDSimpleType;