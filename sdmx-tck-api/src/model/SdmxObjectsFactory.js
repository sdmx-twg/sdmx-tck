var SdmxStructureObjects = require('./structure-queries-models/SdmxStructureObjects.js')
var SdmxSchemaObjects = require('./schema-queries-models/SdmxSchemaObjects.js')
var SdmxDataObjects = require('./data-queries-models/SdmxDataObjects.js')
class SdmxObjectsFactory {

    static getWorkspace(sdmxObjects,sdmxJsonObject){
        if(sdmxJsonObject.Structure){
            return new SdmxStructureObjects(sdmxObjects)
        }else if(sdmxJsonObject.schema){
            return new SdmxSchemaObjects(sdmxObjects)
        }else if(sdmxJsonObject.StructureSpecificData){
            return new SdmxDataObjects(sdmxObjects)
        }
    }
}
module.exports = SdmxObjectsFactory;