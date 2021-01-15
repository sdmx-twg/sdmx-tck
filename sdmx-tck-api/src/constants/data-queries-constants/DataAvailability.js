const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;

const DATA_AVAILABILITY = {
    EXACT_SIMPLE_KEY:{ url: "/agency,dataflowId,version/A.B.C?mode=exact",template: {mode:"exact"}},
    AVAILABLE_SIMPLE_KEY:{ url: "/agency,dataflowId,version/A.B.C?mode=available", template: {mode:"available"}},
    
    getDataAvailabilityParameters(apiVersion) {
        var dataAvailabilityTests = [];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
            dataAvailabilityTests.push(DATA_AVAILABILITY.EXACT_SIMPLE_KEY)
            dataAvailabilityTests.push(DATA_AVAILABILITY.AVAILABLE_SIMPLE_KEY)
        }
        return dataAvailabilityTests;
    }
};

module.exports.DATA_AVAILABILITY = Object.freeze(DATA_AVAILABILITY);
