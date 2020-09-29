var SdmxV21StructuresParser = require('./structure-queries-parsers/SdmxV21StructuresParser.js');
var SdmxV21SchemasParser = require('./schema-queries-parsers/SdmxV21SchemasParser.js')

class SdmxV21JsonParser {
    static parse(result){
        if(result.Structure){
            return SdmxV21StructuresParser.parseStructures(result);
        }
        else if(result.schema){
            return SdmxV21SchemasParser.parseXSD(result);
        }
    }
};

module.exports = SdmxV21JsonParser;