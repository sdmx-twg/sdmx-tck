var SdmxV21JsonForStubsParser = require('./parsers/structure-queries-parsers/SdmxV21JsonForStubsParser.js');
var SdmxV21JsonItemsParser = require('./parsers/structure-queries-parsers/SdmxV21JsonItemsParser.js');
var SdmxV21JsonParser = require('./parsers/SdmxV21JsonParser.js');
var SdmxV21StructureReferencesParser = require('./parsers/structure-queries-parsers/SdmxV21StructureReferencesParser.js');
var SdmxV21JsonCubeRegionParser = require('./parsers/structure-queries-parsers/SdmxV21JsonCubeRegionParser.js');
var SdmxV21JsonDataKeySetParser = require('./parsers/structure-queries-parsers/SdmxV21JsonDataKeySetParser.js');
var SdmxV21ConstraintKeyValueParser = require('./parsers/structure-queries-parsers/SdmxV21ConstraintKeyValueParser.js');
var SdmxV21JsonReferencePeriodParser = require('./parsers/structure-queries-parsers/SdmxV21JsonReferencePeriodParser.js')
var SdmxV21JsonAnnotationParser = require('./parsers/structure-queries-parsers/SdmxV21JsonAnnotationParser.js')
var SdmxXmlParser = require('./parsers/SdmxXmlParser.js');
var SdmxV21JsonDsdComponentParser = require('./parsers/structure-queries-parsers/SdmxV21JsonDsdComponentParser.js')
var SdmxV21StructuresParser = require('./parsers/structure-queries-parsers/SdmxV21StructuresParser.js')
var SdmxV21SchemasParser = require('./parsers/schema-queries-parsers/SdmxV21SchemasParser.js')
var SdmxV21SchemaEnumerationParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaEnumerationParser.js')
var SdmxV21SchemaFacetsParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaFacetsParser.js')
var SdmxV21SchemaCompositorsParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaCompositorsParser.js')
var SdmxV21SchemaLocalOrReferenceElementParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaLocalOrReferenceElementParser.js')
var SdmxV21SchemaAttributeParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaAttributeParser.js')
var SdmxV21JsonDsdAttributeRelationshipParser = require('./parsers/structure-queries-parsers/SdmxV21JsonDsdAttributeRelationshipParser.js')
var SdmxV21JsonComponentRepresentationParser = require('./parsers/structure-queries-parsers/SdmxV21JsonComponentRepresentationParser.js')
var SdmxV21DsdGroupParsers = require('./parsers/structure-queries-parsers/SdmxV21DsdGroupParsers.js')
var SdmxV21DatasetParser = require('./parsers/data-queries-parsers/SdmxV21DatasetParser.js')
var SdmxV21DatasetComponentsAttributesParser = require('./parsers/data-queries-parsers/SdmxV21DatasetComponentsAttributesParser.js')

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
        SdmxV21JsonReferencePeriodParser:SdmxV21JsonReferencePeriodParser,
        SdmxV21JsonAnnotationParser:SdmxV21JsonAnnotationParser,
        SdmxV21JsonDsdComponentParser: SdmxV21JsonDsdComponentParser,
        SdmxV21DsdGroupParsers:SdmxV21DsdGroupParsers,
        SdmxV21JsonDsdAttributeRelationshipParser:SdmxV21JsonDsdAttributeRelationshipParser,
        SdmxV21JsonComponentRepresentationParser:SdmxV21JsonComponentRepresentationParser,
        SdmxV21DatasetParser:SdmxV21DatasetParser,
        SdmxV21DatasetComponentsAttributesParser:SdmxV21DatasetComponentsAttributesParser,
        SdmxXmlParser: SdmxXmlParser
    }
};