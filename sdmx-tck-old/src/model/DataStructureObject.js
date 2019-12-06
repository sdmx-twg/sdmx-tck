import MaintainableObject from './MaintainableObject';
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';

class DataStructureObject extends MaintainableObject {
    constructor(props, components, children) {
        super(SDMX_STRUCTURE_TYPE.DSD.key, props, children);
        
        this.setComponents(components);
    };
    setComponents(components) {
        this.components = components;
    };
    getComponents() {
        return this.components;
    }
};

export default DataStructureObject;