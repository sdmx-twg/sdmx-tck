var SdmxStructureObjects = require('./structure-queries-models/SdmxStructureObjects.js')
var SdmxSchemaObjects = require('./schema-queries-models/SdmxSchemaObjects.js')
class SdmxObjectsFactory {

    static getWorkspace(sdmxObjects,sdmxJsonObject){
        if(sdmxJsonObject.Structure){
            return new SdmxStructureObjects(sdmxObjects)
        }else if(sdmxJsonObject.schema){
            return new SdmxSchemaObjects(sdmxObjects)
        }
    }
}
module.exports = SdmxObjectsFactory;