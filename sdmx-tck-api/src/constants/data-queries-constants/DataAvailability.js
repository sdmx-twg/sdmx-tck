const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;
const Utils = require('../../utils/Utils.js');
const DATA_QUERY_KEY = require("./DataQueryKey.js").DATA_QUERY_KEY;
const STRUCTURES_REST_RESOURCE = require('../StructuresRestResources.js').STRUCTURES_REST_RESOURCE
const DATA_QUERY_MODE = require('./DataQueryMode.js').DATA_QUERY_MODE

const DATA_AVAILABILITY = {
    EXACT_SIMPLE_KEY:{ key: "EXACT_SIMPLE_KEY", url: "/A.B.C?mode=exact",template: {mode:DATA_QUERY_MODE.EXACT,key:DATA_QUERY_KEY.FULL_KEY, keyInPath: true}, fromVersion: "v1.3.0"},
    AVAILABLE_SIMPLE_KEY:{ key: "AVAILABLE_SIMPLE_KEY", url: "/A.B.C?mode=available", template: {mode:DATA_QUERY_MODE.AVAILABLE,key:DATA_QUERY_KEY.FULL_KEY, keyInPath: true}, fromVersion: "v1.3.0"},
    
    EXACT_COMPLEX_KEY:{ key: "EXACT_COMPLEX_KEY", url: "/A1+A2.B.C?mode=exact",template: {mode:DATA_QUERY_MODE.EXACT,key:DATA_QUERY_KEY.MANY_KEYS, keyInPath: true}, fromVersion: "v1.3.0", toVersion: "v1.5.0"},
    AVAILABLE_COMPLEX_KEY:{ key: "AVAILABLE_COMPLEX_KEY", url: "/A1+A2.B.C?mode=available", template: {mode:DATA_QUERY_MODE.AVAILABLE,key:DATA_QUERY_KEY.MANY_KEYS, keyInPath: true}, fromVersion: "v1.3.0", toVersion: "v1.5.0"},

    V2_EXACT_COMPLEX_KEY:{ key: "EXACT_COMPLEX_KEY", url: "?c[DIM1]=A1,A2&c[DIM2]=B&c[DIM3]=C&mode=exact", template: { mode: DATA_QUERY_MODE.EXACT, key: DATA_QUERY_KEY.MANY_KEYS, keyInPath: false}, fromVersion: "v2.0.0"},
    V2_AVAILABLE_COMPLEX_KEY:{ key: "AVAILABLE_COMPLEX_KEY", url: "?c[DIM1]=A1,A2&c[DIM2]=B&c[DIM3]=C&mode=available", template: { mode: DATA_QUERY_MODE.AVAILABLE, key: DATA_QUERY_KEY.MANY_KEYS, keyInPath: false}, fromVersion: "v2.0.0"},

    TEMPORAL_COVERAGE_START:{ key: "TEMPORAL_COVERAGE_START", url: "/all?startPeriod=2010-01", template: {startPeriod:"2010-01"}, fromVersion: "v1.3.0", toVersion: "v1.5.0"},
    TEMPORAL_COVERAGE_END:{ key: "TEMPORAL_COVERAGE_END", url: "/all?endPeriod=2020-01", template: {endPeriod:"2020-01"}, fromVersion: "v1.3.0", toVersion: "v1.5.0"},
    TEMPORAL_COVERAGE_START_END:{ key: "TEMPORAL_COVERAGE_START_END", url: "/all?startPeriod=2010-01&endPeriod=2020-01", template: {startPeriod:"2010-01",endPeriod:"2020-01"}, fromVersion: "v1.3.0", toVersion: "v1.5.0"},

    V2_TEMPORAL_COVERAGE_START:{ key: "TEMPORAL_COVERAGE_START", url: "?c[TIME_PERIOD]=ge:2010-01", template: {startPeriod:"2010-01"}, fromVersion: "v2.0.0"},
    V2_TEMPORAL_COVERAGE_END:{ key: "TEMPORAL_COVERAGE_END", url: "?c[TIME_PERIOD]=le:2020-01", template: {endPeriod:"2020-01"}, fromVersion: "v2.0.0"},
    V2_TEMPORAL_COVERAGE_START_END:{ key: "TEMPORAL_COVERAGE_START_END", url: "?c[TIME_PERIOD]=ge:2010-01+le:2020-01", template: {startPeriod:"2010-01",endPeriod:"2020-01"}, fromVersion: "v2.0.0"},

    METRICS:{ key: "METRICS", url: "/all", template: {metrics:true}, fromVersion: "v1.3.0"},
    SINGLE_DIMENSION:{ key: "SINGLE_DIMENSION", url: "/all/all/DIM1", template: {component:true}, fromVersion: "v1.3.0"},
    REF_ALL:{ key: "REF_ALL", url: "/all?references=all", template: {references:"all"}, fromVersion: "v1.3.0"},
    REF_DSD:{ key: "REF_DSD", url: "/all?references=datastructure", template: {references:STRUCTURES_REST_RESOURCE.datastructure}, fromVersion: "v1.3.0"},
    REF_DF:{ key: "REF_DF", url: "/all?references=dataflow", template: {references:STRUCTURES_REST_RESOURCE.dataflow}, fromVersion: "v1.3.0"},
    REF_CODELIST:{ key: "REF_CODELIST", url: "/all?references=codelist", template: {references:STRUCTURES_REST_RESOURCE.codelist}, fromVersion: "v1.3.0"},
    REF_CONCEPT_SCHEME:{ key: "REF_CONCEPT_SCHEME", url: "/all?references=conceptschemes", template: {references:STRUCTURES_REST_RESOURCE.conceptscheme}, fromVersion: "v1.3.0"},
    REF_PROVIDER_SCHEME:{ key: "REF_PROVIDER_SCHEME", url: "/all/PROVIDER?references=dataproviderscheme", template: {provider:{num:1,providerId:true},references:STRUCTURES_REST_RESOURCE.dataproviderscheme}, fromVersion: "v1.3.0", toVersion: "v1.5.0"},

    getValuesList() {
        var values = Object.values(DATA_AVAILABILITY);
        return values.filter(function (value) {
            return typeof value !== 'function';
        });
    },
    getParameters(apiVersion, context) {
        var dataAvailabilityTests = [];
        for (const [key, value] of Object.entries(DATA_AVAILABILITY)) {
            if (typeof value !== 'function') {
                let test = { ...value};
                // Check if the test is applicable for the privided api version.
                if (Utils.isVersionWithinRange(apiVersion, test.fromVersion, test.toVersion)) {
                    // Add dynamically the property 'context' into the template for versions >= 2.0.0
                    let template = { ...test.template };
                    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
                        template = { ...test.template, context }
                    }
                    dataAvailabilityTests.push({ ...test, template });
                }
            }
        }
        return dataAvailabilityTests;
    }
};

module.exports.DATA_AVAILABILITY = Object.freeze(DATA_AVAILABILITY);
