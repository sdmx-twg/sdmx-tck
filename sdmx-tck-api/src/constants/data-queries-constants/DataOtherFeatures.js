const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;
const DATA_QUERY_REPRESENTATIONS = require('./DataQueryRepresentations.js').DATA_QUERY_REPRESENTATIONS


const DATA_OTHER_FEATURES = {
    COMPRESSION:{ url: "/agency,dataflowId,version/all (COMPRESSION)",template: {representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC,accept_encoding:"gzip",detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,}},
    LANGUAGE:{ url: "/agency,dataflowId,version/all (LANGUAGE)", template: {representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC,accept_language:"en",detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,}},
    CACHING:{ url: "/agency,dataflowId,version/all (CACHING)", template: {representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC,if_modified_since:new Date(),detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,}},
    

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
};

module.exports.DATA_OTHER_FEATURES = Object.freeze(DATA_OTHER_FEATURES);
