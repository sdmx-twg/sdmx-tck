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
      
    getAllSameIdKeyValues(selectedkeyValue){
        let sumOfKeyValues = [];
        //Collect all KeyValues with the same id from cube regions
        for(let i=0;i<this.cubeRegion.length;i++){
            let keyValuesWithSameId = this.cubeRegion[i].getKeyValuesWithSpecificId(selectedkeyValue.id)
            keyValuesWithSameId.forEach(function(keyvalue) {
                sumOfKeyValues.push(keyvalue)
            });
        }
        return sumOfKeyValues;
    }

};

module.exports = ContentConstraintObject;