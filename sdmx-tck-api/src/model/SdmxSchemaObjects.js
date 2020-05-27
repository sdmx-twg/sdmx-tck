var SdmxObjects = require('./SdmxObjects.js')
const XSD_COMPONENTS_TYPES = require('../constants/SdmxXSDComponentsTypes.js').XSD_COMPONENTS_TYPES

class SdmxSchemaObjects extends SdmxObjects{
    constructor(sdmxObjects){
        super(sdmxObjects)
    }
    
    //Returns an array containing the XSD components of choice from workspace.
    getXSDComponentByType(componentType){
        return this.getSdmxObjects().get(componentType);
    }

    //Returns an array containing the XSD SimpleTypes from workspace, with an enumeration as representation.
    getSimpleTypesWithEnums(){
        return this.getSdmxObjects().get(XSD_COMPONENTS_TYPES.SIMPLE_TYPE).
                    filter(simpleType=>(simpleType.getEnumerations().length > 0));
    }

    //Returns an array containing the XSD SimpleTypes from workspace, with a facet as representation.
    getSimpleTypesWithFacets(){
        return this.getSdmxObjects().get(XSD_COMPONENTS_TYPES.SIMPLE_TYPE).
                    filter(simpleType=>(simpleType.getSchemaFacets().length > 0));
    }

    //Returns an array containing the XSD SimpleTypes from workspace, without facet or enumerations as representation.
    getSimpleTypesWithDataTypeRestrictionOnly(){
        return this.getSdmxObjects().get(XSD_COMPONENTS_TYPES.SIMPLE_TYPE).
                    filter(simpleType=>(simpleType.getEnumerations().length === 0 && simpleType.getSchemaFacets().length === 0));
    }
}

module.exports = SdmxSchemaObjects;