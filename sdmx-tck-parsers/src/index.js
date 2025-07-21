var SdmxXmlV21ItemsParser = require('./parsers/structure-queries-parsers/SdmxXmlV21ItemsParser.js');
var SdmxParser = require('./parsers/SdmxParser.js');
var SdmxXmlParser = require('./parsers/SdmxXmlParser.js');
var SdmxJsonParser = require('./parsers/SdmxJsonParser.js');
var SdmxParserFactory = require('./parsers/SdmxParserFactory.js');
var SdmxXmlV30ItemsParser = require('./parsers/structure-queries-parsers/SdmxXmlV30ItemsParser.js');
var SdmxJsonV20ItemsParser = require('./parsers/structure-queries-parsers/SdmxJsonV20ItemsParser.js');

var SdmxXmlForStubsParser = require('./parsers/structure-queries-parsers/SdmxXmlForStubsParser.js');
var SdmxJsonV20ForStubsParser = require('./parsers/structure-queries-parsers/SdmxJsonV20ForStubsParser.js');

var SdmxJsonV20StructuresParser = require('./parsers/structure-queries-parsers/SdmxJsonV20StructuresParser.js');
var SdmxXmlV21StructuresParser = require('./parsers/structure-queries-parsers/SdmxXmlV21StructuresParser.js')
var SdmxXmlV30StructuresParser = require('./parsers/structure-queries-parsers/SdmxXmlV30StructuresParser.js');

var SdmxJsonV20AnnotationParser = require('./parsers/structure-queries-parsers/SdmxJsonV20AnnotationParser.js');
var SdmxXmlAnnotationParser = require('./parsers/structure-queries-parsers/SdmxXmlAnnotationParser.js');

var SdmxJsonV20RepresentationParser = require('./parsers/structure-queries-parsers/SdmxJsonV20RepresentationParser.js')
var SdmxXmlRepresentationParser = require('./parsers/structure-queries-parsers/SdmxXmlRepresentationParser.js')

var SdmxJsonV20AttributeRelationshipParser = require('./parsers/structure-queries-parsers/SdmxJsonV20AttributeRelationshipParser.js')
var SdmxXmlV21AttributeRelationshipParser = require('./parsers/structure-queries-parsers/SdmxXmlV21AttributeRelationshipParser.js')
var SdmxXmlV30AttributeRelationshipParser = require('./parsers/structure-queries-parsers/SdmxXmlV30AttributeRelationshipParser.js')

var SdmxJsonV20DsdComponentParser = require('./parsers/structure-queries-parsers/SdmxJsonV20DsdComponentParser.js')
var SdmxXmlV21DsdComponentParser = require('./parsers/structure-queries-parsers/SdmxXmlV21DsdComponentParser.js')
var SdmxXmlV30DsdComponentParser = require('./parsers/structure-queries-parsers/SdmxXmlV30DsdComponentParser.js');

var SdmxJsonV20DsdGroupParsers = require('./parsers/structure-queries-parsers/SdmxJsonV20DsdGroupParsers.js')
var SdmxXmlV21DsdGroupParsers = require('./parsers/structure-queries-parsers/SdmxXmlV21DsdGroupParsers.js')

var SdmxXmlV21ConstraintParser = require('./parsers/structure-queries-parsers/SdmxXmlV21ConstraintParser.js')
var SdmxJsonV20ConstraintParser = require('./parsers/structure-queries-parsers/SdmxJsonV20ConstraintParser.js');

var SdmxXmlV21StructureReferencesParser = require('./parsers/structure-queries-parsers/SdmxXmlV21StructureReferencesParser.js');
var SdmxXmlV30StructureReferencesParser = require('./parsers/structure-queries-parsers/SdmxXmlV30StructureReferencesParser.js');
var SdmxJsonV20StructureReferencesParser = require('./parsers/structure-queries-parsers/SdmxJsonV20StructureReferencesParser.js');

var SdmxV21SchemasParser = require('./parsers/schema-queries-parsers/SdmxV21SchemasParser.js')
var SdmxV21SchemaEnumerationParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaEnumerationParser.js')
var SdmxV21SchemaFacetsParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaFacetsParser.js')
var SdmxV21SchemaCompositorsParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaCompositorsParser.js')
var SdmxV21SchemaLocalOrReferenceElementParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaLocalOrReferenceElementParser.js')
var SdmxV21SchemaAttributeParser = require('./parsers/schema-queries-parsers/SdmxV21SchemaAttributeParser.js')

