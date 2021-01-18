const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;

const DATA_AVAILABILITY = {
    EXACT_SIMPLE_KEY:{ url: "/agency,dataflowId,version/A.B.C?mode=exact",template: {mode:"exact"}},
    AVAILABLE_SIMPLE_KEY:{ url: "/agency,dataflowId,version/A.B.C?mode=available", template: {mode:"available"}},
    TEMPORAL_COVERAGE_1:{ url: "/agency,dataflowId,version/all?startPeriod=2010-01", template: {startPeriod:"2010-01"}},
    TEMPORAL_COVERAGE_2:{ url: "/agency,dataflowId,version/all?endPeriod=2020-01", template: {endPeriod:"2020-01"}},
    TEMPORAL_COVERAGE_3:{ url: "/agency,dataflowId,version/all?startPeriod=2010-01&endPeriod=2020-01", template: {startPeriod:"2010-01",endPeriod:"2020-01"}},
    METRICS:{ url: "/agency,dataflowId,version/all (metrics)", template: {metrics:true}},

    getDataAvailabilityParameters(apiVersion) {
        var dataAvailabilityTests = [];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
            dataAvailabilityTests.push(DATA_AVAILABILITY.EXACT_SIMPLE_KEY)
            dataAvailabilityTests.push(DATA_AVAILABILITY.AVAILABLE_SIMPLE_KEY)
            dataAvailabilityTests.push(DATA_AVAILABILITY.TEMPORAL_COVERAGE_1)
            dataAvailabilityTests.push(DATA_AVAILABILITY.TEMPORAL_COVERAGE_2)
            dataAvailabilityTests.push(DATA_AVAILABILITY.TEMPORAL_COVERAGE_3)
            dataAvailabilityTests.push(DATA_AVAILABILITY.METRICS)
        }
        return dataAvailabilityTests;
    }
};

module.exports.DATA_AVAILABILITY = Object.freeze(DATA_AVAILABILITY);
