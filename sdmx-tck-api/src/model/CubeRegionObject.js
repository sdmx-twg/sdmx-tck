var isDefined = require('../utils/Utils').isDefined;
const SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

class CubeRegionObject {
    constructor(props) {
        this.setIncludeValue(props.$.include);
        this.setKeyValue(props.KeyValue)
    };
    setKeyValue(KeyValue){
        this.KeyValue = this.createKeyValuesStruct(KeyValue);
    };
    getKeyValue(){
        return this.KeyValue;
    };
    setIncludeValue(includeType) {
        this.includeType = includeType;
    };
    getIncludeValue() {
        return this.includeType;
    };

    /*Create a struct from KeyValues and their properties.
    Returns an array of objects containing the id of each KeyValue as well as its value(s) (Components)*/
    createKeyValuesStruct(KeyValue){
        let keyValueArr = [];
        let valueArr = [];

        for(let i=0;i<KeyValue.length;i++){
           for(let j=0;j<KeyValue[i].Value.length;j++){
            valueArr.push({
                value:KeyValue[i].Value[j]._ ,
                includeType:isDefined(KeyValue[i].$) && isDefined(KeyValue[i].$.include)? KeyValue[i].$.include : this.includeType
             });
            }
            keyValueArr.push({
                id:KeyValue[i].$.id,
                value:valueArr
            })
            valueArr = [];
        }
        return keyValueArr;
    };
};

module.exports = CubeRegionObject;