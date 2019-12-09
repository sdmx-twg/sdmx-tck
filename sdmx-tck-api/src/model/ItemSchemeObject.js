var MaintainableObject = require('./MaintainableObject.js');

class ItemSchemeObject extends MaintainableObject {
    constructor(structureType, props, children, detail, items) {
        super(structureType, props, children, detail);

        this.setIsPartial(props.$.isPartial);
        this.setItems(items);
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
    getItems() {
        return this.items;
    };
};

module.exports = ItemSchemeObject;