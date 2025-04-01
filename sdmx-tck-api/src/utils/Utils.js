<<<<<<< HEAD
=======
const { API_VERSIONS } = require('../constants/ApiVersions.js');

>>>>>>> v4.8.0
function isDefined(variable) {
    return variable !== null && variable !== undefined;
};
function isSpecificAgency(query) {
<<<<<<< HEAD
    return isDefined(query.agency) && query.agency !== 'all';
};
function isSpecificId(query) {
    return isDefined(query.id) && query.id !== 'all';
};
function isSpecificVersion(query) {
    // if the version is not present in the query, the latest version is implied.
    return !isDefined(query.version) || (isDefined(query.version) && query.version !== 'all');
=======
    return isDefined(query.agency) && query.agency !== 'all' && query.agency !== '*';
};
function isSpecificId(query) {
    return isDefined(query.id) && query.id !== 'all' && query.id !== '*';
};
function isSpecificVersion(query) {
    // if the version is not present in the query, the latest version is implied.
    return !isDefined(query.version) || (isDefined(query.version) && query.version !== 'all' && query.version !== "*");
>>>>>>> v4.8.0
};
function isSpecificItem(query) {
    return isDefined(query.item) && query.item !== 'all';
};
<<<<<<< HEAD

=======
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};
function getRandomItem(items) {
    // Randomly pick an index from the available array of items.
    let randomIndex = getRandomInt(items.length);
    return items[randomIndex];
}
function isVersionWithinRange(apiVersion, fromVersion, toVersion) {
    let isInRange = true;
    if (fromVersion && API_VERSIONS[apiVersion] < API_VERSIONS[fromVersion]) {
        isInRange = false;
    }
    if (toVersion && API_VERSIONS[apiVersion] > API_VERSIONS[toVersion]) {
        isInRange = false;
    }
    return isInRange;
};

function getAllOperator(apiVersion) {
    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
        return "*"
    } else {
        return "all";
    }
}
function getLatestStableOperator(apiVersion) {
    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
        return "+"
    } else {
        return "latest";
    }
}

function getDimensionWildcard(apiVersion) {
    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
        return "*"
    } else {
        return "";
    }
}
function getOROperator(apiVersion) {
    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
        return ","
    } else {
        return "+";
    }
}
>>>>>>> v4.8.0
module.exports = {
    isDefined: isDefined,
    isSpecificAgency: isSpecificAgency,
    isSpecificId: isSpecificId,
    isSpecificVersion: isSpecificVersion,
<<<<<<< HEAD
    isSpecificItem: isSpecificItem
=======
    isSpecificItem: isSpecificItem,
    getRandomInt: getRandomInt,
    getRandomItem: getRandomItem,
    isVersionWithinRange: isVersionWithinRange,
    getDimensionWildcard: getDimensionWildcard,
    getOROperator: getOROperator,
    getAllOperator: getAllOperator,
    getLatestStableOperator: getLatestStableOperator
>>>>>>> v4.8.0
};