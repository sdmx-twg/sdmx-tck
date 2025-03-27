
var SdmxV21SchemasParser = require('./schema-queries-parsers/SdmxV21SchemasParser.js')
var SdmxJsonParserFactory = require('./SdmxJsonParserFactory.js');

class SdmxIntenalJsonParser {
    static parse(result, apiVersion) {
        if (result.Structure) {
            return SdmxJsonParserFactory.getStructureParser(apiVersion).parseStructures(result);
        } else if (result.schema) {
            return SdmxV21SchemasParser.parseXSD(result);
        } else if (result.StructureSpecificData) {
            return SdmxJsonParserFactory.getDataParser(apiVersion).parseData(result);
        }
    }
};

module.exports = SdmxIntenalJsonParser;