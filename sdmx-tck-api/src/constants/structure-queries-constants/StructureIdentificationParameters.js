var Utils = require('../../utils/Utils.js');
const STRUCTURES_REST_RESOURCE = require('../../constants/StructuresRestResources').STRUCTURES_REST_RESOURCE;

const STRUCTURE_IDENTIFICATION_PARAMETERS = {
    AGENCY_ID_VERSION: { url: "/agency/id/version", template: {}, fromVersion: "v1.0.0" },
    ALL_ID_VERSION: { url: "/all/id/version", template: { agency: 'all' }, fromVersion: "v1.0.0" },
    AGENCY_ALL_VERSION: { url: "/agency/all/version", template: { id: 'all' }, fromVersion: "v1.0.0" },
    AGENCY_ID_ALL: { url: "/agency/id/all", template: { version: 'all' }, fromVersion: "v1.0.0" },
    AGENCY_ID: { url: "/agency/id", template: { version: 'latest' }, fromVersion: "v1.0.0" },
    AGENCY_ALL: { url: "/agency/all", template: { id: 'all', version: 'latest' }, fromVersion: "v1.0.0" },
    
    // MULTIPLE VALUES
    AGENCY1_AGENCY2_ID_VERSION: { url: "/agency1+agency2/id/version", template: {multipleAgencies: true}, fromVersion: "v1.3.0", toVersion: "v1.5.0", restrictedResources: [STRUCTURES_REST_RESOURCE.codelist] },
    AGENCY_ID1_ID2_VERSION: { url: "/agency/id1+id2/version", template: {multipleIds: true}, fromVersion: "v1.3.0", toVersion: "v1.5.0", restrictedResources: [STRUCTURES_REST_RESOURCE.codelist] },
    AGENCY_ID_VERSION1_VERSION2: { url: "/agency/id/version1+version2", template: {multipleVersions: true}, fromVersion: "v1.3.0", toVersion: "v1.5.0", restrictedResources: [STRUCTURES_REST_RESOURCE.codelist] },

    V2_AGENCY1_AGENCY2_ID_VERSION: { url: "/agency1,agency2/id/version", template: {multipleAgencies: true}, fromVersion: "v2.0.0", restrictedResources: [STRUCTURES_REST_RESOURCE.codelist] },
    V2_AGENCY_ID1_ID2_VERSION: { url: "/agency/id1,id2/version", template: {multipleIds: true}, fromVersion: "v2.0.0", restrictedResources: [STRUCTURES_REST_RESOURCE.codelist] },
    V2_AGENCY_ID_VERSION1_VERSION2: { url: "/agency/id/version1,version2", template: {multipleVersions: true}, fromVersion: "v2.0.0", restrictedResources: [STRUCTURES_REST_RESOURCE.codelist] },

    getValues(apiVersion, restResource) {
        let applicableTests = Object.values(this).filter((test) => {
            // Exclude non-object values (like methods)
            if (typeof test !== "object") return false;
            
            // Check version compatibility
            return Utils.isVersionWithinRange(apiVersion, test.fromVersion, test.toVersion);
        });

        // Further filter restricted tests based on the resource
        applicableTests = applicableTests.filter(test => {
            // Include unrestricted tests
            if (!test.restrictedResources) {
                return true;
            }
            // Include only if the resource is in restrictedResources
            return test.restrictedResources.includes(restResource);
        });
        return applicableTests;
    }
};

module.exports.STRUCTURE_IDENTIFICATION_PARAMETERS = Object.freeze(STRUCTURE_IDENTIFICATION_PARAMETERS);