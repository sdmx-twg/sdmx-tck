var MaintainableObject = require('./MaintainableObject.js');
var SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

class DataStructureObject extends MaintainableObject {
    constructor(props, components, children, detail) {
        super(SDMX_STRUCTURE_TYPE.DSD.key, props, children, detail);

        this.setComponents(components);
    };
    setComponents(components) {
        this.components = components;
    };
    getComponents() {
        return this.components;
    }
};

module.exports = DataStructureObject;