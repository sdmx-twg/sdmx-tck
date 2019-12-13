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

};

module.exports = ItemSchemeObject;