var isDefined = require('../utils/Utils').isDefined;

class CubeRegionObject {
    constructor(props) {
        this.setIncludeValue(props.$.include);
        this.setKeyValues(props.KeyValue)
    };
    setKeyValues(KeyValue){
        this.KeyValue = this.createKeyValuesStruct(KeyValue);
    };
    getKeyValues(){
        return this.KeyValue;
    };
    setIncludeValue(includeType) {
        this.includeType = includeType;
    };
    getIncludeValue() {
        return this.includeType;
    };

    //Returns keyvalues with specific id from CubeRegion
    getKeyValuesWithSpecificId(keyValueId){
        let specificKeyValue = [];
        for(let i=0;i<this.KeyValue.length;i++){
            if(this.KeyValue[i].id === keyValueId){
                specificKeyValue.push(this.KeyValue[i])
            }
        }
        return specificKeyValue;
    }

    /*Create a struct from KeyValues and their properties.
    Returns an array of objects containing the id of each KeyValue as well as its value(s) (Components)*/
    createKeyValuesStruct(KeyValue){
        let keyValueArr = [];
        let valueArr = [];

        for(let i=0;i<KeyValue.length;i++){
           for(let j=0;j<KeyValue[i].Value.length;j++){
            valueArr.push({
                value:KeyValue[i].Value[j]._ 
             });
            }
            /* Each Key Value contains:
                a) Its id.
                b) If it has its own include property we keep it else the Key Value inherits the include type of its cube region.
                c) An array of its values.
            */
            keyValueArr.push({
                id:KeyValue[i].$.id,
                includeType:isDefined(KeyValue[i].$) && isDefined(KeyValue[i].$.include)? KeyValue[i].$.include : this.includeType,
                value:valueArr
            })
            valueArr = [];
        }
        return keyValueArr;
    };
};

module.exports = CubeRegionObject;