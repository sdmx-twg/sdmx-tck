var StructureDetail = require('sdmx-tck-api').constants.StructureDetail;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

class SdmxV21JsonForStubsParser {
    static getDetail(structureType, props) {
        if (SdmxV21JsonForStubsParser.isFull(structureType, props)) {
            return StructureDetail.Full;
        } else if (SdmxV21JsonForStubsParser.isCompleteStub(props)) {
            return StructureDetail.CompleteStub;
        } else {
            return StructureDetail.Stub;
        }
    };

    static isFull(structureType, props) {
        if (structureType === SDMX_STRUCTURE_TYPE.DSD.key) {
            return props.hasOwnProperty("DataStructureComponents")
        } else if (structureType === SDMX_STRUCTURE_TYPE.MSD.key) {
            return props.hasOwnProperty("MetadataStructureComponents");
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key || structureType === SDMX_STRUCTURE_TYPE.METADATA_FLOW.key) {
            return props.hasOwnProperty("Structure");
        } else if (structureType === SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY.key) {
            return props.hasOwnProperty("ReportingCategory");
        } else if (structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key) {
            return (props.hasOwnProperty("StructureUsage") || props.hasOwnProperty("DataProvider"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.HIERARCHICAL_CODELIST.key) {
            return (props.hasOwnProperty("IncludedCodelist") || props.hasOwnProperty("Hierarchy"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.STRUCTURE_SET.key) {
            return (props.hasOwnProperty("OrganisationSchemeMap")
                || props.hasOwnProperty("CategorySchemeMap")
                || props.hasOwnProperty("CodelistMap")
                || props.hasOwnProperty("ConceptSchemeMap")
                || props.hasOwnProperty("ReportingTaxonomyMap")
                || props.hasOwnProperty("HybridCodelistMap")
                || props.hasOwnProperty("StructureMap"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.PROCESS.key) {
            return (props.hasOwnProperty("ProcessStep"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.CATEGORISATION.key) {
            return (props.hasOwnProperty("Source") || props.hasOwnProperty("Target"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key ||
            structureType === SDMX_STRUCTURE_TYPE.ALLOWED_CONTRAINT.key ||
            structureType === SDMX_STRUCTURE_TYPE.ACTUAL_CONSTRAINT.key) {
            return (props.hasOwnProperty("ConstraintAttachment"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME.key) {
            return (props.hasOwnProperty("Category"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key) {
            return (props.hasOwnProperty("Concept"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key) {
            return (props.hasOwnProperty("Code"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key) {
            return (props.hasOwnProperty("OrganisationUnit"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key) {
            return (props.hasOwnProperty("Agency"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key) {
            return (props.hasOwnProperty("DataProvider"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key) {
            return (props.hasOwnProperty("DataConsumer"));
        }
    };

    static isCompleteStub = (props) => {
        return (props.hasOwnProperty("Description") || props.hasOwnProperty("Annotations"));
    };
};

module.exports = SdmxV21JsonForStubsParser;