var jsonPath = require('jsonpath');
var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var SdmxV21JsonComponentRepresentationParser = require('./SdmxV21JsonComponentRepresentationParser.js')
var SdmxV30StructureReferencesParser = require('./SdmxV30StructureReferencesParser.js')
var ItemObject = require('sdmx-tck-api').model.ItemObject;

class SdmxV30JsonItemsParser {
    static getItems(structureType, sdmxJsonObject) {
        if (!isDefined(structureType)) {
            throw new Error("Missing mandatory parameter 'structureType'");
        }
        if (!isDefined(sdmxJsonObject)) {
            throw new Error("Missing mandatory parameter 'sdmxJsonObject'.");
        }

        if (SDMX_STRUCTURE_TYPE.CODE_LIST.key === structureType) {
            return SdmxV30JsonItemsParser._getItems(sdmxJsonObject, "Code");
        } else if (SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key === structureType) {
            return SdmxV30JsonItemsParser._getItems(sdmxJsonObject, "Concept");
        } else if (SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME.key === structureType) {
            return SdmxV30JsonItemsParser._getItems(sdmxJsonObject, "Category");
        } else if (SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key === structureType) {
            return SdmxV30JsonItemsParser._getItems(sdmxJsonObject, "Agency");
        } else if (SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key === structureType) {
            return SdmxV30JsonItemsParser._getItems(sdmxJsonObject, "DataProvider");
        } else if (SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key === structureType) {
            return SdmxV30JsonItemsParser._getItems(sdmxJsonObject, "DataConsumer");
        } else if (SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key === structureType) {
            return SdmxV30JsonItemsParser._getItems(sdmxJsonObject, "OrganisationUnit");
        } else if (SDMX_STRUCTURE_TYPE.METADATA_PROVIDER_SCHEME.key === structureType) {
            return SdmxV30JsonItemsParser._getItems(sdmxJsonObject, "MetadataProvider"); //TODO hierarchies ???
        } else if (SDMX_STRUCTURE_TYPE.VALUE_LIST.key === structureType) {
            return SdmxV30JsonItemsParser._getItems(sdmxJsonObject, "ValueItem");
        } else {
            throw new Error("Items cannot be extracted from structure of type " + structureType + ".");
        }
    };

    static _getItems(sdmxJsonObject, jsonKey, itemsAll) {
        let items = itemsAll ? itemsAll : [];
        let itemsJson = sdmxJsonObject[jsonKey];

        if (isDefined(itemsJson)) {
            for (let i = 0; i < itemsJson.length; i++) {
                items.push(new ItemObject(itemsJson[i].$.id , 
                    SdmxV30StructureReferencesParser.getReferences(itemsJson[i]),
                    SdmxV21JsonComponentRepresentationParser.getRepresentation(itemsJson[i]),
                    this._getItemsParent(itemsJson[i]),
                    itemsJson[i].$.urn));
                
                if (itemsJson[i][jsonKey]) {
                    SdmxV30JsonItemsParser._getItems(itemsJson[i], jsonKey, items);
                }
            }
        }
        return items;
    };

    static _getItemsParent(sdmxJsonObject) {
        // The parent item id is the text value of the "Parent" element
        let parent =  jsonPath.query(sdmxJsonObject, "$..Parent..['_']")[0];
        if (parent){
            return parent;
        }
        return;
    };
};

module.exports = SdmxV30JsonItemsParser;