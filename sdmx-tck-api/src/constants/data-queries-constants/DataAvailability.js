const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;
const DATA_QUERY_KEY = require("./DataQueryKey.js").DATA_QUERY_KEY;
const STRUCTURES_REST_RESOURCE = require('../StructuresRestResources.js').STRUCTURES_REST_RESOURCE
const DATA_QUERY_MODE = require('./DataQueryMode.js').DATA_QUERY_MODE

const DATA_AVAILABILITY = {
    EXACT_SIMPLE_KEY:{ url: "/agency,dataflowId,version/A.B.C?mode=exact",template: {mode:DATA_QUERY_MODE.EXACT,key:DATA_QUERY_KEY.FULL_KEY}},
    AVAILABLE_SIMPLE_KEY:{ url: "/agency,dataflowId,version/A.B.C?mode=available", template: {mode:DATA_QUERY_MODE.AVAILABLE,key:DATA_QUERY_KEY.FULL_KEY}},
    TEMPORAL_COVERAGE_1:{ url: "/agency,dataflowId,version/all?startPeriod=2010-01", template: {startPeriod:"2010-01"}},
    TEMPORAL_COVERAGE_2:{ url: "/agency,dataflowId,version/all?endPeriod=2020-01", template: {endPeriod:"2020-01"}},
    TEMPORAL_COVERAGE_3:{ url: "/agency,dataflowId,version/all?startPeriod=2010-01&endPeriod=2020-01", template: {startPeriod:"2010-01",endPeriod:"2020-01"}},
    METRICS:{ url: "/agency,dataflowId,version/all (metrics)", template: {metrics:true}},
    SINGLE_DIMENSION:{ url: "/agency,dataflowId,version/all/all/DIM1", template: {component:true}},
    EXACT_COMPLEX_KEY:{ url: "/agency,dataflowId,version/A1+A2.B.C?mode=exact",template: {mode:DATA_QUERY_MODE.EXACT,key:DATA_QUERY_KEY.MANY_KEYS}},
    AVAILABLE_COMPLEX_KEY:{ url: "/agency,dataflowId,version/A1+A2.B.C?mode=available", template: {mode:DATA_QUERY_MODE.AVAILABLE,key:DATA_QUERY_KEY.MANY_KEYS}},
    REF_ALL:{ url: "/agency,dataflowId,version/all?references=all", template: {references:"all"}},
    REF_DSD:{ url: "/agency,dataflowId,version/all?references=datastructure", template: {references:STRUCTURES_REST_RESOURCE.datastructure}},
    REF_DF:{ url: "/agency,dataflowId,version/all?references=dataflow", template: {references:STRUCTURES_REST_RESOURCE.dataflow}},
    REF_CODELIST:{ url: "/agency,dataflowId,version/all?references=codelist", template: {references:STRUCTURES_REST_RESOURCE.codelist}},
    REF_CONCEPT_SCHEME:{ url: "/agency,dataflowId,version/all?references=conceptschemes", template: {references:STRUCTURES_REST_RESOURCE.conceptscheme}},
    REF_PROVIDER_SCHEME:{ url: "/agency,dataflowId,version/all/PROVIDER?references=dataproviderscheme", template: {provider:{num:1,providerId:true},references:STRUCTURES_REST_RESOURCE.dataproviderscheme}},


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
            dataAvailabilityTests.push(DATA_AVAILABILITY.EXACT_COMPLEX_KEY)
            dataAvailabilityTests.push(DATA_AVAILABILITY.AVAILABLE_COMPLEX_KEY)
            dataAvailabilityTests.push(DATA_AVAILABILITY.REF_ALL)
            dataAvailabilityTests.push(DATA_AVAILABILITY.REF_DSD)
            dataAvailabilityTests.push(DATA_AVAILABILITY.REF_DF)
            dataAvailabilityTests.push(DATA_AVAILABILITY.REF_CODELIST)
            dataAvailabilityTests.push(DATA_AVAILABILITY.REF_CONCEPT_SCHEME)
            dataAvailabilityTests.push(DATA_AVAILABILITY.REF_PROVIDER_SCHEME)

        }
        return dataAvailabilityTests;
    }
};

module.exports.DATA_AVAILABILITY = Object.freeze(DATA_AVAILABILITY);
