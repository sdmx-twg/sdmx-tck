var SdmxXmlV21StructureReferencesParser = require('../structure-queries-parsers/SdmxXmlV21StructureReferencesParser.js')
var HeaderStructureObject = require('sdmx-tck-api').model.HeaderStructureObject

class SdmxV21DataHeaderParser {
    static getStructureData(sdmxJsonObject) {
        let structureData = [];
        if (sdmxJsonObject.Structure) {
            for (let i in sdmxJsonObject.Structure) {
                let refs = SdmxXmlV21StructureReferencesParser.getReferences(sdmxJsonObject.Structure[i]);
                structureData.push(new HeaderStructureObject(refs));
            }
        }
        return structureData;
    }
}
module.exports = SdmxV21DataHeaderParser;