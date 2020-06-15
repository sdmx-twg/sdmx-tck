// CONSTANTS
const ApiVersions = require('./constants/ApiVersions.js');
const ApiConstants = require('./constants/ApiConstants.js');
const DataQueryDetail = require('./constants/DataQueryDetail.js');
const ItemSchemeTypes = require('./constants/ItemSchemeTypes.js');
const SdmxStructureType = require('./constants/SdmxStructureType.js');
const DSDComponents = require('./constants/DSDComponents.js')
const StructureDetail = require('./constants/StructureDetail.js');
const ItemQueries = require ('./constants/ItemQueries.js');
const StructureIdentificationParameters = require('./constants/StructureIdentificationParameters.js')
const StructureQueryRepresentation = require('./constants/StructureQueryRepresentations.js')
const StructureQueryDetail = require('./constants/StructureQueryDetail.js');
const StructureReferenceDetail = require('./constants/StructureReferenceDetail.js');
const StructuresRestResources = require('./constants/StructuresRestResources.js');
const SchemaIdentificationParameters = require('./constants/SchemaIdentificationParameters.js');
const TestState = require('./constants/TestState.js');
const TestIndex = require('./constants/TestIndex.js');
const TestType = require('./constants/TestType.js');
const SchemaFacetsMapping = require('./constants/SchemaFacetsMapping.js');
const SdmxXSDComponentsTypes = require('./constants/SdmxXSDComponentsTypes.js')
const XSDRepresentationDataType = require('./constants/XSDRepresentationDataType.js')

// ERRORS
var TckError = require('./errors/TckError.js');
var SemanticError = require('./errors/SemanticError.js');

// MODEL
var StructureReference = require('./model/StructureReference.js');
var MaintainableObject = require('./model/MaintainableObject.js');
var ItemSchemeObject = require('./model/ItemSchemeObject.js');
var DataStructureObject = require('./model/DataStructureObject.js');
var DataStructureGroupObject = require('./model/DataStructureGroupObject.js')
var DataStructureComponentObject = require('./model/DataStructureComponentObject.js');
var DataStructureComponentRepresentationObject = require('./model/DataStructureComponentRepresentationObject.js')
var DataflowObject = require('./model/DataflowObject.js');
var ContentConstraintObject = require('./model/ContentConstraintObject.js');
var SdmxObjects = require('./model/SdmxObjects.js');
var SdmxObjectsFactory = require('./model/SdmxObjectsFactory.js')
var SdmxStructureObjects = require('./model/SdmxStructureObjects.js')
var SdmxSchemaObjects = require('./model/SdmxSchemaObjects.js')
var CubeRegionObject = require('./model/CubeRegionObject.js');
var DataKeySetObject = require('./model/DataKeySetObject.js');
var ConstraintKeyValueObject = require('./model/ConstraintKeyValueObject.js')
var XSDGlobalElement = require('./model/XSDGlobalElement.js')
var XSDSimpleType = require('./model/XSDSimpleType.js')
var XSDFacet = require('./model/XSDFacet.js')
var XSDComplexType = require('./model/XSDComplexType.js')
var XSDLocalElement = require('./model/XSDLocalElement.js')
var XSDReferenceElement = require('./model/XSDReferenceElement.js')
var XSDAttribute = require('./model/XSDAttribute.js')
var XSDAnyAttribute = require('./model/XSDAnyAttribute.js')
var XSDCompositor = require('./model/XSDCompositor.js')
var DataStructureAttributeObject = require('./model/DataStructureAttributeObject.js')
var DataStructureAttributeRelationshipObject = require('./model/DataStructureAttributeRelationshipObject.js')
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
        DSD_COMPONENTS_NAMES:DSDComponents.DSD_COMPONENTS_NAMES,
        DSD_COMPONENTS_REPRESENTATION_NAMES:DSDComponents.DSD_COMPONENTS_REPRESENTATION_NAMES,
        STRUCTURE_ITEM_QUERIES:ItemQueries.STRUCTURE_ITEM_QUERIES,
        STRUCTURE_IDENTIFICATION_PARAMETERS:StructureIdentificationParameters.STRUCTURE_IDENTIFICATION_PARAMETERS,
        STRUCTURE_QUERY_REPRESENTATIONS:StructureQueryRepresentation.STRUCTURE_QUERY_REPRESENTATIONS,
        STRUCTURE_QUERY_DETAIL: StructureQueryDetail.STRUCTURE_QUERY_DETAIL,
        getStructureQueryDetail: StructureQueryDetail.getStructureQueryDetail,
        STRUCTURE_REFERENCE_DETAIL: StructureReferenceDetail.STRUCTURE_REFERENCE_DETAIL,
        STRUCTURES_REST_RESOURCE: StructuresRestResources.STRUCTURES_REST_RESOURCE,
        getResources: StructuresRestResources.getResources,
        SCHEMA_IDENTIFICATION_PARAMETERS:SchemaIdentificationParameters.SCHEMA_IDENTIFICATION_PARAMETERS,
        TEST_STATE: TestState.TEST_STATE,
        TEST_INDEX: TestIndex.TEST_INDEX,
        TEST_TYPE: TestType.TEST_TYPE,
        SCHEMA_FACETS:SchemaFacetsMapping.SCHEMA_FACETS,
        XSD_COMPONENTS_TYPES:SdmxXSDComponentsTypes.XSD_COMPONENTS_TYPES,
        XSD_DATA_TYPE:XSDRepresentationDataType.XSD_DATA_TYPE
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
        DataStructureGroupObject:DataStructureGroupObject,
        DataStructureComponentObject:DataStructureComponentObject,
        DataStructureComponentRepresentationObject:DataStructureComponentRepresentationObject,
        DataStructureAttributeRelationshipObject:DataStructureAttributeRelationshipObject,
        DataStructureAttributeObject:DataStructureAttributeObject,
        DataflowObject: DataflowObject,
        ContentConstraintObject: ContentConstraintObject,
        SdmxObjects: SdmxObjects,
        SdmxObjectsFactory:SdmxObjectsFactory,
        SdmxStructureObjects:SdmxStructureObjects,
        SdmxSchemaObjects:SdmxSchemaObjects,
        CubeRegionObject: CubeRegionObject,
        ConstraintKeyValueObject:ConstraintKeyValueObject,
        DataKeySetObject:DataKeySetObject,
        XSDGlobalElement:XSDGlobalElement,
        XSDSimpleType:XSDSimpleType,
        XSDFacet:XSDFacet,
        XSDComplexType:XSDComplexType,
        XSDLocalElement:XSDLocalElement,
        XSDReferenceElement:XSDReferenceElement,
        XSDAttribute:XSDAttribute,
        XSDAnyAttribute:XSDAnyAttribute,
        XSDCompositor:XSDCompositor

    },
    utils: {
        Utils,
        UrnUtil: UrnUtil
    }
};