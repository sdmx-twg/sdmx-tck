const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;
const DATA_QUERY_KEY = require("./DataQueryKey.js").DATA_QUERY_KEY;
const DATA_QUERY_REPRESENTATIONS = require('./DataQueryRepresentations.js').DATA_QUERY_REPRESENTATIONS

const DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS = {
    FULL_KEY:{ url: "/agency,id,version/DIM1.DIM2.DIM3.DIMn", template: {key:DATA_QUERY_KEY.FULL_KEY, detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}  },
    PARTIAL_KEY:{ url: "/agency,id,version/DIM1.DIM2..DIMn",template: {key:DATA_QUERY_KEY.PARTIAL_KEY,detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}},
    MANY_KEYS:{url:"/agency,id,version/DIM1.DIM2.DIM31+DIM32.DIMn", template: {key:DATA_QUERY_KEY.MANY_KEYS,detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC} },

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
    };

module.exports.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS = Object.freeze(DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS);
