const STRUCTURE_REFERENCE_DETAIL = require('../../../sdmx-tck-api/src/constants/StructureReferenceDetail.js').STRUCTURE_REFERENCE_DETAIL;

const STRUCTURE_ITEM_QUERIES = {
    AGENCY_ID_VERSION_ITEM: { url: "/agency/id/version/items", template: {} },
    TARGET_CATEGORY: {url: "/agency/id/version/items?references=parentsandsiblings", template:{references:STRUCTURE_REFERENCE_DETAIL.PARENTS_SIBLINGS}}
};

module.exports.STRUCTURE_ITEM_QUERIES = Object.freeze(STRUCTURE_ITEM_QUERIES);