var SdmxV21StructuresParser = require('./SdmxV21StructuresParser.js');
var SdmxV21SchemasParser = require('./SdmxV21SchemasParser.js')

class SdmxV21JsonParser {
    static parse(result){
        if(result.Structure){
            return SdmxV21StructuresParser.parseStructures(result);
        }
        else if(result.schema){
            console.log("HERE")
            return SdmxV21SchemasParser.parseXSD(result);
        }
    }
};

module.exports = SdmxV21JsonParser;