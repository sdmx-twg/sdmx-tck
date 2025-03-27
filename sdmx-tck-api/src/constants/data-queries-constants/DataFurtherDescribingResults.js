const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;
const DIMENSION_AT_OBSERVATION_CONSTANTS = require('../DimensionAtObservationConstants.js').DIMENSION_AT_OBSERVATION_CONSTANTS;
const Utils = require('../../utils/Utils.js');

const DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS = {
    START_PERIOD: {
        key: "START_PERIOD",
        url: "?startPeriod=YYYYDDMM",
        template: { startPeriod: true },
        fromVersion: "v1.0.0", 
        toVersion: "v1.5.0"
    },
    V2_START_PERIOD: {
        key: "START_PERIOD",
        url: "?c[TIME_PERIOD]=ge:YYYYDDMM",
        template: { startPeriod: true },
        fromVersion: "v2.0.0"
    },
    END_PERIOD: {
        key: "END_PERIOD",
        url: "?endPeriod=YYYYDDMM",
        template: { endPeriod: true },
        fromVersion: "v1.0.0", 
        toVersion: "v1.5.0"
    },
    V2_END_PERIOD: {
        key: "END_PERIOD",
        url: "?c[TIME_PERIOD]=le:YYYYDDMM",
        template: { endPeriod: true },
        fromVersion: "v2.0.0"
    },
    START_END_PERIOD: {
        key: "START_END_PERIOD",
        url: "?startPeriod=YYYYDDMM&endPeriod=YYYYDDMM",
        template: { startPeriod: true, endPeriod: true },
        fromVersion: "v1.0.0", 
        toVersion: "v1.5.0"
    },
    V2_START_END_PERIOD: {
        key: "START_END_PERIOD",
        url: "?c[TIME_PERIOD]=ge:YYYYDDMM+le:YYYYDDMM",
        template: { startPeriod: true, endPeriod: true },
        fromVersion: "v2.0.0"
    },
    LAST_N_OBS_START_END_PERIOD: {
        key: "LAST_N_OBS_START_END_PERIOD",
        url: "?lastNObservations=X&startPeriod=YYYYDDMM&endPeriod=YYYYDDMM",
        template: { startPeriod: true, endPeriod: true, lastNObservations: true },
        fromVersion: "v1.0.0", 
        toVersion: "v1.5.0"
    },
    V2_LAST_N_OBS_START_END_PERIOD: {
        key: "LAST_N_OBS_START_END_PERIOD",
        url: "?lastNObservations=X&c[TIME_PERIOD]=ge:YYYYDDMM+le:YYYYDDMM",
        template: { startPeriod: true, endPeriod: true, lastNObservations: true },
        fromVersion: "v2.0.0"
    },
    UPDATED_AFTER: {
        key: "UPDATED_AFTER",
        url: "?updatedAfter=YYYYDDMM",
        template: { updatedAfter: true },
        fromVersion: "v1.0.0"
    },
    FIRST_N_OBS: {
        key: "FIRST_N_OBS",
        url: "?firstNObservations=X",
        template: { firstNObservations: true },
        fromVersion: "v1.0.0"
    },
    LAST_N_OBS: {
        key: "LAST_N_OBS",
        url: "?lastNObservations=X",
        template: { lastNObservations: true },
        fromVersion: "v1.0.0"
    },
    INCLUDE_HISTORY: {
        key: "INCLUDE_HISTORY",
        url: "?includeHistory=true", 
        template: { includeHistory: true },
        fromVersion: "v1.1.0"
    },
    FULL_DETAIL: {
        key: "FULL_DETAIL",
        url: "?detail=full",
        template: { detail: DATA_QUERY_DETAIL.FULL },
        fromVersion: "v1.0.0", 
        toVersion: "v1.5.0"
    },
    V2_FULL_DETAIL: {
        key: "FULL_DETAIL",
        url: "?attributes=all&measures=all",
        template: { detail: DATA_QUERY_DETAIL.FULL, attributes: "all", measures: "all" },
        fromVersion: "v2.0.0"
    },
    DATA_ONLY_DETAIL: {
        key: "DATA_ONLY_DETAIL",
        url: "?detail=dataonly",
        template: { detail: DATA_QUERY_DETAIL.DATA_ONLY },
        fromVersion: "v1.0.0", 
        toVersion: "v1.5.0"
    },
    V2_DATA_ONLY_DETAIL: {
        key: "DATA_ONLY_DETAIL",
        url: "?attributes=none&measures=all",
        template: { detail: DATA_QUERY_DETAIL.DATA_ONLY, attributes: "none", measures: "all" },
        fromVersion: "v2.0.0"
    },
    SERIES_KEYS_ONLY_DETAIL: {
        key: "SERIES_KEYS_ONLY_DETAIL",
        url: "?detail=serieskeysonly",
        template: { detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY },
        fromVersion: "v1.0.0", 
        toVersion: "v1.5.0"
    },
    V2_SERIES_KEYS_ONLY_DETAIL: {
        key: "SERIES_KEYS_ONLY_DETAIL",
        url: "?attributes=none&measures=none",
        template: { detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY, attributes: "none", measures: "none" },
        fromVersion: "v2.0.0"
    },
    NO_DATA_DETAIL: {
        key: "NO_DATA_DETAIL",
        url: "?detail=nodata",
        template: { detail: DATA_QUERY_DETAIL.NO_DATA },
        fromVersion: "v1.0.0", 
        toVersion: "v1.5.0"
    },
    V2_NO_DATA_DETAIL: {
        key: "NO_DATA_DETAIL",
        url: "?attributes=series&measures=none",
        template: { detail: DATA_QUERY_DETAIL.NO_DATA, attributes: "series", measures: "none" },
        fromVersion: "v2.0.0"
    },
    DIM_OBS_TIME_PERIOD: {
        key: "DIM_OBS_TIME_PERIOD",
        url: "?dimensionAtObservation=TIME_PERIOD",
        template: { dimensionAtObservation: DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD },
        fromVersion: "v1.0.0"
    },
    DIM_OBS_DIM: {
        key: "DIM_OBS_DIM",
        url: "?dimensionAtObservation=DIM",
        template: { dimensionAtObservation: DIMENSION_AT_OBSERVATION_CONSTANTS.DIMENSION },
        fromVersion: "v1.0.0"
    },
    DIM_OBS_ALLDIMENSIONS: {
        key: "DIM_OBS_ALLDIMENSIONS",
        url: "?dimensionAtObservation=AllDimensions",
        template: { dimensionAtObservation: DIMENSION_AT_OBSERVATION_CONSTANTS.ALLDIMENSIONS },
        fromVersion: "v1.0.0"
    },
    DIM_OBS_NOT_PROVIDED: {
        key: "DIM_OBS_NOT_PROVIDED",
        url: "?dimensionAtObservation=(DIMENSION AT OBSEVATION NOT PROVIDED)",
        template: { dimensionAtObservation: DIMENSION_AT_OBSERVATION_CONSTANTS.NOT_PROVIDED },
        fromVersion: "v1.0.0"
    },

    getParameters(apiVersion) {
        var tests = [];
        for (const [key, value] of Object.entries(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS)) {
            if (typeof value !== 'function') {
                if (Utils.isVersionWithinRange(apiVersion, value.fromVersion, value.toVersion)) {
                    tests.push({ ...value });
                }
            }
        }
        return tests;
    }
};

module.exports.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS = Object.freeze(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS);
