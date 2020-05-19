var SdmxObjects = require('./SdmxObjects.js')
const XSD_COMPONENTS_TYPES = require('../constants/SdmxXSDComponentsTypes.js').XSD_COMPONENTS_TYPES

class SdmxSchemaObjects extends SdmxObjects{
    constructor(sdmxObjects){
        super(sdmxObjects)
    }

    getXSDComponentByType(componentType){
        return this.getSdmxObjects().get(componentType);
    }

    getSimpleTypesWithEnums(){
        return this.getSdmxObjects().get(XSD_COMPONENTS_TYPES.SIMPLE_TYPE).
                    filter(simpleType=>(Array.isArray(simpleType.getEnumerations()) && simpleType.getEnumerations().length > 0));
    }
}

module.exports = SdmxSchemaObjects;