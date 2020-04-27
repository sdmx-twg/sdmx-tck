var SdmxV21JsonForStubsParser = require('./parsers/SdmxV21JsonForStubsParser.js');
var SdmxV21JsonItemsParser = require('./parsers/SdmxV21JsonItemsParser.js');
var SdmxV21JsonParser = require('./parsers/SdmxV21JsonParser.js');
var SdmxV21StructureReferencesParser = require('./parsers/SdmxV21StructureReferencesParser.js');
var SdmxV21JsonCubeRegionParser = require('./parsers/SdmxV21JsonCubeRegionParser.js')
var SdmxV21JsonDataKeySetParser = require('./parsers/SdmxV21JsonDataKeySetParser.js');
var SdmxXmlParser = require('./parsers/SdmxXmlParser.js');
var SdmxV21JsonDsdComponentParser = require('./parsers/SdmxV21JsonDsdComponentParser.js')
var SdmxV21StructuresParser = require('./parsers/SdmxV21StructuresParser.js')
var SdmxV21SchemasParser = require('./parsers/SdmxV21SchemasParser.js')


module.exports = {
    parsers: {
        SdmxV21JsonForStubsParser: SdmxV21JsonForStubsParser,
        SdmxV21JsonItemsParser: SdmxV21JsonItemsParser,
        SdmxV21JsonParser: SdmxV21JsonParser,
        SdmxV21StructuresParser:SdmxV21StructuresParser,
        SdmxV21SchemasParser:SdmxV21SchemasParser,
        SdmxV21StructureReferencesParser: SdmxV21StructureReferencesParser,
        SdmxV21JsonCubeRegionParser: SdmxV21JsonCubeRegionParser,
        SdmxV21JsonDataKeySetParser:SdmxV21JsonDataKeySetParser,
        SdmxV21JsonDsdComponentParser: SdmxV21JsonDsdComponentParser,
        SdmxXmlParser: SdmxXmlParser
    }
};