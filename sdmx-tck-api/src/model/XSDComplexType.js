var isDefined = require('../utils/Utils').isDefined;

class XSDComplexType {
    constructor(props,compositors,attributes) {
       this.name = props.$.name;
       this.isAbstract = (props.$.abstract) ? true:false;
       this.restrictionBase =  props.complexContent[0].restriction[0].$.base;
       
       //sequence & choice
       this.compositors = compositors 
       this.attributes = attributes;
    };
    
    setName(name){
        this.name = name;
    }
    getName(){
        return this.name;
    }
    setIsAbstract(isAbstract){
        this.isAbstract = isAbstract;
    }
    getIsAbstract(){
        return this.isAbstract;
    }
    setRestrictionBase(restrictionBase){
        this.restrictionBase = restrictionBase;
    }
    getRestrictionBase(){
        return this.restrictionBase;
    }
    setCompositors(compositors){
        this.compositors = compositors
    }
    getCompositors(){
        return this.compositors;
    }
    setAttributes(attributes){
        this.attributes = attributes
    }
    getAttributes(){
        return this.attributes;
    }

    getAttributeByName(attributeName){
        if(!attributeName){
            return null;
        }
        let attribute = this.attributes.filter(attribute => attribute.getName() === attributeName);
        if(attribute.length > 0){
            return attribute[0]
        }
        return null;
    }
};

module.exports = XSDComplexType;