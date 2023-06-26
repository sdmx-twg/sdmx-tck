var SdmxV21StructuresParser = require('./structure-queries-parsers/SdmxV21StructuresParser.js');
var SdmxV21SchemasParser = require('./schema-queries-parsers/SdmxV21SchemasParser.js')
var SdmxV21DataParser = require('./data-queries-parsers/SdmxV21DataParser.js')

class SdmxV21JsonParser {
    static parse(result){
        if(result.Structure){
            return SdmxV21StructuresParser.parseStructures(result);
        }
        else if(result.schema){
            return SdmxV21SchemasParser.parseXSD(result);
        }
        else if(result.StructureSpecificData){            
            return SdmxV21DataParser.parseData(result);
        }
    }
};

module.exports = SdmxV21JsonParser;