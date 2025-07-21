const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;
const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;
const DATA_QUERY_REPRESENTATIONS = require('./DataQueryRepresentations.js').DATA_QUERY_REPRESENTATIONS

const DATA_RESPRESENTATION_SUPPORT = {
    GENERIC_DATA: {
        key: "GENERIC_DATA",
        url: "/application/vnd.sdmx.genericdata+xml;version=2.1",
        template: { detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY, representation: DATA_QUERY_REPRESENTATIONS.GENERIC }
    },
    STRUCTURE_SPECIFIC_DATA: {
        key: "STRUCTURE_SPECIFIC_DATA",
        url: "/application/vnd.sdmx.structurespecificdata+xml;version=2.1",
        template: { detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY, representation: DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC }
    },
    GENERIC_TIME_SERIES_DATA: {
        key: "GENERIC_TIME_SERIES_DATA",
        url: "/application/vnd.sdmx.generictimeseriesdata+xml;version=2.1",
        template: { detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY, representation: DATA_QUERY_REPRESENTATIONS.GENERIC_TIME_SERIES }
    },
    STRUCTURE_SPECIFIC_TIME_SERIES_DATA: {
        key: "STRUCTURE_SPECIFIC_TIME_SERIES_DATA",
        url: "/application/vnd.sdmx.structurespecifictimeseriesdata+xml;version=2.1",
        template: { detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY, representation: DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC_TIME_SERIES }
    },
    JSON_1_0_0_DATA: {
        key: "JSON_1_0_0_DATA",
        url: "/application/vnd.sdmx.data+json;version=1.0.0",
        template: { detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY, representation: DATA_QUERY_REPRESENTATIONS.JSON_1_0_0 }
    },
    CSV_1_0_0_DATA: {
        key: "CSV_1_0_0_DATA",
        url: "/application/vnd.sdmx.data+csv;version=1.0.0",
        template: { detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY, representation: DATA_QUERY_REPRESENTATIONS.CSV_1_0_0 }
    },
    JSON_2_0_0_DATA: {
        key: "JSON_2_0_0_DATA",
        url: "/application/vnd.sdmx.data+json;version=2.0.0",
        template: {
            representation: DATA_QUERY_REPRESENTATIONS.JSON_2_0_0,
            detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,
            attributes: "none",
            measures: "none"
        }
    },
    CSV_2_0_0_DATA: {
        key: "CSV_2_0_0_DATA",
        url: "/application/vnd.sdmx.data+csv;version=2.0.0",
        template: {
            representation: DATA_QUERY_REPRESENTATIONS.CSV_2_0_0,
            detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,
            attributes: "none",
            measures: "none"
        }
    },
    XML_3_DATA: {
        key: "XML_3_DATA",
        url: "/application/vnd.sdmx.data+xml;version=3.0.0",
        template: {
            representation: DATA_QUERY_REPRESENTATIONS.XML_3,
            detail: DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,
            attributes: "none",
            measures: "none"
        }
    },

    getDataRepresentationSupportParameters(apiVersion) {
        var dataRepresentationSupportParameters = [];
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            dataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.JSON_2_0_0_DATA);
            dataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.CSV_2_0_0_DATA);
            dataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.XML_3_DATA);
        } else {
            dataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.GENERIC_DATA);
            dataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.STRUCTURE_SPECIFIC_DATA);
            dataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.GENERIC_TIME_SERIES_DATA);
            dataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.STRUCTURE_SPECIFIC_TIME_SERIES_DATA);
            
            if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
                dataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.JSON_1_0_0_DATA)
                dataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.CSV_1_0_0_DATA)
            }
        }
        return dataRepresentationSupportParameters;
    }

}

module.exports.DATA_RESPRESENTATION_SUPPORT = Object.freeze(DATA_RESPRESENTATION_SUPPORT)