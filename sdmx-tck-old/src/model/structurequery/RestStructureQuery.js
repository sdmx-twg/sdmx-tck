class RestStructureQuery {
    /**
     * 
     * @param {array} queryParams containing the requested structure type, agency, id, version.
     * @param {STRUCTURE_QUERY_DETAIL} detail 
     * @param {STRUCTURE_REFERENCE_DETAIL} references 
     */
    constructor (queryParams, detail, references ) {
        this.queryParams = queryParams;
        this.detail = detail;
        this.references = references;
    };
    getQueryParams = function() {
        return this.queryParams;
    };
    getDetail = function() {
        return this.detail;
    };
    getReferences = function() {
        return this.references;
    };
};

export default RestStructureQuery;