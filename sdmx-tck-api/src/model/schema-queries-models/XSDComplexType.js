var DataStructureComponentObject = require('../structure-queries-models/DataStructureComponentObject');
var SdmxSchemaObjects = require('./SdmxSchemaObjects.js')
const XSD_DATA_TYPE  = require('../../constants/schema-queries-constants/XSDRepresentationDataType').XSD_DATA_TYPE;

class XSDComplexType {
    constructor(props,compositors,attributes,anyAttributes) {
       this.name = props.$.name;
       this.isAbstract = (props.$.abstract) ? true:false;
       this.restrictionBase =  props.complexContent[0].restriction[0].$.base;
       
       //sequences & choices
       this.compositors = compositors 
       this.attributes = attributes;
       this.anyAttributes = anyAttributes
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
    setAnyAttributes(anyAttributes){
        this.anyAttributes = anyAttributes;
    }
    getAnyAttributes(){
        return this.anyAttributes;
    }

    getAttributeByName(attributeName){
        if(!attributeName){
            return null;
        }
        let attribute = this.attributes.find(attribute => attribute.getName() === attributeName);
        if(attribute){
            return attribute
        }
        return null;
    }
    hasAttribute(attrName,attrType,attrUse,fixedVal){
        if(!attrName && !attrType && !attrUse && !fixedVal){
            return false;
        }
        let reqAttr = this.getAttributes().find(function(attr){
            let expression = true;
            if(attrName){
                expression = expression && attr.getName() === attrName
            }
            if(attrType){
                expression = expression && attr.getType() === attrType
            }
            if(attrUse){
                expression = expression && attr.getUse() === attrUse
            }
            if(fixedVal){
                expression = expression && attr.getFixed() === fixedVal
            }
            return expression === true
        })
        if(!reqAttr){
            return false;
        }
        return true
    }
    hasStructComponentAsAttribute(attrName,componentObj,sdmxObjects,usage){
        if(!componentObj || !componentObj instanceof DataStructureComponentObject){
            throw new Error("Missing Component Object.")
        }
        if(!sdmxObjects || !sdmxObjects instanceof SdmxSchemaObjects){
            throw new Error("Missing schema workspace object.")
        }        
        let selectedAttribute = this.getAttributes().find(function(attr){
            let nameExpression = attr.getName() === attrName;
            let typeExpression = (sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && attr.getType() === sdmxObjects.getXSDSimpleTypeByName(attr.getType()).getName() 
            || !sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && (componentObj.getRepresentation()) && attr.getType() === XSD_DATA_TYPE.getMapping(componentObj.getRepresentation().getTextType()))
            
            let usageExpression = attr.getUse()===usage
            return nameExpression && typeExpression && usageExpression
        })
        if(!selectedAttribute){
            return false
        }
        return true;
    }
    
};

module.exports = XSDComplexType;