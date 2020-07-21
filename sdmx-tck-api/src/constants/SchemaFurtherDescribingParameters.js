const SCHEMA_FURTHER_DESCRIBING_PARAMETERS = {
    AGENCY_ID_VERSION_SPECIFIC_DIM_AT_OBS: { url: "/agency/id/version?dimensionAtObservation=id", template: {dimensionAtObservation:"id"} },
    AGENCY_ID_VERSION_ALLDIMS: { url: "/agency/id/version?dimensionAtObservation=AllDimensions", template: {dimensionAtObservation:"AllDimensions"} },
    AGENCY_ID_VERSION_EXPLICIT: { url: "/agency/id/version?explicitMeasure=true", template: {explicitMeasure:true} },
   
    getValues() {
        let references = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return references;
    }
};

module.exports.SCHEMA_FURTHER_DESCRIBING_PARAMETERS = Object.freeze(SCHEMA_FURTHER_DESCRIBING_PARAMETERS);