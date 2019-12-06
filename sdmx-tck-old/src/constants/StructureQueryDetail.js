import API_VERSION from '../constants/ApiVersions';

export const STRUCTURE_QUERY_DETAIL = {
    FULL: "full",
    ALL_STUBS: "allstubs",
    REFERENCED_STUBS: "referencestubs",
    REFERENCE_PARTIAL: "referencepartial",
    ALL_COMPLETE_STUBS: "allcompletestubs",
    REFERENCE_COMPLETE_STUBS: "referencecompletestubs"
};

export const getStructureQueryDetail = (apiVersion) => {
    var availableDetailValues = [];
    availableDetailValues.push(STRUCTURE_QUERY_DETAIL.FULL);
    availableDetailValues.push(STRUCTURE_QUERY_DETAIL.ALL_STUBS);
    availableDetailValues.push(STRUCTURE_QUERY_DETAIL.REFERENCED_STUBS);

    if (API_VERSION[apiVersion] >= API_VERSION["v1.3.0"]) {
        availableDetailValues.push(STRUCTURE_QUERY_DETAIL.REFERENCE_PARTIAL)
        availableDetailValues.push(STRUCTURE_QUERY_DETAIL.ALL_COMPLETE_STUBS)
        availableDetailValues.push(STRUCTURE_QUERY_DETAIL.REFERENCE_COMPLETE_STUBS)
    }
    return availableDetailValues;
}
