var MaintainableObject = require('./MaintainableObject.js');
var SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

class DataStructureObject extends MaintainableObject {
    constructor(props, components, dimensions,children, detail) {
        super(SDMX_STRUCTURE_TYPE.DSD.key, props, children, detail);

        this.setDimensions(dimensions);
        this.setComponents(components);
    };
    setDimensions(dimensions){
        this.dimensions = dimensions;
    };
    getDimensions(dimensions){
        return this.dimensions;
    };
    setComponents(components) {
        this.components = components;
    };
    getComponents() {
        return this.components;
    }
};

module.exports = DataStructureObject;