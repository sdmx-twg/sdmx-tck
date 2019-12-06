import MaintainableObject from './MaintainableObject';

class ItemSchemeObject extends MaintainableObject {
    constructor(structureType, props, children, items) {
        super(structureType, props, children);

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

export default ItemSchemeObject;