var isDefined = require('../utils/Utils').isDefined;

class DataKeySetObject {

    constructor(props) {
         this.setIncludeValue(props.$.isIncluded);
         this.setKeys(props.Key)
    };

    setKeys(keys){
        this.keys = this.createKeysStruct(keys);
    };
    getKeys(){
        return this.keys;
    };
    setIncludeValue(includeType) {
        this.includeType = includeType;
    };
    getIncludeValue() {
        return this.includeType;
    };

    createKeysStruct(keys){
        let keyValues = [];
        let keyData = [];
        for(let i=0;i<keys.length;i++){
           for(let j=0;j<keys[i].KeyValue.length;j++){
              
               //Create obj of each KeyValue    
               keyValues.push({
                    id:keys[i].KeyValue[j].$.id,
                    includeType:isDefined(keys[i].KeyValue[j].$) && isDefined(keys[i].KeyValue[j].$.include)? keys[i].KeyValue[j].$.isIncluded : this.includeType,                    
                    values:keys[i].KeyValue[j].Value[0]._  //Get Value of each KeyValue (each keyValue in DataKeySets has one Value)
               });
            }
            keyData.push({keyValues:keyValues})
            keyValues = [];
        }
        return keyData;
    }

    

}
module.exports = DataKeySetObject;