const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;
const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;

const DATA_IDENTIFICATION_PARAMETERS = {
    AGENCY_ID_VERSION: {
        key: "AGENCY_ID_VERSION",
        url: "/agency,id,version",
        template: { detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY }
    },
    V2_AGENCY_ID_VERSION: {
        key: "AGENCY_ID_VERSION",
        url: "/dataflow/agency/id/version",
        template: {}
    },
    AGENCY_ID_LATEST: {
        key: "AGENCY_ID_LATEST",
        url: "/agency,id",
        template: { version: "latest", detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY }
    },
    V2_AGENCY_ID_LATEST: {
        key: "AGENCY_ID_LATEST",
        url: "dataflow/agency/id/+",
        template: { version: "+" }
    },
    ALL_ID_LATEST: {
        key: "ALL_ID_LATEST",
        url: "/id",
        template: { agency: "all", version: "latest", detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY }
    },
    V2_ALL_ID_LATEST: {
        key: "ALL_ID_LATEST",
        url: "dataflow/*/id/+",
        template: { agency: "*", version: "+" }
    },
    AGENCY_ID_VERSION_ALL_AGENCY_PROVIDERID: {
        key: "AGENCY_ID_VERSION_ALL_AGENCY_PROVIDERID",
        url: "/agency,id,version/all/agency,providerId",
        template: { provider: { num: 1, providerId: true, providerAgency: true }, detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY }
    },
    AGENCY_ID_VERSION_ALL_PROVIDERID: {
        key: "AGENCY_ID_VERSION_ALL_PROVIDERID",
        url: "/agency,id,version/all/providerId",
        template: { provider: { num: 1, providerId: true, providerAgency: false }, detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY }
    },
    AGENCY_ID_VERSION_ALL_AGENCY_PROVIDERID1_PROVIDERID2: {
        key: "AGENCY_ID_VERSION_ALL_AGENCY_PROVIDERID1_PROVIDERID2",
        url: "/agency,id,version/all/providerId1+providerId2",
        template: { provider: { num: 2, providerId: true }, detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY }
    },

    getParameters(apiVersion) {
        var availableTests = [];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            // exclude from REST 2.0 the tests identifying data providers 
            availableTests.push(DATA_IDENTIFICATION_PARAMETERS.V2_AGENCY_ID_VERSION);
            availableTests.push(DATA_IDENTIFICATION_PARAMETERS.V2_AGENCY_ID_LATEST);
            availableTests.push(DATA_IDENTIFICATION_PARAMETERS.V2_ALL_ID_LATEST);
        } else {
            availableTests.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION);
            availableTests.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID_LATEST);
            availableTests.push(DATA_IDENTIFICATION_PARAMETERS.ALL_ID_LATEST);
            availableTests.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION_ALL_AGENCY_PROVIDERID)
            availableTests.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION_ALL_PROVIDERID)
            if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
                availableTests.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION_ALL_AGENCY_PROVIDERID1_PROVIDERID2)
            }
        }
        return availableTests;
    }
};
module.exports.DATA_IDENTIFICATION_PARAMETERS = Object.freeze(DATA_IDENTIFICATION_PARAMETERS);
