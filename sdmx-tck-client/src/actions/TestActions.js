export function getTests(endpoint, apiVersion, testIndex) {
    return fetch('/prepare-tests?e ndpoint=' + endpoint + "&apiVersion=" + apiVersion + "&testIndex=" + testIndex).then((response) => {
        return response.json();
    });
};