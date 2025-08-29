const { API_VERSIONS } = require('../constants/ApiVersions.js');

function getDataTestId(apiVersion, context, testKey, testUrl) {
    let id = "";
    if (testKey) {
        id = "(" + testKey + ") ";
    }
    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
        id += "/data/" + context + "/agency/id/version"
    } else {
        id += "/data/agency,id,version";
    }
    if (testUrl) {
        id += testUrl;
    }
    return id;
}

function getDataAvailabilityTestId(apiVersion, context, testKey, testUrl) {
    let id = "";
    if (testKey) {
        id = "(" + testKey + ") ";
    }
    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
        id += "/availability/" + context + "/agency/id/version"
    } else {
        id += "/availableconstraint/agency,id,version";
    }
    if (testUrl) {
        id += testUrl;
    }
    return id;
}

module.exports = {
    getDataTestId,
    getDataAvailabilityTestId
};