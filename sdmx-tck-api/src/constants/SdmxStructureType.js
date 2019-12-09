var SDMX_STRUCTURE_TYPE = {
    DSD: { key: "DSD", getClass() { return "DataStructure" } },
    MSD: { key: "MSD", getClass() { return "MetadataStructure" } },
    CATEGORY_SCHEME: { key: "CATEGORY_SCHEME", getClass() { return "CategoryScheme" } },
    CONCEPT_SCHEME: { key: "CONCEPT_SCHEME", getClass() { return "ConceptScheme" } },
    CODE_LIST: { key: "CODE_LIST", getClass() { return "Codelist" } },
    HIERARCHICAL_CODELIST: { key: "HIERARCHICAL_CODELIST", getClass() { return "HierarchicalCodelist" } },
    ORGANISATION_SCHEME: { key: "ORGANISATION_SCHEME", getClass() { return "OrganisationScheme" } },
    AGENCY_SCHEME: { key: "AGENCY_SCHEME", getClass() { return "AgencyScheme" } },
    DATA_PROVIDER_SCHEME: { key: "DATA_PROVIDER_SCHEME", getClass() { return "DataProviderScheme" } },
    DATA_CONSUMER_SCHEME: { key: "DATA_CONSUMER_SCHEME", getClass() { return "DataConsumerScheme" } },
    ORGANISATION_UNIT_SCHEME: { key: "ORGANISATION_UNIT_SCHEME", getClass() { return "OrganisationUnitScheme" } },
    DATAFLOW: { key: "DATAFLOW", getClass() { return "Dataflow" } },
    METADATA_FLOW: { key: "METADATA_FLOW", getClass() { return "Metadataflow" } },
    REPORTING_TAXONOMY: { key: "REPORTING_TAXONOMY", getClass() { return "ReportingTaxonomy" } },
    PROVISION_AGREEMENT: { key: "PROVISION_AGREEMENT", getClass() { return "ProvisionAgreement" } },
    STRUCTURE_SET: { key: "STRUCTURE_SET", getClass() { return "StructureSet" } },
    PROCESS: { key: "PROCESS", getClass() { return "Process" } },
    CATEGORISATION: { key: "CATEGORISATION", getClass() { return "Categorisation" } },
    CONTENT_CONSTRAINT: { key: "CONTENT_CONSTRAINT", getClass() { return "ContentConstraint" } },
    ATTACHMENT_CONSTRAINT: { key: "ATTACHMENT_CONSTRAINT", getClass() { return "AttachmentConstraint" } },
    ALLOWED_CONTRAINT: { key: "ALLOWED_CONTRAINT", getClass() { return "AllowedConstraint" } },
    ACTUAL_CONSTRAINT: { key: "ACTUAL_CONSTRAINT", getClass() { return "ActualConstraint" } },

};

SDMX_STRUCTURE_TYPE.CATEGORY = { key: "CATEGORY", getClass() { return "Category" }, maintainableParent: SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME };
SDMX_STRUCTURE_TYPE.CONCEPT = { key: "CONCEPT", getClass() { return "Concept" }, maintainableParent: SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME };
SDMX_STRUCTURE_TYPE.CODE = { key: "CODE", getClass() { return "Code" }, maintainableParent: SDMX_STRUCTURE_TYPE.CODE_LIST };
SDMX_STRUCTURE_TYPE.HIERARCHY = { key: "HIERARCHY", getClass() { return "Hierarchy" }, maintainableParent: SDMX_STRUCTURE_TYPE.HIERARCHICAL_CODELIST };
SDMX_STRUCTURE_TYPE.AGENCY = { key: "AGENCY", getClass() { return "Agency" }, maintainableParent: SDMX_STRUCTURE_TYPE.AGENCY_SCHEME };
SDMX_STRUCTURE_TYPE.DATA_PROVIDER = { key: "DATA_PROVIDER", getClass() { return "DataProvider" }, maintainableParent: SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME };
SDMX_STRUCTURE_TYPE.DATA_CONSUMER = { key: "DATA_CONSUMER", getClass() { return "DataConsumer" }, maintainableParent: SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME };
SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT = { key: "ORGANISATION_UNIT", getClass() { return "OrganisationUnit" }, maintainableParent: SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME };
SDMX_STRUCTURE_TYPE.REPORTING_CATEGORY = { key: "REPORTING_CATEGORY", getClass() { return "ReportingCategory" }, maintainableParent: SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY };

