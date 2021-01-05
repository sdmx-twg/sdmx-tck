const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;
const DATA_QUERY_REPRESENTATIONS = require('./DataQueryRepresentations.js').DATA_QUERY_REPRESENTATIONS

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
 
    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
    };

module.exports.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS = Object.freeze(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS);
