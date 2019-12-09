const API_VERSIONS = require('./ApiVersions.js').API_VERSIONS;

const STRUCTURES_REST_RESOURCE = {
        datastructure: "datastructure",
        metadatastructure: "metadatastructure",
        categoryscheme: "categoryscheme",
        conceptscheme: "conceptscheme",
        codelist: "codelist",
        hierarchicalcodelist: "hierarchicalcodelist",
        organisationscheme: "organisationscheme",
        agencyscheme: "agencyscheme",
        dataproviderscheme: "dataproviderscheme",
        dataconsumerscheme: "dataconsumerscheme",
        organisationunitscheme: "organisationunitscheme",
        dataflow: "dataflow",
        metadataflow: "metadataflow",
        reportingtaxonomy: "reportingtaxonomy",
        provisionagreement: "provisionagreement",
        structureset: "structureset",
        process: "process",
        categorisation: "categorisation",
        contentconstraint: "contentconstraint",
        attachmentconstraint: "attachmentconstraint",
        structure: "structure",

        allowedconstraint: "allowedconstraint",
        actualconstraint: "actualconstraint"
};

function getResources(apiVersion) {
        let resourcesArray = [];

        for (var key in STRUCTURES_REST_RESOURCE) {
                if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
                        resourcesArray.push(STRUCTURES_REST_RESOURCE[key]);
                } else {
                        if (STRUCTURES_REST_RESOURCE[key] !== "allowedconstraint"
                                && STRUCTURES_REST_RESOURCE[key] !== "actualconstraint") {
                                resourcesArray.push(STRUCTURES_REST_RESOURCE[key]);
                        }
                }

        }
        return resourcesArray;
};

module.exports.STRUCTURES_REST_RESOURCE = Object.freeze(STRUCTURES_REST_RESOURCE);
module.exports.getResources = getResources;

