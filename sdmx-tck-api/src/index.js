// CONSTANTS
const ApiVersions = require('./constants/ApiVersions.js');
const ApiConstants = require('./constants/ApiConstants.js');
const ItemSchemeTypes = require('./constants/structure-queries-constants/ItemSchemeTypes.js');
const SdmxStructureType = require('./constants/SdmxStructureType.js');
const DSDComponents = require('./constants/structure-queries-constants/DSDComponents.js')
const ComponentsRepresentationNames = require('./constants/structure-queries-constants/ComponentsRepresentationNames.js')
const StructureDetail = require('./constants/structure-queries-constants/StructureDetail.js');
const ItemQueries = require ('./constants/structure-queries-constants/ItemQueries.js');
const StructureIdentificationParameters = require('./constants/structure-queries-constants/StructureIdentificationParameters.js')
const SchemaFurtherDescribingParameters = require('./constants/schema-queries-constants/SchemaFurtherDescribingParameters.js')
const StructureQueryRepresentation = require('./constants/structure-queries-constants/StructureQueryRepresentations.js')
const StructureQueryDetail = require('./constants/structure-queries-constants/StructureQueryDetail.js');
const StructureReferenceDetail = require('./constants/structure-queries-constants/StructureReferenceDetail.js');
const StructuresRestResources = require('./constants/StructuresRestResources.js');
const SchemaIdentificationParameters = require('./constants/schema-queries-constants/SchemaIdentificationParameters.js');
const TestState = require('./constants/TestState.js');
const TestIndex = require('./constants/TestIndex.js');
const TestType = require('./constants/TestType.js');
const SchemaFacetsMapping = require('./constants/schema-queries-constants/SchemaFacetsMapping.js');
const SdmxXSDComponentsTypes = require('./constants/schema-queries-constants/SdmxXSDComponentsTypes.js')
const XSDRepresentationDataType = require('./constants/schema-queries-constants/XSDRepresentationDataType.js')
const DimensionAtObservationConstants = require('./constants/structure-queries-constants/DimensionAtObservationConstants.js');
const DSDAttributeConstants = require('./constants/structure-queries-constants/DSDAttributeConstants.js')
const SchemaAttributeConstants = require('./constants/schema-queries-constants/SchemaAttributeConstants.js')
const SchemaComplexTypeConstants = require('./constants/schema-queries-constants/SchemaComplexTypeConstants.js')
const SchemaElementConstants = require('./constants/schema-queries-constants/SchemaElementConstants.js')
const SchemaSimpleTypeConstants = require('./constants/schema-queries-constants/SchemaSimpleTypeConstants.js')
const SchemaOccurenciesConstants = require('./constants/schema-queries-constants/SchemaOccurenciesConstants.js')
const DataQueryDetail = require('./constants/data-queries-constants/DataQueryDetail.js');
const DataIdentificationParameters = require('./constants/data-queries-constants/DataIdentificationParameters.js')
const DataExtendedResourceIdentification = require('./constants/data-queries-constants/DataExtendedResourceIdentification.js')
const DataComponentsTypes = require('./constants/data-queries-constants/DataComponentsTypes.js')
const DataQueryKey = require('./constants/data-queries-constants/DataQueryKey.js')
// ERRORS
var TckError = require('./errors/TckError.js');
var SemanticError = require('./errors/SemanticError.js');

