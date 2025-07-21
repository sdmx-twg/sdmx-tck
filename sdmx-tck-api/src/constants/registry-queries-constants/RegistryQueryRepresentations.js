const REGISTRY_QUERY_REPRESENTATIONS = {
    SDMX_ML_3: "application/vnd.sdmx.registry+xml;version=3.0.0",

    getDefaultRepresentation() {
        return REGISTRY_QUERY_REPRESENTATIONS.SDMX_ML_3;
    }
};

module.exports.REGISTRY_QUERY_REPRESENTATIONS = Object.freeze(REGISTRY_QUERY_REPRESENTATIONS);