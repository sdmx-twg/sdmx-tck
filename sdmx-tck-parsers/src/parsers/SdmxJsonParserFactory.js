var SdmxV21StructuresParser = require('./structure-queries-parsers/SdmxV21StructuresParser.js');
var SdmxV30StructuresParser = require('./structure-queries-parsers/SdmxV30StructuresParser.js');
const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;

class SdmxJsonParserFactory {

    static getParser(apiVersion){
        if(API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]){
            return SdmxV30StructuresParser;
        }
        return SdmxV21StructuresParser;
    }
};

module.exports = SdmxJsonParserFactory;