var SdmxJsonV20DsdGroupParsers = require('./parsers/structure-queries-parsers/SdmxJsonV20DsdGroupParsers.js')
var SdmxXmlV21DsdGroupParsers = require('./parsers/structure-queries-parsers/SdmxXmlV21DsdGroupParsers.js')
var SdmxXmlV30DsdGroupParsers = require('./parsers/structure-queries-parsers/SdmxXmlV30DsdGroupParsers.js')

var SdmxV21DatasetParser = require('./parsers/data-queries-parsers/SdmxV21DatasetParser.js')
var SdmxV21DatasetComponentsAttributesParser = require('./parsers/data-queries-parsers/SdmxV21DatasetComponentsAttributesParser.js')
var SdmxV21DataGroup = require('./parsers/data-queries-parsers/SdmxV21DataGroup.js')

module.exports = {
    parsers: {
        SdmxV21SchemasParser:SdmxV21SchemasParser,
        SdmxV21SchemaEnumerationParser:SdmxV21SchemaEnumerationParser,
        SdmxV21SchemaFacetsParser:SdmxV21SchemaFacetsParser,
        SdmxV21SchemaCompositorsParser:SdmxV21SchemaCompositorsParser,
        SdmxV21SchemaLocalOrReferenceElementParser:SdmxV21SchemaLocalOrReferenceElementParser,
        SdmxV21SchemaAttributeParser:SdmxV21SchemaAttributeParser,
        SdmxV21DatasetParser:SdmxV21DatasetParser,
        SdmxV21DatasetComponentsAttributesParser:SdmxV21DatasetComponentsAttributesParser,
        SdmxV21DataGroup:SdmxV21DataGroup,
        
        SdmxParser: SdmxParser,
        SdmxXmlParser: SdmxXmlParser,
        SdmxJsonParser: SdmxJsonParser,

        SdmxParserFactory: SdmxParserFactory,

        SdmxXmlV21DsdGroupParsers:SdmxXmlV21DsdGroupParsers,
        SdmxXmlV30DsdGroupParsers:SdmxXmlV30DsdGroupParsers,
        SdmxJsonV20DsdGroupParsers: SdmxJsonV20DsdGroupParsers,

        SdmxXmlV21ItemsParser: SdmxXmlV21ItemsParser,
        SdmxXmlV30ItemsParser: SdmxXmlV30ItemsParser,
        SdmxJsonV20ItemsParser: SdmxJsonV20ItemsParser,
        
        SdmxJsonV20ForStubsParser: SdmxJsonV20ForStubsParser,
        SdmxXmlForStubsParser: SdmxXmlForStubsParser,

        SdmxJsonV20StructuresParser: SdmxJsonV20StructuresParser,
        SdmxXmlV21StructuresParser: SdmxXmlV21StructuresParser,
        SdmxXmlV30StructuresParser: SdmxXmlV30StructuresParser,
        
        SdmxJsonV20AnnotationParser: SdmxJsonV20AnnotationParser,
        SdmxXmlAnnotationParser: SdmxXmlAnnotationParser,

        SdmxJsonV20RepresentationParser: SdmxJsonV20RepresentationParser,
        SdmxXmlRepresentationParser: SdmxXmlRepresentationParser,

        SdmxJsonV20AttributeRelationshipParser: SdmxJsonV20AttributeRelationshipParser,
        SdmxXmlV21AttributeRelationshipParser: SdmxXmlV21AttributeRelationshipParser,
        SdmxXmlV30AttributeRelationshipParser: SdmxXmlV30AttributeRelationshipParser,

        SdmxJsonV20DsdComponentParser: SdmxJsonV20DsdComponentParser,
        SdmxXmlV21DsdComponentParser: SdmxXmlV21DsdComponentParser,
        SdmxXmlV30DsdComponentParser: SdmxXmlV30DsdComponentParser,

        SdmxXmlV21DsdGroupParsers: SdmxXmlV21DsdGroupParsers,
        SdmxJsonV20DsdGroupParsers: SdmxJsonV20DsdGroupParsers,

        SdmxXmlV21ConstraintParser: SdmxXmlV21ConstraintParser,
        SdmxJsonV20ConstraintParser: SdmxJsonV20ConstraintParser,

        SdmxXmlV21StructureReferencesParser: SdmxXmlV21StructureReferencesParser,
        SdmxXmlV30StructureReferencesParser: SdmxXmlV30StructureReferencesParser,
        SdmxJsonV20StructureReferencesParser: SdmxJsonV20StructureReferencesParser
    }
};