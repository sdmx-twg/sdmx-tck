class XSDSimpleType {
    constructor(props,schemaFacets,enumerations) {
       this.name = props.$.name;
       this.restrictionBase =  props.restriction[0].$.base;
       this.schemaFacets = schemaFacets;
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
    setSchemaFacets(schemaFacets){
        this.schemaFacets = schemaFacets;
    }
    getSchemaFacets(){
        return this.schemaFacets;
    }
    setEnumerations(enumerations){
        this.enumerations = enumerations
    }
    getEnumerations(){
        return this.enumerations;
    }
};

module.exports = XSDSimpleType;