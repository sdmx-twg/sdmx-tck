var SdmxJsonV20StructuresParser = require('./structure-queries-parsers/SdmxJsonV20StructuresParser.js');
var SdmxXmlV21StructuresParser = require('./structure-queries-parsers/SdmxXmlV21StructuresParser.js');
var SdmxXmlV30StructuresParser = require('./structure-queries-parsers/SdmxXmlV30StructuresParser.js');
var SdmxV21DataParser = require('./data-queries-parsers/SdmxV21DataParser.js');
var SdmxV30DataParser = require('./data-queries-parsers/SdmxV30DataParser.js');
var SdmxV21SchemasParser = require('./schema-queries-parsers/SdmxV21SchemasParser.js');
var SDMX_MESSAGE_FORMAT = require('sdmx-tck-api').constants.SDMX_MESSAGE_FORMAT;

class SdmxParserFactory {
    getParser(sdmxMessage, format) {
        if (this.isSchemaMessage(sdmxMessage)) {
            return SdmxV21SchemasParser;
        } else if (this.isDataMessage(sdmxMessage)) {
            if (format === SDMX_MESSAGE_FORMAT.XML_V300.key) {
                return SdmxV30DataParser;
            } else if (format === SDMX_MESSAGE_FORMAT.XML_V21.key) {
                return SdmxV21DataParser;
            }
        } else if (this.isStructureMessage(sdmxMessage)) {
            if (format === SDMX_MESSAGE_FORMAT.XML_V300.key) {
                return SdmxXmlV30StructuresParser;
            } else if (format === SDMX_MESSAGE_FORMAT.XML_V21.key) {
                return SdmxXmlV21StructuresParser;
            } else if (format === SDMX_MESSAGE_FORMAT.JSON_V200.key) {
                return SdmxJsonV20StructuresParser;
            }
        }
    }

    isStructureMessage(sdmxMessage) {
        if (sdmxMessage.Structure || sdmxMessage.RegistryInterface) {
            return true;
        }
        if (sdmxMessage.data) {
            if (sdmxMessage.data.dataStructures
                || sdmxMessage.data.metadataStructures
                || sdmxMessage.data.categorySchemes
                || sdmxMessage.data.conceptSchemes
                || sdmxMessage.data.codelists
                || sdmxMessage.data.geographicCodelists
                || sdmxMessage.data.geoGridCodelists
                || sdmxMessage.data.valueLists
                || sdmxMessage.data.hierarchies
                || sdmxMessage.data.hierarchyAssociations
                || sdmxMessage.data.agencySchemes
                || sdmxMessage.data.dataProviderSchemes
                || sdmxMessage.data.dataConsumerSchemes
                || sdmxMessage.data.metadataProviderSchemes
                || sdmxMessage.data.organisationUnitSchemes
                || sdmxMessage.data.dataflows
                || sdmxMessage.data.metadataflows
                || sdmxMessage.data.reportingTaxonomies
                || sdmxMessage.data.provisionAgreements
                || sdmxMessage.data.metadataProvisionAgreements
                || sdmxMessage.data.structureMaps
                || sdmxMessage.data.representationMaps
                || sdmxMessage.data.conceptSchemeMaps
                || sdmxMessage.data.categorySchemeMaps
                || sdmxMessage.data.organisationSchemeMaps
                || sdmxMessage.data.reportingTaxonomyMaps
                || sdmxMessage.data.processes
                || sdmxMessage.data.categorisations
                || sdmxMessage.data.dataConstraints
                || sdmxMessage.data.availabilityConstraints
                || sdmxMessage.data.metadataConstraints
                || sdmxMessage.data.customTypeSchemes
                || sdmxMessage.data.vtlMappingSchemes
                || sdmxMessage.data.namePersonalisationSchemes
                || sdmxMessage.data.rulesetSchemes
                || sdmxMessage.data.transformationSchemes
                || sdmxMessage.data.userDefinedOperatorSchemes) {
                return true;
            }
        }
        return false;
    }

    isDataMessage(sdmxMessage) {
        if (sdmxMessage.StructureSpecificData) {
            return true;
        }
        if (sdmxMessage.data && sdmxMessage.data.dataSets) {
            return true;
        }
        return false;
    }

    isSchemaMessage(sdmxMessage) {
        return sdmxMessage.schema ? true : false;
    }
};
module.exports = SdmxParserFactory;