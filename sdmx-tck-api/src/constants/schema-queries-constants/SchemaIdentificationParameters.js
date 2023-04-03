const SCHEMA_IDENTIFICATION_PARAMETERS = {
    AGENCY_ID_VERSION: { url: "/agency/id/version", template: {} },
    AGENCY_ID: { url: "/agency/id", template: { version: 'latest' } },

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
};

module.exports.SCHEMA_IDENTIFICATION_PARAMETERS = Object.freeze(SCHEMA_IDENTIFICATION_PARAMETERS);