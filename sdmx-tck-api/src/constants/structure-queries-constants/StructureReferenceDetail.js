const SDMX_STRUCTURE_TYPE = require("../SdmxStructureType.js").SDMX_STRUCTURE_TYPE;
var isDefined = require('../../utils/Utils.js').isDefined;
const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;
const TEST_REQUEST_MODE = require('../TestRequestMode.js').TEST_REQUEST_MODE;

const STRUCTURE_REFERENCE_DETAIL = {
    NONE: "none",
    PARENTS: "parents",
    PARENTS_SIBLINGS: "parentsandsiblings",
    CHILDREN: "children",
    DESCENDANTS: "descendants",
    ALL: "all",

    // Specific reference artefact type
    DSD: "datastructure",
    MSD: "metadatastructure",
    CATEGORY_SCHEME: "categoryscheme",
    CONCEPT_SCHEME: "conceptscheme",
    CODE_LIST: "codelist",
    HIERARCHICAL_CODELIST: "hierarchicalcodelist",
    ORGANISATION_SCHEME: "organisationscheme",
    AGENCY_SCHEME: "agencyscheme",
    DATA_PROVIDER_SCHEME: "dataproviderscheme",
    DATA_CONSUMER_SCHEME: "dataconsumerscheme",
    ORGANISATION_UNIT_SCHEME: "organisationunitscheme",
    DATAFLOW: "dataflow",
    METADATA_FLOW: "metadataflow",
    REPORTING_TAXONOMY: "reportingtaxonomy",
    PROVISION_AGREEMENT: "provisionagreement",
    STRUCTURE_SET: "structureset",
    PROCESS: "process",
    CATEGORISATION: "categorisation",
    CONTENT_CONSTRAINT: "contentconstraint",
    ATTACHMENT_CONSTRAINT: "attachmentconstraint",
    // SDMX 3.0 artefacts
    HIERARCHY: "hierarchy",
    HIERARCHY_ASSOCIATION: "hierarchyassociation",
    VALUE_LIST: "valuelist",
    STRUCTURE_MAP: "structuremap",
    REPRESENTATION_MAP: "representationmap",
    CONCEPT_SCHEME_MAP: "conceptschememap",
    CATEGORY_SCHEME_MAP: "categoryschememap",
    ORGANISATION_SCHEME_MAP: "organisationschememap",
    REPORTING_TAXONOMY_MAP: "reportingtaxonomymap",
    METADATA_PROVIDER_SCHEME: "metadataproviderscheme",
    METADATA_PROVISION_AGREEMENT: "metadataprovisionagreement",
    DATA_CONSTRAINT: "dataconstraint",
    METADATA_CONSTRAINT: "metadataconstraint",

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    },
    isSpecificSdmxStructure(structureReferenceDetail) {
        return isDefined(structureReferenceDetail) && STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType(structureReferenceDetail) != null;
    },
    getSdmxStructureTypes: function () {
        return Object.keys(STRUCTURE_REFERENCE_DETAIL).filter((r) => {
            return typeof STRUCTURE_REFERENCE_DETAIL[r] !== 'function' &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.NONE &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.PARENTS &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.PARENTS_SIBLINGS &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.CHILDREN &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.DESCENDANTS &&
                STRUCTURE_REFERENCE_DETAIL[r] !== STRUCTURE_REFERENCE_DETAIL.ALL;
        });
    },
    getSdmxStructureTypesValues: function() {
        return STRUCTURE_REFERENCE_DETAIL.getSdmxStructureTypes().map((key) => {
            return STRUCTURE_REFERENCE_DETAIL[key];
        });
    },
    getSdmxStructureType: function (structureReferenceDetail) {
        return STRUCTURE_REFERENCE_DETAIL.getSdmxStructureTypes().find(r => {
            return STRUCTURE_REFERENCE_DETAIL[r] === structureReferenceDetail;
        });
    },
    getApplicableReferences: function (structureType, apiVersion) {
        let applicableRefs = [];
        switch (structureType) {
            case SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key:
                applicableRefs = this.getAgencySchemeReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.CATEGORISATION.key:
            case SDMX_STRUCTURE_TYPE.PROCESS.key:
                applicableRefs = this.getSdmxStructureTypesValues();
                break;
            case SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME.key:
                applicableRefs = this.getCategorySchemeReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.CODE_LIST.key:
                applicableRefs = this.getCodelistReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key:
                applicableRefs = this.getConceptSchemeReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key:
            case SDMX_STRUCTURE_TYPE.ATTACHMENT_CONSTRAINT.key:
                applicableRefs = this.getConstraintReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key:
                applicableRefs = this.getDataConsumerReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.DATAFLOW.key:
                applicableRefs = this.getDataflowReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key:
                applicableRefs = this.getDataProviderSchemeReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.DSD.key:
                applicableRefs = this.getDSDReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.HIERARCHICAL_CODELIST.key:
                applicableRefs = this.getHierarchicalCodelistReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.METADATA_FLOW.key:
                applicableRefs = this.getMetadataFlowReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.MSD.key:
                applicableRefs = this.getMSDReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key:
                applicableRefs = this.getOrganisationUnitSchemeReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key:
                applicableRefs = this.getProvisionAgreementReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY.key:
                applicableRefs = this.getReportingTaxonomyReferenceList(apiVersion);
                break;
            case SDMX_STRUCTURE_TYPE.STRUCTURE_SET.key:
                applicableRefs = this.getStructureSetReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.DATA_CONSTRAINT.key:
                applicableRefs = this.getDataConstraintReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.METADATA_CONSTRAINT.key:
                applicableRefs = this.getMetadataConstraintReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.HIERARCHY.key:
                applicableRefs = this.getHierarchyReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.HIERARCHY_ASSOCIATION.key:
                applicableRefs = this.getHierarchyAssociationReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.VALUE_LIST.key:
                applicableRefs = this.getValueListReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.METADATA_PROVIDER_SCHEME.key:
                applicableRefs = this.getMetadataProviderSchemeReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.METADATA_PROVISION_AGREEMENT.key:
                applicableRefs = this.getMetadataProvisionAgreementReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.STRUCTURE_MAP.key:
                applicableRefs = this.getStructureMapReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.REPRESENTATION_MAP.key:
                applicableRefs = this.getRepresentationMapReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME_MAP.key:
                applicableRefs = this.getConceptSchemeMapReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME_MAP.key:
                applicableRefs = this.getCategorySchemeMapReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.ORGANISATION_SCHEME_MAP.key:
                applicableRefs = this.getOrganisationSchemeMapReferenceList();
                break;
            case SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY_MAP.key:
                applicableRefs = this.getReportingTaxonomyMapReferenceList();
                break;
        }
        return applicableRefs;
    },
    ////////////////////////////////////////////////////////////////////////////
    getAgencySchemeReferenceList(apiVersion) {
        // if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
        //     return this.getSdmxStructureTypesValues();
        // }
        return [this.CATEGORISATION, this.PROCESS, this.MSD, this.STRUCTURE_SET];
    },
    getDataProviderSchemeReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.CONTENT_CONSTRAINT, this.ATTACHMENT_CONSTRAINT, 
                            this.PROVISION_AGREEMENT, this.STRUCTURE_SET, this.MSD];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.pop(); // remove MSD
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.DATA_CONSTRAINT);
            applicableRefs.push(this.HIERARCHY_ASSOCIATION);
            applicableRefs.push(this.METADATA_FLOW);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
            applicableRefs.push(this.ORGANISATION_SCHEME_MAP);
        }
        return applicableRefs;
    },
    getDataConsumerReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.STRUCTURE_SET, this.MSD];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.pop(); // remove MSD
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.HIERARCHY_ASSOCIATION);
            applicableRefs.push(this.METADATA_FLOW);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
            applicableRefs.push(this.ORGANISATION_SCHEME_MAP);
        }
        return applicableRefs;
    },
    getOrganisationUnitSchemeReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.CONTENT_CONSTRAINT, this.ATTACHMENT_CONSTRAINT, this.STRUCTURE_SET, this.MSD];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.pop(); // remove MSD
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.METADATA_FLOW);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
            applicableRefs.push(this.ORGANISATION_SCHEME_MAP);
        }
        return applicableRefs;
    },
    getCategorySchemeReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.STRUCTURE_SET];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.CATEGORY_SCHEME_MAP);
            applicableRefs.push(this.METADATA_FLOW);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
        }
        return applicableRefs;
    },
    getCodelistReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.HIERARCHICAL_CODELIST, this.CONCEPT_SCHEME, this.DSD, this.MSD, this.STRUCTURE_SET];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.CODE_LIST);
            applicableRefs.push(this.HIERARCHY);
            applicableRefs.push(this.HIERARCHY_ASSOCIATION);
            applicableRefs.push(this.METADATA_FLOW);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
            applicableRefs.push(this.REPRESENTATION_MAP);
        }
        return applicableRefs;
    },
    getConceptSchemeReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.CODE_LIST, this.DSD, this.MSD, this.STRUCTURE_SET];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.CONCEPT_SCHEME_MAP);
            applicableRefs.push(this.HIERARCHY_ASSOCIATION);
            applicableRefs.push(this.METADATA_FLOW);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
        }
        return applicableRefs;
    },
    getHierarchicalCodelistReferenceList() {
        return [this.CATEGORISATION, this.PROCESS, this.CODE_LIST, this.STRUCTURE_SET];
    },
    getDataflowReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.CONTENT_CONSTRAINT, this.ATTACHMENT_CONSTRAINT, this.DSD, this.PROVISION_AGREEMENT, 
                            this.REPORTING_TAXONOMY, this.STRUCTURE_SET];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.DATA_CONSTRAINT);
            applicableRefs.push(this.HIERARCHY_ASSOCIATION);
            applicableRefs.push(this.METADATA_FLOW);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
            applicableRefs.push(this.STRUCTURE_MAP);
        }
        return applicableRefs;
    },
    getMetadataFlowReferenceList(apiVersion) {
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            return this.getSdmxStructureTypesValues();
        }
        return [this.CATEGORISATION, this.PROCESS, this.CONTENT_CONSTRAINT, this.ATTACHMENT_CONSTRAINT, this.MSD, this.PROVISION_AGREEMENT, 
                this.REPORTING_TAXONOMY, this.STRUCTURE_SET];
    },
    getDSDReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.CODE_LIST, this.CONCEPT_SCHEME, this.CONTENT_CONSTRAINT, this.ATTACHMENT_CONSTRAINT, 
                            this.DATAFLOW, this.STRUCTURE_SET];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.DATA_CONSTRAINT);
            applicableRefs.push(this.HIERARCHY_ASSOCIATION);
            applicableRefs.push(this.METADATA_FLOW);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
            applicableRefs.push(this.MSD);
            applicableRefs.push(this.STRUCTURE_MAP);
            applicableRefs.push(this.VALUE_LIST);
        }
        return applicableRefs;
    },
    getMSDReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.CONCEPT_SCHEME, this.CODE_LIST, this.AGENCY_SCHEME, 
                            this.CONTENT_CONSTRAINT, this.ATTACHMENT_CONSTRAINT, this.METADATA_FLOW, this.STRUCTURE_SET, 
                            this.DATA_PROVIDER_SCHEME, this.DATA_CONSUMER_SCHEME, this.ORGANISATION_UNIT_SCHEME];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.pop();applicableRefs.pop();applicableRefs.pop(); // remove Provider, Consumer, OrgUnit schemes
            applicableRefs.push(this.DSD);
            applicableRefs.push(this.HIERARCHY_ASSOCIATION);
            applicableRefs.push(this.METADATA_CONSTRAINT);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
            applicableRefs.push(this.VALUE_LIST);
        }
        return applicableRefs;
    },
    getProvisionAgreementReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.DATA_PROVIDER_SCHEME, this.DATAFLOW, this.METADATA_FLOW, 
                            this.CONTENT_CONSTRAINT, this.ATTACHMENT_CONSTRAINT];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.DATA_CONSTRAINT);
            applicableRefs.push(this.HIERARCHY_ASSOCIATION);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
        }
        return applicableRefs;
    },
    getReportingTaxonomyReferenceList(apiVersion) {
        let applicableRefs = [this.CATEGORISATION, this.PROCESS, this.DATAFLOW, this.METADATA_FLOW, this.STRUCTURE_SET];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            applicableRefs.push(this.AGENCY_SCHEME);
            applicableRefs.push(this.CATEGORY_SCHEME_MAP);
            applicableRefs.push(this.HIERARCHY_ASSOCIATION);
            applicableRefs.push(this.METADATA_PROVISION_AGREEMENT);
            applicableRefs.push(this.REPORTING_TAXONOMY_MAP);
        }
        return applicableRefs;
    },
    getStructureSetReferenceList() {
        return [this.CATEGORISATION, this.PROCESS, this.DSD, this.MSD, this.CATEGORY_SCHEME, this.DATA_PROVIDER_SCHEME, this.DATA_CONSUMER_SCHEME, 
                this.AGENCY_SCHEME, this.ORGANISATION_UNIT_SCHEME, this.CONCEPT_SCHEME, this.CODE_LIST, this.REPORTING_TAXONOMY, 
                this.HIERARCHICAL_CODELIST, this.DATAFLOW, this.METADATA_FLOW];
    },
    getConstraintReferenceList() {
        return [this.CATEGORISATION, this.PROCESS, this.DATA_PROVIDER_SCHEME, this.DSD, this.DATAFLOW, this.MSD, this.METADATA_FLOW, this.PROVISION_AGREEMENT];
    },
    getDataConstraintReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.HIERARCHY_ASSOCIATION, this.DATA_PROVIDER_SCHEME, this.DSD, this.DATAFLOW, 
                this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.PROVISION_AGREEMENT, this.PROCESS];
    },
    getMetadataConstraintReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.HIERARCHY_ASSOCIATION, 
                this.METADATA_PROVIDER_SCHEME, this.MSD, this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.PROCESS];
    },
    getMetadataProviderSchemeReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.HIERARCHY_ASSOCIATION, 
                this.METADATA_CONSTRAINT, this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.ORGANISATION_SCHEME_MAP, this.PROCESS];
    },
    getMetadataProvisionAgreementReferenceList() {
        return this.getSdmxStructureTypesValues();
    },
    getHierarchyReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.CODE_LIST, this.HIERARCHY_ASSOCIATION, 
                this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.PROCESS];
    },
    getHierarchyAssociationReferenceList() {
        return this.getSdmxStructureTypesValues();
    },
    getValueListReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.CONCEPT_SCHEME, this.DSD, 
                this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.MSD, this.PROCESS, this.REPRESENTATION_MAP];
    },
    getCategorySchemeMapReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.CATEGORY_SCHEME, this.HIERARCHY_ASSOCIATION, 
                this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.PROCESS, this.REPORTING_TAXONOMY];
    },
    getConceptSchemeMapReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.CONCEPT_SCHEME, this.HIERARCHY_ASSOCIATION, 
                this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.PROCESS];
    },
    getStructureMapReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.DATAFLOW, this.DSD, this.HIERARCHY_ASSOCIATION, 
                this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.PROCESS];
    },
    getRepresentationMapReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.CODE_LIST, this.HIERARCHY_ASSOCIATION, 
                this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.PROCESS, this.VALUE_LIST];
    },
    getReportingTaxonomyMapReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.HIERARCHY_ASSOCIATION, 
                this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.PROCESS, this.REPORTING_TAXONOMY];
    },
    getOrganisationSchemeMapReferenceList() {
        return [this.AGENCY_SCHEME, this.CATEGORISATION, this.DATA_CONSUMER_SCHEME, this.DATA_PROVIDER_SCHEME, this.HIERARCHY_ASSOCIATION, 
                this.METADATA_FLOW, this.METADATA_PROVISION_AGREEMENT, this.METADATA_PROVIDER_SCHEME, this.ORGANISATION_UNIT_SCHEME, this.PROCESS];
    },
    ////////////////////////////////////////////////////////////////////////////
    isApplicableReference: function (structureType, structureReferenceDetail, apiVersion) {
        let applicableReferences = STRUCTURE_REFERENCE_DETAIL.getApplicableReferences(structureType, apiVersion);
        return applicableReferences.some((ref) => {
            return ref === structureReferenceDetail;
        });
    },
    getStructureReferenceDetail(apiVersion) {
        let references = [];
        references.push(STRUCTURE_REFERENCE_DETAIL.NONE);
        references.push(STRUCTURE_REFERENCE_DETAIL.PARENTS);
        references.push(STRUCTURE_REFERENCE_DETAIL.PARENTS_SIBLINGS);
        references.push(STRUCTURE_REFERENCE_DETAIL.CHILDREN);
        references.push(STRUCTURE_REFERENCE_DETAIL.DESCENDANTS);
        references.push(STRUCTURE_REFERENCE_DETAIL.ALL);

        references.push(STRUCTURE_REFERENCE_DETAIL.DSD);
        references.push(STRUCTURE_REFERENCE_DETAIL.MSD);
        references.push(STRUCTURE_REFERENCE_DETAIL.CATEGORY_SCHEME);
        references.push(STRUCTURE_REFERENCE_DETAIL.CONCEPT_SCHEME);
        references.push(STRUCTURE_REFERENCE_DETAIL.CODE_LIST);
        references.push(STRUCTURE_REFERENCE_DETAIL.AGENCY_SCHEME);
        references.push(STRUCTURE_REFERENCE_DETAIL.DATA_PROVIDER_SCHEME);
        references.push(STRUCTURE_REFERENCE_DETAIL.DATA_CONSUMER_SCHEME);
        references.push(STRUCTURE_REFERENCE_DETAIL.ORGANISATION_UNIT_SCHEME);
        references.push(STRUCTURE_REFERENCE_DETAIL.DATAFLOW);
        references.push(STRUCTURE_REFERENCE_DETAIL.METADATA_FLOW);
        references.push(STRUCTURE_REFERENCE_DETAIL.REPORTING_TAXONOMY);
        references.push(STRUCTURE_REFERENCE_DETAIL.PROVISION_AGREEMENT);
        references.push(STRUCTURE_REFERENCE_DETAIL.PROCESS);
        references.push(STRUCTURE_REFERENCE_DETAIL.CATEGORISATION);
        
        if (API_VERSIONS[apiVersion] <= API_VERSIONS["v1.4.0"]) {
            references.push(STRUCTURE_REFERENCE_DETAIL.HIERARCHICAL_CODELIST);
            references.push(STRUCTURE_REFERENCE_DETAIL.ORGANISATION_SCHEME);
            references.push(STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET);
            references.push(STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT);
            references.push(STRUCTURE_REFERENCE_DETAIL.ATTACHMENT_CONSTRAINT);
        }
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            references.push(STRUCTURE_REFERENCE_DETAIL.HIERARCHY);
            references.push(STRUCTURE_REFERENCE_DETAIL.HIERARCHY_ASSOCIATION);
            references.push(STRUCTURE_REFERENCE_DETAIL.VALUE_LIST);
            references.push(STRUCTURE_REFERENCE_DETAIL.STRUCTURE_MAP);
            references.push(STRUCTURE_REFERENCE_DETAIL.REPRESENTATION_MAP);
            references.push(STRUCTURE_REFERENCE_DETAIL.CONCEPT_SCHEME_MAP);
            references.push(STRUCTURE_REFERENCE_DETAIL.CATEGORY_SCHEME_MAP);
            references.push(STRUCTURE_REFERENCE_DETAIL.ORGANISATION_SCHEME_MAP);
            references.push(STRUCTURE_REFERENCE_DETAIL.REPORTING_TAXONOMY_MAP);
            references.push(STRUCTURE_REFERENCE_DETAIL.METADATA_PROVIDER_SCHEME);
            references.push(STRUCTURE_REFERENCE_DETAIL.METADATA_PROVISION_AGREEMENT);
            references.push(STRUCTURE_REFERENCE_DETAIL.DATA_CONSTRAINT);
            references.push(STRUCTURE_REFERENCE_DETAIL.METADATA_CONSTRAINT);
        }
        return references;
    },
    isModeApplicableReference(reference, requestMode) {
        let refStructureType = SDMX_STRUCTURE_TYPE.fromRestResource(reference);
        let refStructureIsBasic = SDMX_STRUCTURE_TYPE.isStructureBasic(refStructureType);
        return (requestMode === TEST_REQUEST_MODE.FULL) ||
                (requestMode === TEST_REQUEST_MODE.BASIC && refStructureIsBasic);
    }
};

module.exports.STRUCTURE_REFERENCE_DETAIL = Object.freeze(STRUCTURE_REFERENCE_DETAIL);