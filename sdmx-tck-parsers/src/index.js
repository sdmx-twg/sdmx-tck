var SdmxV21JsonForStubsParser = require('./parsers/SdmxV21JsonForStubsParser.js');
var SdmxV21JsonItemsParser = require('./parsers/SdmxV21JsonItemsParser.js');
var SdmxV21JsonParser = require('./parsers/SdmxV21JsonParser.js');
var SdmxV21StructureReferencesParser = require('./parsers/SdmxV21StructureReferencesParser.js');
var SdmxXmlParser = require('./parsers/SdmxXmlParser.js');

module.exports = {
    parsers: {
        SdmxV21JsonForStubsParser: SdmxV21JsonForStubsParser,
        SdmxV21JsonItemsParser: SdmxV21JsonItemsParser,
        SdmxV21JsonParser: SdmxV21JsonParser,
        SdmxV21StructureReferencesParser: SdmxV21StructureReferencesParser,
        SdmxXmlParser: SdmxXmlParser
    }
};