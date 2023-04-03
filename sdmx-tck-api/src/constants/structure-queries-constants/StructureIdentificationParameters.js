const STRUCTURE_IDENTIFICATION_PARAMETERS = {
    AGENCY_ID_VERSION: { url: "/agency/id/version", template: {} },
    ALL_ID_VERSION: { url: "/all/id/version", template: { agency: 'all' } },
    AGENCY_ALL_VERSION: { url: "/agency/all/version", template: { id: 'all' } },
    AGENCY_ID_ALL: { url: "/agency/id/all", template: { version: 'all' } },
    AGENCY_ID: { url: "/agency/id", template: { version: 'latest' } },
    AGENCY_ALL: { url: "/agency/all", template: { id: 'all', version: 'latest' } },

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
};

module.exports.STRUCTURE_IDENTIFICATION_PARAMETERS = Object.freeze(STRUCTURE_IDENTIFICATION_PARAMETERS);