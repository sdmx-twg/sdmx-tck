const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;

const DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS = {
    FULL_KEY:{ url: "/agency,id,version/DIM1.DIM2.DIM3.DIMn", template: {detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"}  },
    PARTIAL_KEY:{ url: "/agency,id,version/DIM1.DIM2..DIMn",template: {detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"}},
    MANY_KEYS:{url:"/agency,id,version/DIM1.DIM2.DIM31+DIM32.DIMn", template: {detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"} },

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
    };

module.exports.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS = Object.freeze(DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS);
