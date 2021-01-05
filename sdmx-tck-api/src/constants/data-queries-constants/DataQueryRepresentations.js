const DATA_QUERY_REPRESENTATIONS = {
    GENERIC: "application/vnd.sdmx.genericdata+xml;version=2.1",
    STRUCTURE_SPECIFIC: "application/vnd.sdmx.structurespecificdata+xml;version=2.1",
    GENERIC_TIME_SERIES: "application/vnd.sdmx.generictimeseriesdata+xml;version=2.1",
    STRUCTURE_SPECIFIC_TIME_SERIES: "application/vnd.sdmx.structurespecifictimeseriesdata+xml;version=2.1",
    JSON_1_0_0: "application/vnd.sdmx.data+json;version=1.0.0",
    CSV_1_0_0: "application/vnd.sdmx.data+csv;version=1.0.0",

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
};

module.exports.DATA_QUERY_REPRESENTATIONS = Object.freeze(DATA_QUERY_REPRESENTATIONS);