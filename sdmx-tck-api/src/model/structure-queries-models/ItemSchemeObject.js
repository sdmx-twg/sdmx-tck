var MaintainableObject = require('./MaintainableObject.js');
<<<<<<< HEAD
var StructureReference = require("./StructureReference.js");
=======
var isDefined = require('../../utils/Utils.js').isDefined;
var SDMX_STRUCTURE_TYPE = require('../../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
>>>>>>> v4.8.0

class ItemSchemeObject extends MaintainableObject {
    constructor(structureType, props, children, detail, items) {
        super(structureType, props, children, detail);

        this.setIsPartial(props.$.isPartial);
        this.setItems(items);
<<<<<<< HEAD
=======
        this.setVersionIfEmpty();
        this.setHasExtensions(props);
>>>>>>> v4.8.0
    };
    setIsPartial(isPartial) {
        this.isPartial = isPartial;
    };
    getIsPartial() {
        return this.isPartial;
    };
    setItems(items) {
        this.items = items;
    };
<<<<<<< HEAD
=======
   /**
     * Item Schemes for agencies, providers and consumers in SDMX 3.0 don't have the version attribute.
     * For compatibility reasons, it is not wrong to assume that it is 1.0 (i.e. their default fixed version in SDMX 2.1).
     */
    setVersionIfEmpty() {
        if (!isDefined(this.getVersion()) &&
            (this.getStructureType() === SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key || 
            this.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key || 
            this.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key ||
            this.getStructureType() === SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key ||
            this.getStructureType() === SDMX_STRUCTURE_TYPE.METADATA_PROVIDER_SCHEME.key)) {
            this.setVersion('1.0');
        }
    };
    /**
     * Set the hasExtensions parameter for Codelist artefacts only
     */
    setHasExtensions(props) {
        if (this.getStructureType() === SDMX_STRUCTURE_TYPE.CODE_LIST.key) {
            this.hasExtensions = (props.hasOwnProperty("CodelistExtension"));
        }
    };
    /**
     * Returns true/false for Codelist artefacts by checking existence of the 'CodelistExtension' element.
     * Returns undefined for any other Item Scheme
     */
    getHasExtensions() {
        return this.hasExtensions;
    };
>>>>>>> v4.8.0
    getItems() {
        return this.items;
    };
    getItemsCombination(){
        let testItems = [];
        if (this.getItems().length >= 2) {
            testItems.push(this.getItems()[0].id);
            testItems.push(this.getItems()[1].id);
            return testItems;
        } else if (this.getItems().length === 1) {
            return [];
        }
    };
<<<<<<< HEAD
   
=======
    hasItem(itemId) {
        return this.getItems().some(item => item.getId() === itemId);
    }
    findItem(itemId) {
        return this.getItems().find(item => item.getId() === itemId);
    }
>>>>>>> v4.8.0
};

module.exports = ItemSchemeObject;