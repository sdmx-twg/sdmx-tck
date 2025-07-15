const { SDMX_MESSAGE_FORMAT } = require('../SdmxMessageFormat.js');

const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;

const DATA_QUERY_REPRESENTATIONS = {
    GENERIC: "application/vnd.sdmx.genericdata+xml;version=2.1",
    STRUCTURE_SPECIFIC: "application/vnd.sdmx.structurespecificdata+xml;version=2.1",
    GENERIC_TIME_SERIES: "application/vnd.sdmx.generictimeseriesdata+xml;version=2.1",
    STRUCTURE_SPECIFIC_TIME_SERIES: "application/vnd.sdmx.structurespecifictimeseriesdata+xml;version=2.1",
    JSON_1_0_0: "application/vnd.sdmx.data+json;version=1.0.0",
    CSV_1_0_0: "application/vnd.sdmx.data+csv;version=1.0.0",
    JSON_2_0_0: "application/vnd.sdmx.data+json;version=2.0.0",
    CSV_2_0_0: "application/vnd.sdmx.data+csv;version=2.0.0",
    XML_3: "application/vnd.sdmx.data+xml;version=3.0.0",

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    },
    getStructureSpecific(apiVersion) {
        return API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"] ? 
                DATA_QUERY_REPRESENTATIONS.XML_3 : DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC;
    },
    getRepresentation(format) {
        if (format === SDMX_MESSAGE_FORMAT.XML_V21.key) {
            return DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC;    
        } else if (format === SDMX_MESSAGE_FORMAT.XML_V300.key) {
            return DATA_QUERY_REPRESENTATIONS.XML_3;
        } else if (format === SDMX_MESSAGE_FORMAT.JSON_V200.key) {
            return DATA_QUERY_REPRESENTATIONS.JSON_2_0_0;
        }
    }
};

module.exports.DATA_QUERY_REPRESENTATIONS = Object.freeze(DATA_QUERY_REPRESENTATIONS);