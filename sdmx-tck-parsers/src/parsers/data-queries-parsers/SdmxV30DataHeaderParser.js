var SdmxXmlV30StructureReferencesParser = require('../structure-queries-parsers/SdmxXmlV30StructureReferencesParser.js');
var HeaderStructureObject = require('sdmx-tck-api').model.HeaderStructureObject;

class SdmxV30DataHeaderParser {
    static getStructureData(sdmxJsonObject) {
        let structureData = [];
        if (sdmxJsonObject.Structure) {
            for (let i in sdmxJsonObject.Structure) {
                let refs = SdmxXmlV30StructureReferencesParser.getReferences(sdmxJsonObject.Structure[i]);
                structureData.push(new HeaderStructureObject(refs));
            }
        }
        return structureData;
    }
}
module.exports = SdmxV30DataHeaderParser;