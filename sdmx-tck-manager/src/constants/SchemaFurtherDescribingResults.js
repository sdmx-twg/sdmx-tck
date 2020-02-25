const SCHEMA_FURTHER_DESCRIBING_RESULTS = {
    DIMENSION_AT_OBS:{ url: "?dimensionAtObservation=<id>", template: {} },
    EXPLICIT_MEASURE:{ url: "?explicitMeasure=true", template: {} },

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
}

module.exports.SCHEMA_FURTHER_DESCRIBING_RESULTS = Object.freeze(SCHEMA_FURTHER_DESCRIBING_RESULTS);