const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;

const DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS = {
    // START_PERIOD:{ url: "/agency,id,version/all?startPeriod=YYYYDDMM", template: {representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"}  },
    // END_PERIOD:{ url: "agency,id,version/all?endPeriod=YYYYDDMM",template: {representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"}},
    // UPDATE_AFTER:{url:"agency,id,version/all?updateAfter=YYYYDDMM", template: {representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"} },
    // FIRST_N_OBSERVATIONS:{ url:"agency,id,version/all?firstNObservations=YYYYDDMM", template: {representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"}  },
    // LAST_N_OBSERVATIONS:{ url: "agency,id,version/all?lastNObservations=YYYYDDMM",template: {representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"}},
    // INCLUDE_HISTORY:{ url: "agency,id,version/all?includeHistory=true",template: {representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"}},
    FULL_DETAIL:{url:"agency,id,version/all?detail=full", template: {detail:DATA_QUERY_DETAIL.FULL,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"} },
    DATA_ONLY_DETAIL:{url:"agency,id,version/all?detail=dataonly",template: {detail:DATA_QUERY_DETAIL.DATA_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"} },
    SERIES_KEYS_ONLY_DETAIL:{url:"agency,id,version/all?detail=serieskeysonly",template: {detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"} },
    NO_DATA_DETAIL:{url:"agency,id,version/all?detail=nodata",template: {detail:DATA_QUERY_DETAIL.NO_DATA,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"} },

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
    };

module.exports.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS = Object.freeze(DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS);
