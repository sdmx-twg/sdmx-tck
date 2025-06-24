const Utils = require('../../utils/Utils.js');

const REGISTRATION_IDENTIFICATION_PARAMETERS = {
    /*
     * Registration queries (by registration ID)
     * registrationID: Multiple values are possible and * can be used as shortcut to select all available artefacts.
     */
    REGISTRATION_ID: {
        key: "REGISTRATION_ID",
        url: "/registration/id/{registrationID}",
        template: { byId: true },
        fromVersion: "v2.1.0"
    },
    /* 
     * Registration queries (by data provider ID)
     * providerAgencyID: (required) Multiple values are possible and * can be used as shortcut to select all available maintainers.
     * providerID: Multiple values are possible and * can be used as shortcut to select all available artefacts.
     */
    AGENCY_PROVIDER: {
        key: "AGENCY_PROVIDER",
        url: "/registration/provider/{providerAgencyID}/{providerID}",
        template: { byProvider: true },
        fromVersion: "v2.1.0"
    },
    /*
     * Registration queries (by context)
     * context: (required) The context for data retrieval. All possible contexts can be selected using *. Available values : datastructure, dataflow, provisionagreement, *
     * agencyID: (required) The maintainer(s) of the artefacts. Multiple values are possible and * can be used as shortcut to select all available maintainers.
     * resourceID: (required) The artefact ID(s). Multiple values are possible and * can be used as shortcut to select all available artefacts.
     * version: (required) The version(s) of the artefact. Multiple values are possible and * can be used as shortcut to select all available artefacts.
     *                     + can be used to retrieve the latest stable version.
     *                     ~ can be used to retrieve the latest version, regardless of its status (stable, draft, etc.).
     */
    // CONTEXT = PROVISIONAGREEMENT
    PROVISIONAGREEMENT_AGENCY_ID_VERSION: {
        key: "PROVISIONAGREEMENT_AGENCY_ID_VERSION",
        url: "/registration/provisionagreement/{agencyID}/{resourceID}/{version}",
        template: { byContext: true, context: "provisionagreement"},
        fromVersion: "v2.1.0"
    },
    PROVISIONAGREEMENT_ALL_ID_VERSION: {
        key: "PROVISIONAGREEMENT_ALL_ID_VERSION",
        url: "/registration/provisionagreement/*/{resourceID}/{version}",
        template: { byContext: true, context: "provisionagreement", agency: "*" },
        fromVersion: "v2.1.0"
    },
    PROVISIONAGREEMENT_AGENCY_ALL_VERSION: {
        key: "PROVISIONAGREEMENT_AGENCY_ALL_VERSION",
        url: "/registration/provisionagreement/{agencyID}/*/{version}",
        template: { byContext: true, context: "provisionagreement", id: "*" },
        fromVersion: "v2.1.0"
    },
    PROVISIONAGREEMENT_AGENCY_ID_ALL: {
        key: "PROVISIONAGREEMENT_AGENCY_ID_ALL",
        url: "/registration/provisionagreement/{agencyID}/{resourceID}/*",
        template: { byContext: true, context: "provisionagreement", version: "*" },
        fromVersion: "v2.1.0"
    },
    
    // CONTEXT = DATAFLOW
    DATAFLOW_AGENCY_ID_VERSION: {
        key: "DATAFLOW_AGENCY_ID_VERSION",
        url: "/registration/dataflow/{agencyID}/{resourceID}/{version}",
        template: { byContext: true, context: "dataflow"},
        fromVersion: "v2.1.0"
    },
    DATAFLOW_ALL_ID_VERSION: {
        key: "DATAFLOW_ALL_ID_VERSION",
        url: "/registration/dataflow/*/{resourceID}/{version}",
        template: { byContext: true, context: "dataflow", agency: "*" },
        fromVersion: "v2.1.0"
    },
    DATAFLOW_AGENCY_ALL_VERSION: {
        key: "DATAFLOW_AGENCY_ALL_VERSION",
        url: "/registration/dataflow/{agencyID}/*/{version}",
        template: { byContext: true, context: "dataflow", id: "*" },
        fromVersion: "v2.1.0"
    },
    DATAFLOW_AGENCY_ID_ALL: {
        key: "DATAFLOW_AGENCY_ID_ALL",
        url: "/registration/dataflow/{agencyID}/{resourceID}/*",
        template: { byContext: true, context: "dataflow", version: "*" },
        fromVersion: "v2.1.0"
    },

    // CONTEXT = DATASTRUCTURE
    DATASTRUCTURE_AGENCY_ID_VERSION: {
        key: "DATASTRUCTURE_AGENCY_ID_VERSION",
        url: "/registration/datastructure/{agencyID}/{resourceID}/{version}",
        template: { byContext: true, context: "datastructure"},
        fromVersion: "v2.1.0"
    },
    DATASTRUCTURE_ALL_ID_VERSION: {
        key: "DATASTRUCTURE_ALL_ID_VERSION",
        url: "/registration/datastructure/*/{resourceID}/{version}",
        template: { byContext: true, context: "datastructure", agency: "*" },
        fromVersion: "v2.1.0"
    },
    DATASTRUCTURE_AGENCY_ALL_VERSION: {
        key: "DATASTRUCTURE_AGENCY_ALL_VERSION",
        url: "/registration/datastructure/{agencyID}/*/{version}",
        template: { byContext: true, context: "datastructure", id: "*" },
        fromVersion: "v2.1.0"
    },
    DATASTRUCTURE_AGENCY_ID_ALL: {
        key: "DATASTRUCTURE_AGENCY_ID_ALL",
        url: "/registration/datastructure/{agencyID}/{resourceID}/*",
        template: { byContext: true, context: "datastructure", version: "*" },
        fromVersion: "v2.1.0"
    },
    getValues(apiVersion) {
        let applicableParameters = Object.values(this).filter((parameter) => {
            // Exclude non-object values (like methods)
            if (typeof parameter !== "object") return false;

            // Check version compatibility
            return Utils.isVersionWithinRange(apiVersion, parameter.fromVersion, parameter.toVersion);
        });
        return applicableParameters;
    }
};

module.exports.REGISTRATION_IDENTIFICATION_PARAMETERS = Object.freeze(REGISTRATION_IDENTIFICATION_PARAMETERS);