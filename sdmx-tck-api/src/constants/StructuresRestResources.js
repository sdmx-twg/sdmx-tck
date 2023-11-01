const API_VERSIONS = require('./ApiVersions.js').API_VERSIONS;
const TEST_INDEX = require('./TestIndex.js').TEST_INDEX;
const SDMX_STRUCTURE_TYPE = require('./SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
const TEST_REQUEST_MODE = require('./TestRequestMode.js').TEST_REQUEST_MODE;

const STRUCTURES_REST_RESOURCE = {
        datastructure: "datastructure",
        metadatastructure: "metadatastructure",
        categoryscheme: "categoryscheme",
        conceptscheme: "conceptscheme",
        codelist: "codelist",
        hierarchicalcodelist: "hierarchicalcodelist",
        hierarchy: "hierarchy",
        hierarchyassociation: "hierarchyassociation",
        valuelist: "valuelist",
        organisationscheme: "organisationscheme",
        agencyscheme: "agencyscheme",
        dataproviderscheme: "dataproviderscheme",
        metadataproviderscheme: "metadataproviderscheme",
        dataconsumerscheme: "dataconsumerscheme",
        organisationunitscheme: "organisationunitscheme",
        dataflow: "dataflow",
        metadataflow: "metadataflow",
        reportingtaxonomy: "reportingtaxonomy",
        provisionagreement: "provisionagreement",
        metadataprovisionagreement: "metadataprovisionagreement",
        structureset: "structureset",
        structuremap: "structuremap",
        representationmap: "representationmap",
        conceptschememap: "conceptschememap",
        categoryschememap: "categoryschememap",
        organisationschememap: "organisationschememap",
        reportingtaxonomymap: "reportingtaxonomymap",
        process: "process",
        categorisation: "categorisation",
        contentconstraint: "contentconstraint",
        dataconstraint: "dataconstraint",
        metadataconstraint: "metadataconstraint",
        // transformationscheme: "transformationscheme",
        // rulesetscheme: "rulesetscheme",
        // userdefinedoperatorscheme: "userdefinedoperatorscheme",
        // customtypescheme: "customtypescheme",
        // namepersonalisationscheme: "namepersonalisationscheme",
        // vtlmappingscheme: "vtlmappingscheme",
        attachmentconstraint: "attachmentconstraint",
        structure: "structure",

        allowedconstraint: "allowedconstraint",
        actualconstraint: "actualconstraint",

        getValues() {
                let resources = Object.values(this).filter((value) => {
                    return typeof value !== 'function';
                });
                return resources;
        },
        getStructureResources(apiVersion, requestMode) {
                if (requestMode === TEST_REQUEST_MODE.BASIC) {
                        let resourcesArr = this.getStructureRestResources(apiVersion).filter((value) => {
                                let structureType = SDMX_STRUCTURE_TYPE.fromRestResource(value);
                                return (SDMX_STRUCTURE_TYPE.isStructureBasic(structureType) || value === STRUCTURES_REST_RESOURCE.structure);
                        });
                        return resourcesArr;
                }
                // Full mode: return all available resources for the given api version
                return this.getStructureRestResources(apiVersion);
        },
        getSchemaResources() {
                var resources = [];
                resources.push(STRUCTURES_REST_RESOURCE.datastructure);
                resources.push(STRUCTURES_REST_RESOURCE.dataflow);
                resources.push(STRUCTURES_REST_RESOURCE.provisionagreement);
                return resources;
        },
        getStructureRestResources(apiVersion) {
                let resources = [];
                resources.push(this.datastructure);
                resources.push(this.metadatastructure);
                resources.push(this.categoryscheme);
                resources.push(this.conceptscheme);
                resources.push(this.codelist);
                resources.push(this.agencyscheme);
                resources.push(this.dataproviderscheme);
                resources.push(this.dataconsumerscheme);
                resources.push(this.organisationunitscheme);
                resources.push(this.dataflow);
                resources.push(this.metadataflow);
                resources.push(this.reportingtaxonomy);
                resources.push(this.provisionagreement);
                resources.push(this.process);
                resources.push(this.categorisation);
                resources.push(this.structure);

                if (API_VERSIONS[apiVersion] <= API_VERSIONS["v1.4.0"]) {
                        resources.push(this.hierarchicalcodelist);
                        resources.push(this.organisationscheme);
                        resources.push(this.structureset);
                        resources.push(this.contentconstraint);
                        resources.push(this.attachmentconstraint);

                        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
                                resources.push(this.allowedconstraint);
                                resources.push(this.actualconstraint);
                        }
                }
                if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
                        resources.push(this.hierarchy);
                        resources.push(this.hierarchyassociation);
                        resources.push(this.valuelist);
                        resources.push(this.structuremap);
                        resources.push(this.representationmap);
                        resources.push(this.conceptschememap);
                        resources.push(this.categoryschememap);
                        resources.push(this.organisationschememap);
                        resources.push(this.reportingtaxonomymap);
                        resources.push(this.metadataproviderscheme);
                        resources.push(this.metadataprovisionagreement);
                        resources.push(this.dataconstraint);
                        resources.push(this.metadataconstraint);
                        // resources.push(this.transformationscheme);
                        // resources.push(this.rulesetscheme);
                        // resources.push(this.userdefinedoperatorscheme);
                        // resources.push(this.customtypescheme);
                        // resources.push(this.namepersonalisationscheme);
                        // resources.push(this.vtlmappingscheme);
                }
                return resources;
        }
};

function getResources(index,apiVersion,requestMode) {
        let resourcesArray = [];

        if(index === TEST_INDEX.Structure){
                resourcesArray = STRUCTURES_REST_RESOURCE.getStructureResources(apiVersion, requestMode);
        }else if(index === TEST_INDEX.Schema){
                resourcesArray = STRUCTURES_REST_RESOURCE.getSchemaResources();
        }
        return resourcesArray;
};

module.exports.STRUCTURES_REST_RESOURCE = Object.freeze(STRUCTURES_REST_RESOURCE);
module.exports.getResources = getResources;

