const STRUCTURE_QUERY_REPRESENTATIONS = {
    EMPTY: "",
    SDMX_ML_21: "application/vnd.sdmx.structure+xml;version=2.1",
    SDMX_JSON_100: "application/vnd.sdmx.structure+json;version=1.0.0",
    INVALID_TYPE: "invalid representation query",
    WEIGHTED_SDMX_ML_21: "application/vnd.sdmx.structure+xml;version=2.1, application/vnd.sdmx.structure+json;version=1.0.0;q=0.9",
    WEIGHTED_SDMX_JSON_100: "application/vnd.sdmx.structure+xml;version=2.1;q=0.9, application/vnd.sdmx.structure+json;version=1.0.0",

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
};
export default STRUCTURE_QUERY_REPRESENTATIONS;