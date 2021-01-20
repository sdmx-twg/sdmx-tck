const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;
const DATA_QUERY_KEY = require("./DataQueryKey.js").DATA_QUERY_KEY;

const DATA_AVAILABILITY = {
    EXACT_SIMPLE_KEY:{ url: "/agency,dataflowId,version/A.B.C?mode=exact",template: {mode:"exact",key:DATA_QUERY_KEY.FULL_KEY}},
    AVAILABLE_SIMPLE_KEY:{ url: "/agency,dataflowId,version/A.B.C?mode=available", template: {mode:"available",key:DATA_QUERY_KEY.FULL_KEY}},
    TEMPORAL_COVERAGE_1:{ url: "/agency,dataflowId,version/all?startPeriod=2010-01", template: {startPeriod:"2010-01"}},
    TEMPORAL_COVERAGE_2:{ url: "/agency,dataflowId,version/all?endPeriod=2020-01", template: {endPeriod:"2020-01"}},
    TEMPORAL_COVERAGE_3:{ url: "/agency,dataflowId,version/all?startPeriod=2010-01&endPeriod=2020-01", template: {startPeriod:"2010-01",endPeriod:"2020-01"}},
    METRICS:{ url: "/agency,dataflowId,version/all (metrics)", template: {metrics:true}},
    SINGLE_DIMENSION:{ url: "/agency,dataflowId,version/all/all/DIM1", template: {component:true}},
    

    getDataAvailabilityParameters(apiVersion) {
        var dataAvailabilityTests = [];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
            dataAvailabilityTests.push(DATA_AVAILABILITY.EXACT_SIMPLE_KEY)
            dataAvailabilityTests.push(DATA_AVAILABILITY.AVAILABLE_SIMPLE_KEY)
            dataAvailabilityTests.push(DATA_AVAILABILITY.TEMPORAL_COVERAGE_1)
            dataAvailabilityTests.push(DATA_AVAILABILITY.TEMPORAL_COVERAGE_2)
            dataAvailabilityTests.push(DATA_AVAILABILITY.TEMPORAL_COVERAGE_3)
            dataAvailabilityTests.push(DATA_AVAILABILITY.METRICS)
            dataAvailabilityTests.push(DATA_AVAILABILITY.SINGLE_DIMENSION)
          

        }
        return dataAvailabilityTests;
    }
};

module.exports.DATA_AVAILABILITY = Object.freeze(DATA_AVAILABILITY);
