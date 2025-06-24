const { DATA_CONTEXT } = require('sdmx-tck-api/src/constants/data-queries-constants/DataContext');
const { SDMX_STRUCTURE_TYPE } = require('sdmx-tck-api/src/constants/SdmxStructureType');
const RegistrationTestsDataBuilder = require('../builders/registry-queries-builders/RegistrationTestsDataBuilder');
const SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;
const TckError = require('sdmx-tck-api').errors.TckError;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
const Utils = require('sdmx-tck-api').utils.Utils;

class RegistrationSemanticChecker {
    static checkWorkspace(test, preparedRequest, workspace) {
        return new Promise((resolve, reject) => {
            try {
                let validation = {};
                if (test.testType === TEST_TYPE.REGISTRATION_IDENTIFICATION_PARAMETERS) {
                    validation = RegistrationSemanticChecker._checkIdentification(test, preparedRequest, workspace)
                }
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }

    static _checkIdentification(test, preparedRequest, workspace) {
        if (!Utils.isDefined(test)) {
            return { status: FAILURE_CODE, error: "Missing mandatory parameter 'test'." };
        }
        if (!Utils.isDefined(preparedRequest)) {
            return { status: FAILURE_CODE, error: "Missing mandatory parameter 'preparedRequest'." };
        }
        if (!Utils.isDefined(workspace) || !(workspace instanceof SdmxStructureObjects)) {
            return { status: FAILURE_CODE, error: "Missing mandatory parameter 'workspace'." };
        }
        let query = preparedRequest.request;
        let service = preparedRequest.service;
        if (test.reqTemplate.byId === true) {
            return RegistrationSemanticChecker.exactlyOneRegistration(query.registrationId, workspace);
        } else if (test.reqTemplate.byProvider === true
                || test.reqTemplate.byContext === true
        ) {
            return RegistrationSemanticChecker.checkProvisionAgreements(test, query, service, workspace);
        }
        return { status: SUCCESS_CODE };
    }

    static exactlyOneRegistration(registrationId, workspace) {
        if (!workspace) {
            return { status: FAILURE_CODE, error: "No workspace provided" };
        }
        let matchingStructures = workspace.getSdmxObjectsWithCriteria(SDMX_STRUCTURE_TYPE.REGISTRATION.key, undefined, registrationId, undefined);
        if (matchingStructures.length === 1) {
            return { status: SUCCESS_CODE };
        }
        return { status: FAILURE_CODE, error: "Expected result: exactly one artefact" };
    };

    static checkProvisionAgreements(test, query, service, workspace) {
        let notExpectedRegistrations = [];
        workspace.getSdmxObjectsList().forEach(async (registration) => {
            let isPraRefValid = true;
            let praRef = registration.getProvisionAgreementRef();
            if (test.reqTemplate.byProvider === true) {
                isPraRefValid = await RegistrationSemanticChecker._isValidProviderRef(query, service, praRef);
            } else if (test.reqTemplate.byContext === true) {
                if (query.context === DATA_CONTEXT.provisionagreement) {
                    isPraRefValid = RegistrationSemanticChecker._isValidStructureRef(query, praRef);
                } else if (query.context === DATA_CONTEXT.dataflow) {
                    isPraRefValid = await RegistrationSemanticChecker._isValidDataflowRef(query, service, praRef);
                } else if (query.context === DATA_CONTEXT.datastructure) {
                    isPraRefValid = await RegistrationSemanticChecker._isValidDatastructureRef(query, service, praRef);
                }
            }
            if (!isPraRefValid) {
                notExpectedRegistrations.push(registration.getId());
            }
        });
        if (notExpectedRegistrations.length > 0) {
            return { status: FAILURE_CODE, error: `Not expected registration contained in the workspace. ${notExpectedRegistrations}`};
        }
        return { status: SUCCESS_CODE };
    }

    static async _isValidProviderRef(query, service, praRef) {
        // Get the dataflow referenced by the provision agreement
        let refs = await RegistrationTestsDataBuilder.getChildrenRefs(service.url, service.api, praRef);
        let providerRef = refs.providerRef;

        if (Utils.isSpecificProviderAgency(query) && query.providerAgency !== providerRef.getAgencyId()) {
            return false;
        }
        if (Utils.isSpecificProviderId(query) && query.providerId !== providerRef.getIdentifiableIds()[0]) {
            return false;
        }
        return true;
    }

    static async _isValidDataflowRef(query, service, praRef) {
        // Get the dataflow referenced by the provision agreement
        let refs = await RegistrationTestsDataBuilder.getChildrenRefs(service.url, service.api, praRef);
        // Check that the referenced dataflow matches the requested one.
        return RegistrationSemanticChecker._isValidStructureRef(query, refs.dfRef);
    }

    static async _isValidDatastructureRef(query, service, praRef) {
        // Get the datastructure referenced by the dataflow
        let refs = await RegistrationTestsDataBuilder.getChildrenRefs(service.url, service.api, praRef, true);
        // Check that the referenced datastructure matches the requested one.
        return RegistrationSemanticChecker._isValidStructureRef(query, refs.dsdRef);
    }

    static _isValidStructureRef(query, structureRef) {
        if (Utils.isSpecificAgency(query) && query.agency !== structureRef.getAgencyId()) {
            return false;
        }
        if (Utils.isSpecificId(query) && query.id !== structureRef.getId()) {
            return false;
        }
        if (Utils.isSpecificVersion(query) && query.version !== structureRef.getVersion()) {
            return false;
        }
        return true;
    }
}
module.exports = RegistrationSemanticChecker;