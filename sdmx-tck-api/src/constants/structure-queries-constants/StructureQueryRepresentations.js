const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;

const STRUCTURE_QUERY_REPRESENTATIONS = {
    EMPTY: "",
    SDMX_ML_21: "application/vnd.sdmx.structure+xml;version=2.1",
    SDMX_JSON_100: "application/vnd.sdmx.structure+json;version=1.0.0",
    INVALID_TYPE: "invalid representation query",
    WEIGHTED_SDMX_ML_21: "application/vnd.sdmx.structure+xml;version=2.1, application/vnd.sdmx.structure+json;version=1.0.0;q=0.9",
    WEIGHTED_SDMX_JSON_100: "application/vnd.sdmx.structure+xml;version=2.1;q=0.9, application/vnd.sdmx.structure+json;version=1.0.0",
    SDMX_JSON_200: "application/vnd.sdmx.structure+json;version=2.0.0",
    SDMX_ML_3: "application/vnd.sdmx.structure+xml;version=3.0.0",
    WEIGHTED_SDMX_ML_3: "application/vnd.sdmx.structure+xml;version=3.0.0, application/vnd.sdmx.structure+json;version=2.0.0;q=0.9",
    WEIGHTED_SDMX_JSON_200: "application/vnd.sdmx.structure+xml;version=3.0.0;q=0.9, application/vnd.sdmx.structure+json;version=2.0.0",

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    },
    getDefaultRepresentation(apiVersion) {
        return API_VERSIONS[apiVersion] < API_VERSIONS["v2.0.0"] ? 
                STRUCTURE_QUERY_REPRESENTATIONS.SDMX_ML_21 : STRUCTURE_QUERY_REPRESENTATIONS.SDMX_JSON_200;
    },
    getStructureQueryRepresentations(apiVersion) {
        var representations = [];
        representations.push(STRUCTURE_QUERY_REPRESENTATIONS.EMPTY);
        representations.push(STRUCTURE_QUERY_REPRESENTATIONS.SDMX_ML_21);
        representations.push(STRUCTURE_QUERY_REPRESENTATIONS.SDMX_JSON_100);
        representations.push(STRUCTURE_QUERY_REPRESENTATIONS.INVALID_TYPE);
        representations.push(STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_ML_21);
        representations.push(STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_JSON_100);

        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            representations.push(STRUCTURE_QUERY_REPRESENTATIONS.SDMX_JSON_200);
            representations.push(STRUCTURE_QUERY_REPRESENTATIONS.SDMX_ML_3);
            representations.push(STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_ML_3);
            representations.push(STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_JSON_200);
        }
        return representations;
    }
};

module.exports.STRUCTURE_QUERY_REPRESENTATIONS = Object.freeze(STRUCTURE_QUERY_REPRESENTATIONS);