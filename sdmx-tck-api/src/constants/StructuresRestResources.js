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
        actualconstraint: "actualconstraint",

        getValues() {
                let resources = Object.values(this).filter((value) => {
                    return typeof value !== 'function';
                });
                return resources;
        },
        getStructureResources(apiVersion, requestMode) {
                if (requestMode === TEST_REQUEST_MODE.BASIC) {
                        let resourcesArr = this.getValues().filter((value) => {
                                let structureType = SDMX_STRUCTURE_TYPE.fromRestResource(value);
                                return (SDMX_STRUCTURE_TYPE.isStructureBasic(structureType) || value === STRUCTURES_REST_RESOURCE.structure);
                        });
                        return resourcesArr;
                }
                // Full mode depends on API version, i.e. exclude allowedconstraint and actualconstraint for old versions 
                // For any other case return all resources
                if (API_VERSIONS[apiVersion] < API_VERSIONS["v1.3.0"]) {
                        return this.getValues().filter((value) => {
                                return (value !== STRUCTURES_REST_RESOURCE.allowedconstraint &&
                                        value !== STRUCTURES_REST_RESOURCE.actualconstraint);
                        });
                }
                return this.getValues();
        },
        getSchemaResources() {
                var resources = [];
                resources.push(STRUCTURES_REST_RESOURCE.datastructure);
                resources.push(STRUCTURES_REST_RESOURCE.dataflow);
                resources.push(STRUCTURES_REST_RESOURCE.provisionagreement);
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

