var TestObjectBuilder = require('../TestObjectBuilder.js');
var HelperManager = require('../../manager/HelperManager.js')
var TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const { DATA_CONTEXT } = require('sdmx-tck-api/src/constants/data-queries-constants/DataContext.js');
const { STRUCTURES_REST_RESOURCE } = require('sdmx-tck-api/src/constants/StructuresRestResources.js');
const { API_VERSIONS } = require('sdmx-tck-api/src/constants/ApiVersions.js');
const STRUCTURE_QUERY_REPRESENTATIONS = require('sdmx-tck-api').constants.STRUCTURE_QUERY_REPRESENTATIONS;

class RegistrationTestsDataBuilder {
    static async buildData(endpoint, apiVersion, format) {
        // 1. Reguest all registrations and pick randomly one.
        let registrationObject = await RegistrationTestsDataBuilder.getRandomRegistration(endpoint, apiVersion, format);
        
        // 2. Request and get the PRA referenced by the selected registration.
        let praRef = registrationObject.getProvisionAgreementRef();
        let refs = await RegistrationTestsDataBuilder.getChildrenRefs(endpoint, apiVersion, format, praRef, true);
        let data = {
            registrationId: registrationObject.getId(),
            lastUpdated: registrationObject.getLastUpdated(),
            providerRef: refs.providerRef
        };
        data[DATA_CONTEXT.provisionagreement] = { structureRef: praRef };
        data[DATA_CONTEXT.dataflow] = { structureRef: refs.dfRef };
        data[DATA_CONTEXT.datastructure] = { structureRef: refs.dsdRef };

        return data;
    }

    static async getRandomRegistration(endpoint, apiVersion, format) {
        let params = {
            index: TEST_INDEX.Registration,
            apiVersion: apiVersion,
            resource: "registration",
            reqTemplate: {
                agency: "*",
                id: "*",
                version: "*"
            },
            identifiers: {}
        };
        let workspace = await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(params), format, endpoint);
        
        return workspace.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.REGISTRATION.key);
    }

    static async getChildrenRefs(endpoint, apiVersion, format, praRef, descendants) {
        let praObject = await RegistrationTestsDataBuilder.getStructure(endpoint, apiVersion, format, STRUCTURES_REST_RESOURCE.provisionagreement, praRef);

        // Get the referenced data provider
        let providerRef = praObject.getDataProviderRef();
        // Get the referenced dataflow
        let dfRef = praObject.getDataflowRef();
        let dsdRef;

        if (descendants === true) {
            // Get the referenced datastructure.
            let dfObject = await RegistrationTestsDataBuilder.getStructure(endpoint, apiVersion, format, STRUCTURES_REST_RESOURCE.dataflow, dfRef);

            dsdRef = dfObject.getDsdRef();
        }
        return { providerRef, dfRef, dsdRef };
    }

    static async getStructure(endpoint, apiVersion, format, resource, structureRef) {
        // TEMPORAL SOLUTION:
        // SDMX rest4js library does not support versions > v2.0.0, which causes all requests to fail. 
        if (API_VERSIONS[apiVersion] > API_VERSIONS["v2.0.0"]) {
            apiVersion = "v2.0.0";
        }
        let params = {
            index: TEST_INDEX.Structure,
            apiVersion: apiVersion,
            resource: resource,
            reqTemplate: {
                detail: MetadataDetail.FULL,
                references: STRUCTURE_REFERENCE_DETAIL.NONE
            },
            identifiers: {
                structureType: structureRef.structureType,
                agency: structureRef.agencyId,
                id: structureRef.id,
                version: structureRef.version
            }
        };
        let workspace = await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(params), format, endpoint);
        let structure = workspace.getSdmxObject(structureRef);
        
        return structure;
    }
}
module.exports = RegistrationTestsDataBuilder;