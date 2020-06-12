var SdmxV21JsonForStubsParser = require('./parsers/SdmxV21JsonForStubsParser.js');
var SdmxV21JsonItemsParser = require('./parsers/SdmxV21JsonItemsParser.js');
var SdmxV21JsonParser = require('./parsers/SdmxV21JsonParser.js');
var SdmxV21StructureReferencesParser = require('./parsers/SdmxV21StructureReferencesParser.js');
var SdmxV21JsonCubeRegionParser = require('./parsers/SdmxV21JsonCubeRegionParser.js');
var SdmxV21JsonDataKeySetParser = require('./parsers/SdmxV21JsonDataKeySetParser.js');
var SdmxV21ConstraintKeyValueParser = require('./parsers/SdmxV21ConstraintKeyValueParser.js');
var SdmxXmlParser = require('./parsers/SdmxXmlParser.js');
var SdmxV21JsonDsdComponentParser = require('./parsers/SdmxV21JsonDsdComponentParser.js')
var SdmxV21StructuresParser = require('./parsers/SdmxV21StructuresParser.js')
var SdmxV21SchemasParser = require('./parsers/SdmxV21SchemasParser.js')
var SdmxV21SchemaEnumerationParser = require('./parsers/SdmxV21SchemaEnumerationParser.js')
var SdmxV21SchemaFacetsParser = require('./parsers/SdmxV21SchemaFacetsParser.js')
var SdmxV21SchemaCompositorsParser = require('./parsers/SdmxV21SchemaCompositorsParser.js')
var SdmxV21SchemaLocalOrReferenceElementParser = require('./parsers/SdmxV21SchemaLocalOrReferenceElementParser.js')
var SdmxV21SchemaAttributeParser = require('./parsers/SdmxV21SchemaAttributeParser.js')
var SdmxV21JsonDsdAttributeRelationshipParser = require('./parsers/SdmxV21JsonDsdAttributeRelationshipParser.js')
var SdmxV21JsonDsdComponentRepresentationParser = require('./parsers/SdmxV21JsonDsdComponentRepresentationParser.js')
var SdmxV21DsdGroupParsers = require('./parsers/SdmxV21DsdGroupParsers.js')

module.exports = {
    parsers: {
        SdmxV21JsonForStubsParser: SdmxV21JsonForStubsParser,
        SdmxV21JsonItemsParser: SdmxV21JsonItemsParser,
        SdmxV21JsonParser: SdmxV21JsonParser,
        SdmxV21StructuresParser:SdmxV21StructuresParser,
        SdmxV21SchemasParser:SdmxV21SchemasParser,
        SdmxV21SchemaEnumerationParser:SdmxV21SchemaEnumerationParser,
        SdmxV21SchemaFacetsParser:SdmxV21SchemaFacetsParser,
        SdmxV21SchemaCompositorsParser:SdmxV21SchemaCompositorsParser,
        SdmxV21SchemaLocalOrReferenceElementParser:SdmxV21SchemaLocalOrReferenceElementParser,
        SdmxV21SchemaAttributeParser:SdmxV21SchemaAttributeParser,
        SdmxV21StructureReferencesParser: SdmxV21StructureReferencesParser,
        SdmxV21JsonCubeRegionParser: SdmxV21JsonCubeRegionParser,
        SdmxV21JsonDataKeySetParser:SdmxV21JsonDataKeySetParser,
        SdmxV21ConstraintKeyValueParser:SdmxV21ConstraintKeyValueParser,
        SdmxV21JsonDsdComponentParser: SdmxV21JsonDsdComponentParser,
        SdmxV21DsdGroupParsers:SdmxV21DsdGroupParsers,
        SdmxV21JsonDsdAttributeRelationshipParser:SdmxV21JsonDsdAttributeRelationshipParser,
        SdmxV21JsonDsdComponentRepresentationParser:SdmxV21JsonDsdComponentRepresentationParser,
        SdmxXmlParser: SdmxXmlParser
    }
};