// MODEL
var StructureReference = require('./model/structure-queries-models/StructureReference.js');
var MaintainableObject = require('./model/structure-queries-models/MaintainableObject.js');
var ItemSchemeObject = require('./model/structure-queries-models/ItemSchemeObject.js');
var DataStructureObject = require('./model/structure-queries-models/DataStructureObject.js');
var DataStructureGroupObject = require('./model/structure-queries-models/DataStructureGroupObject.js')
var DataStructureComponentObject = require('./model/structure-queries-models/DataStructureComponentObject.js');
var ItemObject = require('./model/structure-queries-models/ItemObject.js')
var ComponentRepresentationObject = require('./model/structure-queries-models/ComponentRepresentationObject.js')
var DataflowObject = require('./model/structure-queries-models/DataflowObject.js');
var ContentConstraintObject = require('./model/structure-queries-models/ContentConstraintObject.js');
var SdmxObjects = require('./model/SdmxObjects.js');
var SdmxObjectsFactory = require('./model/SdmxObjectsFactory.js')
var SdmxStructureObjects = require('./model/structure-queries-models/SdmxStructureObjects.js')
var SdmxSchemaObjects = require('./model/schema-queries-models/SdmxSchemaObjects.js')
var CubeRegionObject = require('./model/structure-queries-models/CubeRegionObject.js');
var DataKeySetObject = require('./model/structure-queries-models/DataKeySetObject.js');
var ConstraintKeyValueObject = require('./model/structure-queries-models/ConstraintKeyValueObject.js')
var XSDGlobalElement = require('./model/schema-queries-models/XSDGlobalElement.js')
var XSDSimpleType = require('./model/schema-queries-models/XSDSimpleType.js')
var XSDFacet = require('./model/schema-queries-models/XSDFacet.js')
var XSDComplexType = require('./model/schema-queries-models/XSDComplexType.js')
var XSDLocalElement = require('./model/schema-queries-models/XSDLocalElement.js')
var XSDReferenceElement = require('./model/schema-queries-models/XSDReferenceElement.js')
var XSDAttribute = require('./model/schema-queries-models/XSDAttribute.js')
var XSDAnyAttribute = require('./model/schema-queries-models/XSDAnyAttribute.js')
var XSDCompositor = require('./model/schema-queries-models/XSDCompositor.js')
var DataStructureAttributeObject = require('./model/structure-queries-models/DataStructureAttributeObject.js')
var DataStructureAttributeRelationshipObject = require('./model/structure-queries-models/DataStructureAttributeRelationshipObject.js')
var SeriesObject = require('./model/data-queries-models/SeriesObject.js')
var ObservationObject = require('./model/data-queries-models/ObservationObject.js')
var GroupObject = require('./model/data-queries-models/GroupObject.js')
var SdmxDataObjects = require('./model/data-queries-models/SdmxDataObjects.js')
var DatasetObject = require('./model/data-queries-models/DatasetObject.js')
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
        COMPONENTS_REPRESENTATION_NAMES:ComponentsRepresentationNames.COMPONENTS_REPRESENTATION_NAMES,
        STRUCTURE_ITEM_QUERIES:ItemQueries.STRUCTURE_ITEM_QUERIES,
        STRUCTURE_IDENTIFICATION_PARAMETERS:StructureIdentificationParameters.STRUCTURE_IDENTIFICATION_PARAMETERS,
        STRUCTURE_QUERY_REPRESENTATIONS:StructureQueryRepresentation.STRUCTURE_QUERY_REPRESENTATIONS,
        STRUCTURE_QUERY_DETAIL: StructureQueryDetail.STRUCTURE_QUERY_DETAIL,
        STRUCTURE_REFERENCE_DETAIL: StructureReferenceDetail.STRUCTURE_REFERENCE_DETAIL,
        STRUCTURES_REST_RESOURCE: StructuresRestResources.STRUCTURES_REST_RESOURCE,
        getResources: StructuresRestResources.getResources,
        SCHEMA_IDENTIFICATION_PARAMETERS:SchemaIdentificationParameters.SCHEMA_IDENTIFICATION_PARAMETERS,
        SCHEMA_FURTHER_DESCRIBING_PARAMETERS:SchemaFurtherDescribingParameters.SCHEMA_FURTHER_DESCRIBING_PARAMETERS,
        TEST_STATE: TestState.TEST_STATE,
        TEST_INDEX: TestIndex.TEST_INDEX,
        TEST_TYPE: TestType.TEST_TYPE,
        SCHEMA_FACETS:SchemaFacetsMapping.SCHEMA_FACETS,
        XSD_COMPONENTS_TYPES:SdmxXSDComponentsTypes.XSD_COMPONENTS_TYPES,
        XSD_DATA_TYPE:XSDRepresentationDataType.XSD_DATA_TYPE,
        DIMENSION_AT_OBSERVATION_CONSTANTS:DimensionAtObservationConstants.DIMENSION_AT_OBSERVATION_CONSTANTS,
        ATTRIBUTE_RELATIONSHIP_NAMES:DSDAttributeConstants.ATTRIBUTE_RELATIONSHIP_NAMES,
        RELATIONSHIP_REF_ID:DSDAttributeConstants.RELATIONSHIP_REF_ID,
        ATTRIBUTE_NAMES:DSDAttributeConstants.ATTRIBUTE_NAMES,
        SCHEMA_ATTRIBUTE_USAGE_VALUES:SchemaAttributeConstants.SCHEMA_ATTRIBUTE_USAGE_VALUES,
        SCHEMA_ATTRIBUTE_NAMES :SchemaAttributeConstants.SCHEMA_ATTRIBUTE_NAMES,
        SCHEMA_ATTRIBUTE_TYPES:SchemaAttributeConstants.SCHEMA_ATTRIBUTE_TYPES,
        SCHEMA_ANYATTRIBUTE_NAMESPACES : SchemaAttributeConstants.SCHEMA_ANYATTRIBUTE_NAMESPACES,
        COMPLEX_TYPES_NAMES : SchemaComplexTypeConstants.COMPLEX_TYPES_NAMES,
        COMPLEX_TYPES_COMPOSITORS_NAMES : SchemaComplexTypeConstants.COMPLEX_TYPES_COMPOSITORS_NAMES,
        COMPLEX_TYPES_RESTRICTION_BASE : SchemaComplexTypeConstants.COMPLEX_TYPES_RESTRICTION_BASE,
        SCHEMA_ELEMENT_NAMES : SchemaElementConstants.SCHEMA_ELEMENT_NAMES,
        SCHEMA_ELEMENT_REF:SchemaElementConstants.SCHEMA_ELEMENT_REF,
        SCHEMA_ELEMENT_TYPES : SchemaElementConstants.SCHEMA_ELEMENT_TYPES,
        SCHEMA_ELEMENT_FORMS : SchemaElementConstants.SCHEMA_ELEMENT_FORMS,
        SCHEMA_SIMPLE_TYPE_NAMES : SchemaSimpleTypeConstants.SCHEMA_SIMPLE_TYPE_NAMES,
        SCHEMA_SIMPLE_TYPE_RESTRICTION_BASE : SchemaSimpleTypeConstants.SCHEMA_SIMPLE_TYPE_RESTRICTION_BASE,
        OCCURENCIES_VALUES:SchemaOccurenciesConstants.OCCURENCIES_VALUES,
        DATA_IDENTIFICATION_PARAMETERES:DataIdentificationParameters.DATA_IDENTIFICATION_PARAMETERS,
        DATA_COMPONENTS_TYPES:DataComponentsTypes.DATA_COMPONENTS_TYPES,
        DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS:DataExtendedResourceIdentification.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS,
        DATA_QUERY_KEY:DataQueryKey.DATA_QUERY_KEY
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
        ItemObject:ItemObject,
        ComponentRepresentationObject:ComponentRepresentationObject,
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
        XSDCompositor:XSDCompositor,
        SeriesObject:SeriesObject,
        ObservationObject:ObservationObject,
        GroupObject:GroupObject,
        SdmxDataObjects:SdmxDataObjects,
        DatasetObject:DatasetObject

    },
    utils: {
        Utils,
        UrnUtil: UrnUtil
    }
};