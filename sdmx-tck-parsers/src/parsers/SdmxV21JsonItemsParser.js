var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

class SdmxV21JsonItemsParser {
    static getItems(structureType, sdmxJsonObject) {
        if (!isDefined(structureType)) {
            throw new Error("Missing mandatory parameter 'structureType'");
        }
        if (!isDefined(sdmxJsonObject)) {
            throw new Error("Missing mandatory parameter 'sdmxJsonObject'.");
        }

        if (SDMX_STRUCTURE_TYPE.CODE_LIST.key === structureType) {
            return SdmxV21JsonItemsParser._getItems(sdmxJsonObject, "Code");
        } else if (SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key === structureType) {
            return SdmxV21JsonItemsParser._getItems(sdmxJsonObject, "Concept");
        } else if (SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME.key === structureType) {
            return SdmxV21JsonItemsParser._getItems(sdmxJsonObject, "Category");
        } else if (SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key === structureType) {
            return SdmxV21JsonItemsParser._getItems(sdmxJsonObject, "Agency");
        } else if (SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key === structureType) {
            return SdmxV21JsonItemsParser._getItems(sdmxJsonObject, "DataProvider");
        } else if (SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key === structureType) {
            return SdmxV21JsonItemsParser._getItems(sdmxJsonObject, "DataConsumer");
        } else if (SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key === structureType) {
            return SdmxV21JsonItemsParser._getItems(sdmxJsonObject, "OrganisationUnit");
        } else if (SDMX_STRUCTURE_TYPE.HIERARCHICAL_CODELIST.key === structureType) {
            return SdmxV21JsonItemsParser._getItems(sdmxJsonObject, "Hierarchy");
        } else {
            throw new Error("Items cannot be extracted from structure of type " + structureType + ".");
        }
    };

    static _getItems(sdmxJsonObject, jsonKey, itemsAll) {
        let items = itemsAll ? itemsAll : [];
        let itemsJson = sdmxJsonObject[jsonKey];
        if (isDefined(itemsJson)) {
            for (let i = 0; i < itemsJson.length; i++) {
                items.push({ id: itemsJson[i].$.id, urn: itemsJson[i].$.urn });

                if (itemsJson[i][jsonKey]) {
                    SdmxV21JsonItemsParser._getItems(itemsJson[i], jsonKey, items);
                }
            }
        }
        return items;
    };
};

module.exports = SdmxV21JsonItemsParser;