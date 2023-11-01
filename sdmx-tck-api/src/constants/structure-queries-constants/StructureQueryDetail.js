const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;

const STRUCTURE_QUERY_DETAIL = {
    FULL: "full",
    ALL_STUBS: "allstubs",
    REFERENCED_STUBS: "referencestubs",
    REFERENCE_PARTIAL: "referencepartial",
    ALL_COMPLETE_STUBS: "allcompletestubs",
    REFERENCE_COMPLETE_STUBS: "referencecompletestubs",
    RAW: "raw",

    getStructureQueryDetail(apiVersion) {
        var availableDetailValues = [];
        availableDetailValues.push(STRUCTURE_QUERY_DETAIL.FULL);
        availableDetailValues.push(STRUCTURE_QUERY_DETAIL.ALL_STUBS);
        availableDetailValues.push(STRUCTURE_QUERY_DETAIL.REFERENCED_STUBS);
    
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
            availableDetailValues.push(STRUCTURE_QUERY_DETAIL.REFERENCE_PARTIAL)
            availableDetailValues.push(STRUCTURE_QUERY_DETAIL.ALL_COMPLETE_STUBS)
            availableDetailValues.push(STRUCTURE_QUERY_DETAIL.REFERENCE_COMPLETE_STUBS)
        }
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            availableDetailValues.push(STRUCTURE_QUERY_DETAIL.RAW);
        }
        return availableDetailValues;
    }
};


module.exports.STRUCTURE_QUERY_DETAIL = Object.freeze(STRUCTURE_QUERY_DETAIL);