/**
 * Returns if a given structure is maintainable or not.
 */
SDMX_STRUCTURE_TYPE.isMaintainable = function (structureType) {
    return (typeof SDMX_STRUCTURE_TYPE[structureType] !== 'function') &&
        !(SDMX_STRUCTURE_TYPE[structureType].maintainableParent !== null
            && SDMX_STRUCTURE_TYPE[structureType].maintainableParent !== undefined);
};

SDMX_STRUCTURE_TYPE.fromRestResource = function (restResource) {
    switch (restResource) {
        case "datastructure":
            return this.DSD.key;
        case "metadatastructure":
            return this.MSD.key;
        case "categoryscheme":
            return this.CATEGORY_SCHEME.key;
        case "conceptscheme":
            return this.CONCEPT_SCHEME.key;
        case "codelist":
            return this.CODE_LIST.key;
        case "hierarchicalcodelist":
            return this.HIERARCHICAL_CODELIST.key;
        case "organisationscheme":
            return this.ORGANISATION_SCHEME.key;
        case "agencyscheme":
            return this.AGENCY_SCHEME.key;
        case "dataproviderscheme":
            return this.DATA_PROVIDER_SCHEME.key;
        case "dataconsumerscheme":
            return this.DATA_CONSUMER_SCHEME.key;
        case "organisationunitscheme":
            return this.ORGANISATION_UNIT_SCHEME.key;
        case "dataflow":
            return this.DATAFLOW.key;
        case "metadataflow":
            return this.METADATA_FLOW.key;
        case "provisionagreement":
            return this.PROVISION_AGREEMENT.key;
        case "structureset":
            return this.STRUCTURE_SET.key;
        case "process":
            return this.PROCESS.key;
        case "categorisation":
            return this.CATEGORISATION.key;
        case "contentconstraint":
            return this.CONTENT_CONSTRAINT.key;
        case "attachmentconstraint":
            return this.ATTACHMENT_CONSTRAINT.key;
        case "allowedconstraint":
            return this.ALLOWED_CONTRAINT.key;
        case "actualconstraint":
            return this.ACTUAL_CONSTRAINT.key;
        case "reportingtaxonomy":
            return this.REPORTING_TAXONOMY.key;
        default:
            return null;
    }
};

SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass = function (urnClass) {
    if (urnClass == null) {
        throw new Error("SDMX structure type cannot be extracted from a null urn class.");
    }
    let structureType = this.getStructureTypeByClass(urnClass);
    if (!structureType) {
        throw new Error("Could not find structure type for urn class '" + urnClass + "'");
    }
    if (!this[structureType].maintainableParent) {
        return structureType;
    } else {
        return this.getMaintainableStructureTypeByClass(this[structureType].maintainableParent.getClass());
    }
};

SDMX_STRUCTURE_TYPE.getStructureTypeByClass = function (urnClass) {
    return Object.keys(SDMX_STRUCTURE_TYPE).find(
        key => SDMX_STRUCTURE_TYPE[key] && typeof SDMX_STRUCTURE_TYPE[key] !== "function" && SDMX_STRUCTURE_TYPE[key].getClass() === urnClass
    );
};

SDMX_STRUCTURE_TYPE.getMaintainableTypes = function () {
    let maintainableTypes = Object.keys(SDMX_STRUCTURE_TYPE).filter((key) => {
        return SDMX_STRUCTURE_TYPE.isMaintainable(key) === true;
    });
    return maintainableTypes;
};

module.exports.SDMX_STRUCTURE_TYPE = Object.freeze(SDMX_STRUCTURE_TYPE);