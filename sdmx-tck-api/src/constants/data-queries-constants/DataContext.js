const { SDMX_STRUCTURE_TYPE } = require("../SdmxStructureType.js");
const { API_VERSIONS } = require("./../ApiVersions.js")

const STRUCTURES_REST_RESOURCE = require("./../StructuresRestResources.js").STRUCTURES_REST_RESOURCE;

const DATA_CONTEXT = {
  dataflow: "dataflow",
  datastructure: "datastructure",
  provisionagreement: "provisionagreement",

  getValuesList() {
    var values = Object.values(DATA_CONTEXT);
    return values.filter(function (value) {
      return typeof value !== 'function';
    });
  },
  getApplicableValuesList(apiVersion) {
    let contextList = [DATA_CONTEXT.dataflow];
    /*
     * TODO: (GPP) Enable the following lines when different contexts will be supported in the request.
    let contextList = [];
    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
      contextList = [...DATA_CONTEXT.getValuesList()];
    } else if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
      contextList.push(DATA_CONTEXT.dataflow);
    } */
    return contextList;
  },
  getRestResource(context) {
    if (context === DATA_CONTEXT.provisionagreement) {
      return STRUCTURES_REST_RESOURCE.provisionagreement;
    } else if (context === DATA_CONTEXT.dataflow) {
      return STRUCTURES_REST_RESOURCE.dataflow;
    } else if (context === DATA_CONTEXT.datastructure) {
      return STRUCTURES_REST_RESOURCE.datastructure;
    }
  },
  getStructureTypeFromContext(context) {
    if (context === DATA_CONTEXT.provisionagreement) {
      return SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT;
    } else if (context === DATA_CONTEXT.dataflow) {
      return SDMX_STRUCTURE_TYPE.DATAFLOW;
    } else if (context === DATA_CONTEXT.datastructure) {
      return SDMX_STRUCTURE_TYPE.DSD;
    }
  },
  getContextFromStructureType(structureType) {
    if (structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key) {
      return DATA_CONTEXT.provisionagreement;
    } else if (structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key) {
      return DATA_CONTEXT.dataflow;
    } else if (structureType === SDMX_STRUCTURE_TYPE.DSD.key) {
      return DATA_CONTEXT.datastructure;
    }
  }
};

module.exports.DATA_CONTEXT = Object.freeze(DATA_CONTEXT);