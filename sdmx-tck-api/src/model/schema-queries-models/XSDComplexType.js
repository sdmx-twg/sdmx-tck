var DataStructureComponentObject = require('../structure-queries-models/DataStructureComponentObject');
var SdmxSchemaObjects = require('./SdmxSchemaObjects.js')
var SdmxStructureObjects = require('../structure-queries-models/SdmxStructureObjects.js')
const XSD_DATA_TYPE  = require('../../constants/schema-queries-constants/XSDRepresentationDataType').XSD_DATA_TYPE;
var SDMX_STRUCTURE_TYPE = require('../../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

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
    hasStructComponentAsAttribute(attrName,componentObj,sdmxObjects,usage,structureWorkspace){
        if(!componentObj || !componentObj instanceof DataStructureComponentObject){
            throw new Error("Missing Component Object.")
        }
        if(!sdmxObjects || !sdmxObjects instanceof SdmxSchemaObjects){
            throw new Error("Missing schema workspace object.")
        }
        var that = this;        
        let selectedAttribute = this.getAttributes().find(function(attr){
            let nameExpression = attr.getName() === attrName;
            let typeExpression = that.hasComplexTypeAttrValidType(attr,componentObj,sdmxObjects,structureWorkspace)
            let usageExpression = attr.getUse() === usage
            return nameExpression && typeExpression && usageExpression
        })
        if(!selectedAttribute){
            return false
        }
        return true;
    }
    
    hasComplexTypeAttrValidType(attr,componentObj,sdmxObjects,structureWorkspace){
        if(!componentObj || !componentObj instanceof DataStructureComponentObject){
            throw new Error("Missing Component Object.")
        }
        if(!sdmxObjects || !sdmxObjects instanceof SdmxSchemaObjects){
            throw new Error("Missing schema workspace object.")
        }
        if(!structureWorkspace || !structureWorkspace instanceof SdmxStructureObjects){
            throw new Error("Missing schema workspace object.")
        }
        let conceptSchemeRef = componentObj.getReferences().find(ref=> ref.getStructureType()=== SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key)
        let conceptSchemeObj = structureWorkspace.getSdmxObject(conceptSchemeRef)
        let concept = conceptSchemeObj.getItems().find(item=>item.getId() === componentObj.getId())

        /*
        The representation of a component is determined by the following precedence:
            1. The local representation defined by the component
            2. The core representation defined in the concept from which the component takes its semantic
            3. A default representation of an un-faceted text format with a data type of String.
        */
        if(!sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && (componentObj.getRepresentation())){
            return (attr.getType() === XSD_DATA_TYPE.getMapping(componentObj.getRepresentation().getTextType()))
        }else if (!sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && (concept.getRepresentation())){
            return (attr.getType() === XSD_DATA_TYPE.getMapping(concept.getRepresentation().getTextType()))
        }else if(!sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && (attr.getSimpleType())){
            return (attr.getType() === attr.getSimpleType().getName() || attr.getType() === attr.getSimpleType().getRestrictionBase())
        }else if (sdmxObjects.getXSDSimpleTypeByName(attr.getType())){
            return (attr.getType() === sdmxObjects.getXSDSimpleTypeByName(attr.getType()).getName())
        }else{
            return attr.getType()  === XSD_DATA_TYPE.STRING
        }

        // if(sdmxObjects.getXSDSimpleTypeByName(attr.getType())){
        //     return (attr.getType() === sdmxObjects.getXSDSimpleTypeByName(attr.getType()).getName())
        // }else if(!sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && (componentObj.getRepresentation())){
        //     return (attr.getType() === XSD_DATA_TYPE.getMapping(componentObj.getRepresentation().getTextType()))
        // }else{
        //    return XSD_DATA_TYPE.isXSDDataType(attr.getType())
        // }

        //console.log(XSD_DATA_TYPE.isXSDDataType(attr.getType()))
        //console.log((attr.getType() === XSD_DATA_TYPE.isXSDDataType(attr.getType())))
        // let typeExpression = (sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && attr.getType() === sdmxObjects.getXSDSimpleTypeByName(attr.getType()).getName() 
        // || !sdmxObjects.getXSDSimpleTypeByName(attr.getType()) && (componentObj.getRepresentation()) && attr.getType() === XSD_DATA_TYPE.getMapping(componentObj.getRepresentation().getTextType()))
        
    }
    
};

module.exports = XSDComplexType;