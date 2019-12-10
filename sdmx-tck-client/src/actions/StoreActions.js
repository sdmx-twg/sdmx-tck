import ACTION_NAMES from '../constants/ActionsNames';

export function loadTests(endpoint, apiVersion, testIndices) {
    fetch('/prepare-tests?e ndpoint=' + endpoint + "&apiVersion=" + apiVersion + "&testIndices=" + testIndices).then((response) => {
        console.log({ type: ACTION_NAMES.INITIALISE_MODEL, data: { tests: response.json() } });
    }).catch(error => {
        throw (error);
    });
};