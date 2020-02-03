var MaintainableObject = require('./MaintainableObject.js');
const SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

class ContentConstraintObject extends MaintainableObject {
    constructor(props, children, detail,cubeRegion) {
        super(SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key, props, children, detail);

        this.setType(props.$.type);
        this.setCubeRegions(cubeRegion)
    };
    setCubeRegions(cubeRegion){
        this.cubeRegion = cubeRegion;
    };
    getCubeRegions(){
        return this.cubeRegion;
    };
    setType(type) {
        this.type = type;
    };
    getType() {
        return this.type;
    };
};

module.exports = ContentConstraintObject;