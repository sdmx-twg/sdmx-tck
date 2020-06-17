var isDefined = require('../utils/Utils').isDefined;
var DataStructureComponentObject = require('./DataStructureComponentObject');
var SdmxSchemaObjects = require('./SdmxSchemaObjects.js')
const XSD_DATA_TYPE  = require('../constants/XSDRepresentationDataType').XSD_DATA_TYPE;

class XSDComplexType {
    constructor(props,compositors,attributes,anyAttributes) {
       this.name = props.$.name;
       this.isAbstract = (props.$.abstract) ? true:false;
       this.restrictionBase =  props.complexContent[0].restriction[0].$.base;
       
       //sequence & choice
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
    hasAttribute(attrName,attrType,attrUse){
        if(this.getAttributes().filter(attr=>attr.getName()===attrName && attr.getType() === attrType && attr.getUse()===attrUse).length === 0){
            return false;
        }
        return true
    }
    hasStructComponentAsAttribute(componentObj,sdmxObjects,usage){
        if(!componentObj || !componentObj instanceof DataStructureComponentObject){
            throw new Error("Missing Component Object.")
        }
        if(!sdmxObjects || !sdmxObjects instanceof SdmxSchemaObjects){
            throw new Error("Missing schema workspace object.")
        }
        let attrId = (componentObj.getId()) ? componentObj.getId() : componentObj.getReferences().filter(ref=>ref.getStructureType() === "CONCEPT_SCHEME")[0].getId()
        
        let selectedAttribute = this.getAttributes().filter(function(attr){
            let nameExpression = attr.getName() === attrId;
            let typeExrepssion = (sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && attr.getType() === sdmxObjects.getXSDSimpleTypeByName(attr.getType()).getName() 
            || !sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && (componentObj.getRepresentation()) && attr.getType() === XSD_DATA_TYPE.getMapping(componentObj.getRepresentation().getTextType()))
            
            let usageExpression = attr.getUse()===usage
            return nameExpression && typeExrepssion && usageExpression
        })
        if(selectedAttribute.length === 0){
            return false
        }
        return true;
    }
    
};

module.exports = XSDComplexType;