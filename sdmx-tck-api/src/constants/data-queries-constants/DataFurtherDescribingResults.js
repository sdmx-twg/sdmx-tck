const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;
const DATA_QUERY_REPRESENTATIONS = require('./DataQueryRepresentations.js').DATA_QUERY_REPRESENTATIONS
const DIMENSION_AT_OBSERVATION_CONSTANTS = require('../DimensionAtObservationConstants.js').DIMENSION_AT_OBSERVATION_CONSTANTS;
const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;

const DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS = {
    START_PERIOD:{ url: "/agency,id,version/all?startPeriod=YYYYDDMM", template: {startPeriod:true,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}  },
    END_PERIOD:{ url: "/agency,id,version/all?endPeriod=YYYYDDMM",template: {endPeriod:true,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}},
    START_END_PERIOD:{ url: "/agency,id,version/all?startPeriod=YYYYDDMM&endPeriod=YYYYDDMM", template: {startPeriod:true,endPeriod:true,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}  },
    LAST_N_OBSERVATIONS_START_END_PERIOD:{ url: "/agency,id,version/all?lastNObservations=X&startPeriod=YYYYDDMM&endPeriod=YYYYDDMM",template: {startPeriod:true,endPeriod:true,lastNObservations:true,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}},
    UPDATE_AFTER:{url:"/agency,id,version/all?updateAfter=YYYYDDMM", template: {updateAter:true,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },
    FIRST_N_OBSERVATIONS:{ url:"/agency,id,version/all?firstNObservations=X", template: {firstNObservations:true,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}  },
    LAST_N_OBSERVATIONS:{ url: "/agency,id,version/all?lastNObservations=X",template: {lastNObservations:true,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}},
    INCLUDE_HISTORY:{ url: "/agency,id,version/all?includeHistory=true",template: {includeHistory:true,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}},
    FULL_DETAIL:{url:"/agency,id,version/all?detail=full", template: {detail:DATA_QUERY_DETAIL.FULL,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },
    DATA_ONLY_DETAIL:{url:"/agency,id,version/all?detail=dataonly",template: {detail:DATA_QUERY_DETAIL.DATA_ONLY,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },
    SERIES_KEYS_ONLY_DETAIL:{url:"/agency,id,version/all?detail=serieskeysonly",template: {detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },
    NO_DATA_DETAIL:{url:"/agency,id,version/all?detail=nodata",template: {detail:DATA_QUERY_DETAIL.NO_DATA,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },
    DIM_OBS_TIME_PERIOD:{url:"/agency,id,version/all?dimensionAtObservation=TIME_PERIOD",template: {dimensionAtObservation:DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },
    DIM_OBS_DIM:{url:"/agency,id,version/all?dimensionAtObservation=DIM",template: {dimensionAtObservation:DIMENSION_AT_OBSERVATION_CONSTANTS.DIMENSION,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },
    DIM_OBS_ALLDIMENSIONS:{url:"/agency,id,version/all?dimensionAtObservation=AllDimensions",template: {dimensionAtObservation:DIMENSION_AT_OBSERVATION_CONSTANTS.ALLDIMENSIONS,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },
    DIM_OBS_NOT_PROVIDED:{url:"/agency,id,version/all (DIMENSION AT OBSEVATION NOT PROVIDED)",template: {dimensionAtObservation:DIMENSION_AT_OBSERVATION_CONSTANTS.NOT_PROVIDED,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },

    getDataFurtherDescribingParameters(apiVersion){
        var availableTests= [];
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.START_PERIOD);
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.END_PERIOD);
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.START_END_PERIOD);
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.LAST_N_OBSERVATIONS_START_END_PERIOD)
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.UPDATE_AFTER)
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.FIRST_N_OBSERVATIONS);
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.LAST_N_OBSERVATIONS);
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.INCLUDE_HISTORY);
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.FULL_DETAIL)
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.DATA_ONLY_DETAIL)
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.SERIES_KEYS_ONLY_DETAIL)
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.NO_DATA_DETAIL);
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.DIM_OBS_TIME_PERIOD);
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.DIM_OBS_DIM);
            availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.DIM_OBS_ALLDIMENSIONS)
            if (API_VERSIONS[apiVersion] < API_VERSIONS["v1.1.0"]) {
                availableTests.push(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.DIM_OBS_NOT_PROVIDED)
                
            }
            return availableTests;
    }
    };

module.exports.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS = Object.freeze(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS);
