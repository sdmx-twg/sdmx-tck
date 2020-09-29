var SdmxObjects = require('./SdmxObjects.js')
const XSD_COMPONENTS_TYPES = require('../constants/schema-queries-constants/SdmxXSDComponentsTypes.js').XSD_COMPONENTS_TYPES


class SdmxSchemaObjects extends SdmxObjects{
    constructor(sdmxObjects){
        super(sdmxObjects)
    }
    
    //Returns an array containing the XSD complex types from workspace.
    getXSDComplexTypes(){
        return this.getSdmxObjects().get(XSD_COMPONENTS_TYPES.COMPLEX_TYPE);
    }
    //Returns an array containing the XSD global elements from workspace.
    getXSDGlobalElements(){
        return this.getSdmxObjects().get(XSD_COMPONENTS_TYPES.GLOBAL_ELEMENT);
    }
    //Returns an array containing the XSD simple types from workspace.
    getXSDSimpleTypes(){
        return this.getSdmxObjects().get(XSD_COMPONENTS_TYPES.SIMPLE_TYPE);
    }

    //Returns an array containing the XSD SimpleTypes from workspace, with an enumeration as representation.
    getSimpleTypesWithEnums(){
        return this.getXSDSimpleTypes().filter(simpleType=>(simpleType.getEnumerations().length > 0));
    }

    //Returns an array containing the XSD SimpleTypes from workspace, with a facet as representation.
    getSimpleTypesWithFacets(){
        return this.getXSDSimpleTypes().filter(simpleType=>(simpleType.getSchemaFacets().length > 0));
    }

    //Returns an array containing the XSD SimpleTypes from workspace, without facet or enumerations as representation.
    getSimpleTypesWithDataTypeRestrictionOnly(){
        return this.getXSDSimpleTypes().filter(simpleType=>(simpleType.getEnumerations().length === 0 && simpleType.getSchemaFacets().length === 0));
    }
    
    getComplexTypeContainingSpecificAttribute(attributeName){
        if(!attributeName){
            throw new Error("Missing mandatory parameter 'attributeName'. ")
        }
        let complexType = this.getXSDComplexTypes().find(function(complexTypeObj) {
            let someAttribute = complexTypeObj.getAttributeByName(attributeName)
            if(someAttribute){
                return someAttribute.getName() === attributeName
            }
            return false;
        })
        if(!complexType){
            return null
        }
        return complexType;

    }
    getEnumeratedSimpleTypeOfComponent(componentId){
       if(!componentId){
           throw new Error("Missing mandatory parameter 'componentId'. ")
       }
        
        let complexType  = this.getComplexTypeContainingSpecificAttribute(componentId);
        if(!complexType){
            return null;
        }
        let attribute = complexType.getAttributeByName(componentId);
        if(!attribute){
            return null
        }
        let chosenSimpleType = this.getSimpleTypesWithEnums().find(simpleType => simpleType.getName() === attribute.getType())
        if(!chosenSimpleType){
            return null
        }
        return chosenSimpleType
    }

    getXSDSimpleTypeByName(simpleTypeName){
        let simpleType = this.getXSDSimpleTypes().find(simpleType => simpleType.getName() === simpleTypeName)
        if(simpleType){
            return simpleType
        }
        return null;
    }
    getXSDComplexTypeByName(complexTypeName){
        let complexType = this.getXSDComplexTypes().find(complexType => complexType.getName() === complexTypeName)
        if(complexType){
            return complexType
        }
        return null;
    }
    getXSDSimpleTypesWithEnumsCriteria(listOfValues){
        if(!listOfValues instanceof Array){
            throw new Error("Missing Mandatory parameter 'listOfValues'. ")
        }
        let requestedSimpleType = this.getSimpleTypesWithEnums().find(function(simpleType){
            return listOfValues.every(val=> simpleType.getEnumerations().indexOf(val)!==-1)
                     &&listOfValues.length === simpleType.getEnumerations().length;
        })
        if(!requestedSimpleType){
            return null
        }
        return requestedSimpleType;
    }
    getComplexTypeThatContainsAttribute(attributeName){
        if(!attributeName){
            throw new Error("Missing Mandatory parameter 'attributeName'. ")
        }
        let requestedComplexType = this.getXSDComplexTypes().find(function(complexType){
            return complexType.hasAttribute(attributeName)
        }) 
        if(!requestedComplexType){
            return null
        }
        return requestedComplexType;
    }
}

module.exports = SdmxSchemaObjects;