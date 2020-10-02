const DATA_IDENTIFICATION_PARAMETERS = {
    AGENCY_ID_VERSION:{ url: "/agency,id,version", template: {} },
    AGENCY_ID:{ url: "/agency,id", template: {} },
    ID:{ url: "/id",template: {}},
    AGENCY_ID_VERSION_ALL_AGENCY_PROVIDERID:{ url:"/agency,id,version/all/agency,providerId", template: {}},
    AGENCY_ID_VERSION_ALL_PROVIDERID:{ url:"/agency,id,version/all/providerId", template: {}},
    AGENCY_ID_VERSION_ALL_AGENCY_PRVIDERID1_PROVIDERID2:{ url:"/agency,id,version/all/providerId1+providerId2", template: {}},

    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
}

module.exports.DATA_IDENTIFICATION_PARAMETERS = Object.freeze(DATA_IDENTIFICATION_PARAMETERS);

