var Utils = require('../../utils/Utils.js');
const { STRUCTURES_REST_RESOURCE } = require('../../constants/StructuresRestResources');
const { TEST_REQUEST_MODE } = require('../TestRequestMode.js');

const STRUCTURE_IDENTIFICATION_PARAMETERS = {
    AGENCY_ID_VERSION: { 
        url: "/agency/id/version", 
        template: {}, fromVersion: "v1.0.0",
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC, TEST_REQUEST_MODE.MINIMUM, TEST_REQUEST_MODE.DATA_DISCOVERY]
    },
    ALL_ID_VERSION: {
        url: "/all/id/version",
        template: { agency: 'all' },
        fromVersion: "v1.0.0",
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    AGENCY_ALL_VERSION: {
        url: "/agency/all/version",
        template: { id: 'all' },
        fromVersion: "v1.0.0",
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    AGENCY_ID_ALL: {
        url: "/agency/id/all",
        template: { version: 'all' },
        fromVersion: "v1.0.0",
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    AGENCY_ID: {
        url: "/agency/id",
        template: { version: 'latest' },
        fromVersion: "v1.0.0",
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    AGENCY_ALL: {
        url: "/agency/all",
        template: { id: 'all', version: 'latest' },
        fromVersion: "v1.0.0",
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    // MULTIPLE VALUES
    AGENCY1_AGENCY2_ID_VERSION: {
        url: "/agency1+agency2/id/version",
        template: { multipleAgencies: true },
        fromVersion: "v1.3.0",
        toVersion: "v1.5.0",
        restrictedResources: [STRUCTURES_REST_RESOURCE.codelist],
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    AGENCY_ID1_ID2_VERSION: {
        url: "/agency/id1+id2/version",
        template: { multipleIds: true },
        fromVersion: "v1.3.0",
        toVersion: "v1.5.0",
        restrictedResources: [STRUCTURES_REST_RESOURCE.codelist],
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    AGENCY_ID_VERSION1_VERSION2: {
        url: "/agency/id/version1+version2", 
        template: {multipleVersions: true}, 
        fromVersion: "v1.3.0", 
        toVersion: "v1.5.0", 
        restrictedResources: [STRUCTURES_REST_RESOURCE.codelist],
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    // MULTIPLE VALUES (API 2.0)
    V2_AGENCY1_AGENCY2_ID_VERSION: {
        url: "/agency1,agency2/id/version",
        template: { multipleAgencies: true },
        fromVersion: "v2.0.0",
        restrictedResources: [STRUCTURES_REST_RESOURCE.codelist],
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    V2_AGENCY_ID1_ID2_VERSION: {
        url: "/agency/id1,id2/version",
        template: { multipleIds: true },
        fromVersion: "v2.0.0",
        restrictedResources: [STRUCTURES_REST_RESOURCE.codelist],
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },
    V2_AGENCY_ID_VERSION1_VERSION2: {
        url: "/agency/id/version1,version2",
        template: { multipleVersions: true },
        fromVersion: "v2.0.0",
        restrictedResources: [STRUCTURES_REST_RESOURCE.codelist],
        profiles: [TEST_REQUEST_MODE.FULL, TEST_REQUEST_MODE.BASIC]
    },

    getValues(apiVersion, restResource, requestMode) {
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

        // Filter profile tests
        applicableTests = applicableTests.filter(test => {
            // Include only if 1. the test has not profiles defined or 2. the selected profile is in the profiles of the test
            return !test.profiles || test.profiles.includes(requestMode);
        });
        return applicableTests;
    }
};

module.exports.STRUCTURE_IDENTIFICATION_PARAMETERS = Object.freeze(STRUCTURE_IDENTIFICATION_PARAMETERS);