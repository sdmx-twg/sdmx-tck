import { ACTION_NAMES } from '../constants/ActionsNames';

export function initialiseModelObject(apiVersion) {
    return { type: ACTION_NAMES.INITIALISE_MODEL, data: { selectedApiVersion: apiVersion } };
};

export function markTestsToRunObject(indices) {
    return { type: ACTION_NAMES.MARK_TESTS_TO_RUN, data: indices };
};