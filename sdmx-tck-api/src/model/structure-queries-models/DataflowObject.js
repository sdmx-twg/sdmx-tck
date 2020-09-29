var MaintainableObject = require('./MaintainableObject.js');
const SDMX_STRUCTURE_TYPE = require('../../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

class DataflowObject extends MaintainableObject {
    constructor(props, children, detail) {
        super(SDMX_STRUCTURE_TYPE.DATAFLOW.key, props, children, detail);

        this.setDsdRef(props.$.dsdRef);
    };
    setDsdRef(dsdRef) {
        this.dsdRef = dsdRef;
    };
    getDsdRef() {
        return this.dsdRef;
    };
};

module.exports = DataflowObject;