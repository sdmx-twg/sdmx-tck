const DATA_QUERY_KEY = require("./DataQueryKey.js").DATA_QUERY_KEY;
const Utils = require('../../utils/Utils.js');

const DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS = {
    FULL_KEY: {
        key: "FULL_KEY",
        url: "/DIM1.DIM2.DIM3.DIMn",
        template: {
            key: DATA_QUERY_KEY.FULL_KEY, 
            keyInPath: true
        },
    },
    PARTIAL_KEY: {
        key: "PARTIAL_KEY",
        url: "/DIM1.DIM2..DIMn",
        template: {
            key: DATA_QUERY_KEY.PARTIAL_KEY,
            keyInPath: true
        }
    },
    MANY_KEYS: {
        key: "MANY_KEYS",
        url: "/DIM1.DIM2.DIM31+DIM32.DIMn",
        template: {
            key: DATA_QUERY_KEY.MANY_KEYS,
            keyInPath: true
        },
        toVersion: "v1.5.0"
    },
    V2_MANY_KEYS: {
        key: "MANY_KEYS",
        url: "?c[DIM1]=A&c[DIM2]=B&c[DIM3]=C,D&c[DIMn]=N",
        template: {
            key: DATA_QUERY_KEY.MANY_KEYS,
            keyInPath: false
        },
        fromVersion: "v2.0.0"
    },

    getParameters(apiVersion) {
        var tests = [];
        for (const [key, value] of Object.entries(DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS)) {
            if (typeof value !== 'function') {
                // Check if the test is applicable for the privided api version.
                if (Utils.isVersionWithinRange(apiVersion, value.fromVersion, value.toVersion)) {
                    tests.push({ ...value });
                }
            }
        }
        return tests;
    }
};

module.exports.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS = Object.freeze(DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS);
