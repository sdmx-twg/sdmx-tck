var StructureDetail = require('sdmx-tck-api').constants.StructureDetail;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

class SdmxJsonV20ForStubsParser {
    static getDetail(structureType, props) {
        if (SdmxJsonV20ForStubsParser.isFull(structureType, props)) {
            return StructureDetail.Full;
        } else if (SdmxJsonV20ForStubsParser.isCompleteStub(props)) {
            return StructureDetail.CompleteStub;
        } else {
            return StructureDetail.Stub;
        }
    };

    static isFull(structureType, props) {

        if (structureType === SDMX_STRUCTURE_TYPE.DSD.key) {
            //must have dataStructureComponents and dimensionList
            return props?.dataStructureComponents?.dimensionList?.dimensions;

        } else if (structureType === SDMX_STRUCTURE_TYPE.MSD.key) {
            return props.hasOwnProperty("metadataStructureComponents");
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key || structureType === SDMX_STRUCTURE_TYPE.METADATA_FLOW.key) {
            return props.hasOwnProperty("structure");
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY.key) {
            return props.hasOwnProperty("reportingCategories");
       
        } else if (structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key) {
            // StructureUsage became Dataflow in SDMX 3.0
            return (props.hasOwnProperty("dataflow") && props.hasOwnProperty("dataProvider"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.PROCESS.key) {
            return (props.hasOwnProperty("processSteps"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.CATEGORISATION.key) {
            return (props.hasOwnProperty("source") && props.hasOwnProperty("target"));
        
        } else if (
            structureType === SDMX_STRUCTURE_TYPE.ALLOWED_CONTRAINT.key ||
            structureType === SDMX_STRUCTURE_TYPE.DATA_CONSTRAINT.key ||
            structureType === SDMX_STRUCTURE_TYPE.METADATA_CONSTRAINT.key) {
            return (props.hasOwnProperty("constraintAttachment"));
            
        } else if (structureType === SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME.key) {
            return (props.hasOwnProperty("categories"));

        } else if (structureType === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key) {
            return (props.hasOwnProperty("concepts"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key) {
            return (props.hasOwnProperty("codes")
                || props.hasOwnProperty("geoFeatureSetCodes")
                || props.hasOwnProperty("geoGridCodes"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key) {
            return (props.hasOwnProperty("organisationUnits"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key) {
            return (props.hasOwnProperty("agencies"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key) {
            return (props.hasOwnProperty("dataProviders"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key) {
            return (props.hasOwnProperty("dataConsumers"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.VALUE_LIST.key) { // SDMX_3 artefact
            return (props.hasOwnProperty("valueItems"));

        } else if (structureType === SDMX_STRUCTURE_TYPE.HIERARCHY.key) { // SDMX_3 artefact
            return (props.hasOwnProperty("hierarchicalCodes"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.HIERARCHY_ASSOCIATION.key) { // SDMX_3 artefact
            return (props.hasOwnProperty("linkedHierarchy") && props.hasOwnProperty("linkedObject"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.METADATA_PROVIDER_SCHEME.key) { // SDMX_3 artefact
            return (props.hasOwnProperty("metadataProviders"));
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.METADATA_PROVISION_AGREEMENT.key) { // SDMX_3 artefact
            return (props.hasOwnProperty("metadataflow") && props.hasOwnProperty("metadataProvider")); 
        
        } else if (structureType === SDMX_STRUCTURE_TYPE.ORGANISATION_SCHEME_MAP.key ||
            structureType === SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME_MAP.key ||
            structureType === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME_MAP.key ||
            structureType === SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY_MAP.key ||
            structureType === SDMX_STRUCTURE_TYPE.STRUCTURE_MAP.key ) { // SDMX_3 artefact
            
            return (props.hasOwnProperty("source") && props.hasOwnProperty("target"));
        } else if (structureType === SDMX_STRUCTURE_TYPE.REPRESENTATION_MAP.key) { // SDMX_3 artefact
            return (
                ( props?.source[0]?.codelist || props?.source[0]?.dataType ) &&
                ( props?.target[0]?.codelist || props?.target[0]?.dataType )                    
                )
        } 
    };

    static isCompleteStub (props)  {
        return (props.hasOwnProperty("description") || props.hasOwnProperty("annotations"));
    }

};
module.exports = SdmxJsonV20ForStubsParser;