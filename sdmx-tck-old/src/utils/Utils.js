export const isDefined = (variable) => {
    return variable !== null && variable !== undefined;
};
export const isSpecificAgency = (query) => {
    return isDefined(query.agency) && query.agency !== 'all';
};
export const isSpecificId = (query) => {
    return isDefined(query.id) && query.id !== 'all';
};
export const isSpecificVersion = (query) => {
    // if the version is not present in the query, the latest version is implied.
    return !isDefined(query.version) || (isDefined(query.version) && query.version !== 'all');
};
export const isSpecificItem = (query) => {
    return isDefined(query.item) && query.item !== 'all';
};