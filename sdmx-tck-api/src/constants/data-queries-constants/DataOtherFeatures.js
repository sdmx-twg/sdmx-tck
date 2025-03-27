const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;

const DATA_OTHER_FEATURES = {
    COMPRESSION: {
        key: "COMPRESSION",
        url: "",
        template: {
            accept_encoding: "gzip",
            detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,
            attributes: "none",
            measures: "none"
        }
    },
    LANGUAGE: {
        key: "LANGUAGE",
        url: "",
        template: {
            accept_language: "en",
            detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,
            attributes: "none",
            measures: "none"
        }
    },
    CACHING: {
        key: "CACHING",
        url: "",
        template: {
            if_modified_since: new Date(),
            detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,
            attributes: "none",
            measures: "none"
        }
    },

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
};

module.exports.DATA_OTHER_FEATURES = Object.freeze(DATA_OTHER_FEATURES);
