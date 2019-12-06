import MaintainableObject from './MaintainableObject';
import SDMX_STRUCTURE_TYPE  from '../constants/SdmxStructureType';

class DataflowObject extends MaintainableObject {
    constructor(props, children) {
        super(SDMX_STRUCTURE_TYPE.DATAFLOW.key, props, children);

        this.setDsdRef(props.$.dsdRef);
    };
    setDsdRef(dsdRef) {
        this.dsdRef = dsdRef;
    };
    getDsdRef() {
        return this.dsdRef;
    };
};

export default DataflowObject;