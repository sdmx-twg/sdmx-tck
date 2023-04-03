function isDefined(variable) {
    return variable !== null && variable !== undefined;
};
function isSpecificAgency(query) {
    return isDefined(query.agency) && query.agency !== 'all';
};
function isSpecificId(query) {
    return isDefined(query.id) && query.id !== 'all';
};
function isSpecificVersion(query) {
    // if the version is not present in the query, the latest version is implied.
    return !isDefined(query.version) || (isDefined(query.version) && query.version !== 'all');
};
function isSpecificItem(query) {
    return isDefined(query.item) && query.item !== 'all';
};

module.exports = {
    isDefined: isDefined,
    isSpecificAgency: isSpecificAgency,
    isSpecificId: isSpecificId,
    isSpecificVersion: isSpecificVersion,
    isSpecificItem: isSpecificItem
};