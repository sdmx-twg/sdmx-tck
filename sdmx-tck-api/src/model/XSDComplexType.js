var isDefined = require('../utils/Utils').isDefined;
var DataStructureComponentObject = require('./DataStructureComponentObject');
var SdmxSchemaObjects = require('./SdmxSchemaObjects.js')
const XSD_DATA_TYPE  = require('../constants/XSDRepresentationDataType').XSD_DATA_TYPE;

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
        let attribute = this.attributes.filter(attribute => attribute.getName() === attributeName);
        if(attribute.length > 0){
            return attribute[0]
        }
        return null;
    }
    hasAttribute(attrName,attrType,attrUse,fixedVal){
        if(!attrName){
            throw new Error("Missing parameter 'attrName'.")
        }
        if(!attrType){
            throw new Error("Missing parameter 'attrType'.")
        }
        let reqAttr = this.getAttributes().filter(function(attr){
            let expression = true;

            expression = expression && attr.getName() === attrName
            expression = expression && attr.getType() === attrType

            if(attrUse){
                expression = expression && attr.getUse() === attrUse
            }
            if(fixedVal){
                expression = expression && attr.getFixed() === fixedVal
            }
            return expression === true
        })
        if(reqAttr.length === 0){
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
        // let attrId = (componentObj.getId()) ? componentObj.getId() : componentObj.getReferences().filter(ref=>ref.getStructureType() === "CONCEPT_SCHEME")[0].getId()
        
        let selectedAttribute = this.getAttributes().filter(function(attr){
            let nameExpression = attr.getName() === attrName;
            let typeExpression = (sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && attr.getType() === sdmxObjects.getXSDSimpleTypeByName(attr.getType()).getName() 
            || !sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && (componentObj.getRepresentation()) && attr.getType() === XSD_DATA_TYPE.getMapping(componentObj.getRepresentation().getTextType()))
            
            let usageExpression = attr.getUse()===usage
            return nameExpression && typeExpression && usageExpression
        })
        if(selectedAttribute.length === 0){
            return false
        }
        return true;
    }
    
};

module.exports = XSDComplexType;