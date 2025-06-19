var SdmxV21StructuresParser = require('./structure-queries-parsers/SdmxV21StructuresParser.js');
var SdmxV30StructuresParser = require('./structure-queries-parsers/SdmxV30StructuresParser.js');
var SdmxV21DataParser = require('./data-queries-parsers/SdmxV21DataParser.js');
var SdmxV30DataParser = require('./data-queries-parsers/SdmxV30DataParser.js');
const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;

class SdmxJsonParserFactory {

    static getStructureParser(apiVersion){
        if(API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]){
            return SdmxV30StructuresParser;
        }
        return SdmxV21StructuresParser;
    }

    static getDataParser(apiVersion){
        if(API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]){
            return SdmxV30DataParser;
        }
        return SdmxV21DataParser;
    }
};

module.exports = SdmxJsonParserFactory;