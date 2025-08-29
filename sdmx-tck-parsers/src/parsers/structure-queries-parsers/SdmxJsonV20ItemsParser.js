var jsonPath = require('jsonpath');
var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var SdmxJsonV20RepresentationParser = require('./SdmxJsonV20RepresentationParser.js')
var SdmxJsonV20StructureReferencesParser = require('./SdmxJsonV20StructureReferencesParser.js')
var ItemObject = require('sdmx-tck-api').model.ItemObject;

class SdmxJsonV20ItemsParser {
    static getItems(structureType, sdmxJsonObject) {
        if (!isDefined(structureType)) {
            throw new Error("Missing mandatory parameter 'structureType'");
        }
        if (!isDefined(sdmxJsonObject)) {
            throw new Error("Missing mandatory parameter 'sdmxJsonObject'.");
        }

        if (SDMX_STRUCTURE_TYPE.CODE_LIST.key === structureType) {
            let geoType = sdmxJsonObject.geoType;
            if (geoType === "GeographicCodelist") {
                return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "geoFeatureSetCodes");
            } else if (geoType === "GeoGridCodelist") {
                return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "geoGridCodes");
            } else {
                return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "codes");
            }
        } else if (SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key === structureType) {
            return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "concepts");
        } else if (SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME.key === structureType) {
            return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "categories");
        } else if (SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key === structureType) {
            return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "agencies");
        } else if (SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key === structureType) {
            return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "dataProviders");
        } else if (SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key === structureType) {
            return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "dataConsumers");
        } else if (SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key === structureType) {
            return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "organisationUnits");
        } else if (SDMX_STRUCTURE_TYPE.METADATA_PROVIDER_SCHEME.key === structureType) {
            return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "metadataProviders"); //TODO hierarchies ???
        } else if (SDMX_STRUCTURE_TYPE.VALUE_LIST.key === structureType) {
            return SdmxJsonV20ItemsParser._getItems(sdmxJsonObject, "valueItems");
        } else {
            throw new Error("Items cannot be extracted from structure of type " + structureType + ".");
        }

        // Not supported item schemes:
        // ReportingTaxonomy
        // and from VTL:
        //  TransformationScheme
        //  CustomTypeScheme
        //  NamePersonalisationScheme
        //  RulesetScheme
        //  VtlMappingScheme
        //  UserDefinedOperatorScheme
    };

    static _getItems(sdmxJsonObject, jsonKey, itemsAll) {
        let items = itemsAll ? itemsAll : [];
        let itemsJson = sdmxJsonObject[jsonKey];

        if (isDefined(itemsJson)) {
            for (let i = 0; i < itemsJson.length; i++) {
                items.push(new ItemObject(itemsJson[i].id, 
                    SdmxJsonV20StructureReferencesParser.getConceptRefs (itemsJson[i]),
                    SdmxJsonV20RepresentationParser.getRepresentation(itemsJson[i]),
                    this._getItemsParent(itemsJson[i], jsonKey)
                ));
                if (itemsJson[i][jsonKey]) {
                    SdmxJsonV20ItemsParser._getItems(itemsJson[i], jsonKey, items);
                }
            }
        }
        return items;
    };

    static _getItemsParent(sdmxJsonObject, jsonKey) {
         return sdmxJsonObject.parent;
    };
};

module.exports = SdmxJsonV20ItemsParser;