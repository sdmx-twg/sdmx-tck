const API_VERSIONS = require('../constants/ApiVersions.js').API_VERSIONS;

const STRUCTURE_QUERY_DETAIL = {
    FULL: "full",
    ALL_STUBS: "allstubs",
    REFERENCED_STUBS: "referencestubs",
    REFERENCE_PARTIAL: "referencepartial",
    ALL_COMPLETE_STUBS: "allcompletestubs",
    REFERENCE_COMPLETE_STUBS: "referencecompletestubs"
};

function getStructureQueryDetail(apiVersion) {
    var availableDetailValues = [];
    availableDetailValues.push(STRUCTURE_QUERY_DETAIL.FULL);
    availableDetailValues.push(STRUCTURE_QUERY_DETAIL.ALL_STUBS);
    availableDetailValues.push(STRUCTURE_QUERY_DETAIL.REFERENCED_STUBS);

    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
        availableDetailValues.push(STRUCTURE_QUERY_DETAIL.REFERENCE_PARTIAL)
        availableDetailValues.push(STRUCTURE_QUERY_DETAIL.ALL_COMPLETE_STUBS)
        availableDetailValues.push(STRUCTURE_QUERY_DETAIL.REFERENCE_COMPLETE_STUBS)
    }
    return availableDetailValues;
};

module.exports.STRUCTURE_QUERY_DETAIL = Object.freeze(STRUCTURE_QUERY_DETAIL);
module.exports.getStructureQueryDetail = getStructureQueryDetail;