import MaintainableObject from './MaintainableObject';
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';

class ContentConstraintObject extends MaintainableObject {
    constructor(props, children) {
        super(SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key, props, children);

        this.setType(props.$.type);
    };
    setType(type) {
        this.type = type;
    };
    getType() {
        return this.type;
    };
};

export default ContentConstraintObject;