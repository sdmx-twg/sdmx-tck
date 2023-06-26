const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;
const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;
const DATA_QUERY_REPRESENTATIONS = require('./DataQueryRepresentations.js').DATA_QUERY_REPRESENTATIONS

const DATA_RESPRESENTATION_SUPPORT = {
    GENERIC_DATA:{url:"/agency,id,version/all/application/vnd.sdmx.genericdata+xml;version=2.1",template:{detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.GENERIC}},
    STRUCTURE_SPECIFIC_DATA:{url:"/agency,id,version/all/application/vnd.sdmx.structurespecificdata+xml;version=2.1",template:{detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC}},
    GENERIC_TIME_SERIES_DATA:{url:"/agency,id,version/all/application/vnd.sdmx.generictimeseriesdata+xml;version=2.1",template:{detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.GENERIC_TIME_SERIES}},
    STRUCTURE_SPECIFIC_TIME_SERIES_DATA:{url:"/agency,id,version/all/application/vnd.sdmx.structurespecifictimeseriesdata+xml;version=2.1",template:{detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC_TIME_SERIES}},
    JSON_1_0_0_DATA:{url:"/agency,id,version/all/application/vnd.sdmx.data+json;version=1.0.0",template:{detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.JSON_1_0_0}},
    CSV_1_0_0_DATA:{url:"/agency,id,version/all/application/vnd.sdmx.data+csv;version=1.0.0",template:{detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:DATA_QUERY_REPRESENTATIONS.CSV_1_0_0}},

    getDataRepresentationSupportParameters(apiVersion) {
        var availableDataRepresentationSupportParameters = [];
        availableDataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.GENERIC_DATA);
        availableDataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.STRUCTURE_SPECIFIC_DATA);
        availableDataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.GENERIC_TIME_SERIES_DATA);
        availableDataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.STRUCTURE_SPECIFIC_TIME_SERIES_DATA)
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
            availableDataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.JSON_1_0_0_DATA)
            availableDataRepresentationSupportParameters.push(DATA_RESPRESENTATION_SUPPORT.CSV_1_0_0_DATA)
        }
        return availableDataRepresentationSupportParameters;
    }

}

module.exports.DATA_RESPRESENTATION_SUPPORT = Object.freeze(DATA_RESPRESENTATION_SUPPORT)