// CONSTANTS
const ApiVersions = require('./constants/ApiVersions.js');
const ApiConstants = require('./constants/ApiConstants.js');
const DataQueryDetail = require('./constants/DataQueryDetail.js');
const ItemSchemeTypes = require('./constants/ItemSchemeTypes.js');
const SdmxStructureType = require('./constants/SdmxStructureType.js');
const StructureDetail = require('./constants/StructureDetail.js');
const StructureQueryDetail = require('./constants/StructureQueryDetail.js');
const StructureReferenceDetail = require('./constants/StructureReferenceDetail.js');
const StructuresRestResources = require('./constants/StructuresRestResources.js');
const TestState = require('./constants/TestState.js');
const TestIndex = require('./constants/TestIndex.js');
const TestType = require('./constants/TestType.js');
const SchemaResources = require('./constants/SchemaResources.js');

// ERRORS
var TckError = require('./errors/TckError.js');
var SemanticError = require('./errors/SemanticError.js');

// MODEL
var StructureReference = require('./model/StructureReference.js');
var MaintainableObject = require('./model/MaintainableObject.js');
var ItemSchemeObject = require('./model/ItemSchemeObject.js');
var DataStructureObject = require('./model/DataStructureObject.js');
var DataflowObject = require('./model/DataflowObject.js');
var ContentConstraintObject = require('./model/ContentConstraintObject.js');
var SdmxObjects = require('./model/SdmxObjects.js');

// UTILS
var UrnUtil = require('./utils/UrnUtil.js');
var Utils = require('./utils/Utils.js');

module.exports = {
    constants: {
        API_VERSIONS: ApiVersions.API_VERSIONS,
        API_CONSTANTS: ApiConstants.API_CONSTANTS,
        DATA_QUERY_DETAIL: DataQueryDetail.DATA_QUERY_DETAIL,
        ITEM_SCHEME_TYPES: ItemSchemeTypes.ITEM_SCHEME_TYPES,
        SDMX_STRUCTURE_TYPE: SdmxStructureType.SDMX_STRUCTURE_TYPE,
        StructureDetail: StructureDetail.StructureDetail,
        STRUCTURE_QUERY_DETAIL: StructureQueryDetail.STRUCTURE_QUERY_DETAIL,
        getStructureQueryDetail: StructureQueryDetail.getStructureQueryDetail,
        STRUCTURE_REFERENCE_DETAIL: StructureReferenceDetail.STRUCTURE_REFERENCE_DETAIL,
        STRUCTURES_REST_RESOURCE: StructuresRestResources.STRUCTURES_REST_RESOURCE,
        getResources: StructuresRestResources.getResources,
        TEST_STATE: TestState.TEST_STATE,
        TEST_INDEX: TestIndex.TEST_INDEX,
        TEST_TYPE: TestType.TEST_TYPE,
        SCHEMA_RESOURCES:SchemaResources,
        containsValue:SchemaResources.containsValue
    },
    errors: {
        TckError: TckError,
        SemanticError: SemanticError
    },
    model: {
        StructureReference: StructureReference,
        MaintainableObject: MaintainableObject,
        ItemSchemeObject: ItemSchemeObject,
        DataStructureObject: DataStructureObject,
        DataflowObject: DataflowObject,
        ContentConstraintObject: ContentConstraintObject,
        SdmxObjects: SdmxObjects
    },
    utils: {
        Utils,
        UrnUtil: UrnUtil
    }
};