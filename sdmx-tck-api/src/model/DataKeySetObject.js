var isDefined = require('../utils/Utils').isDefined;

class DataKeySetObject {

    constructor(props) {
         this.setIncludeValue((props.$ && props.$.isIncluded) ? props.$.isIncluded : "true");
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
        let includeType;
        for(let i=0;i<keys.length;i++){
           for(let j=0;j<keys[i].KeyValue.length;j++){
              
                //if there is include type in the KeyValue level
                if(isDefined(keys[i].KeyValue[j].$) && isDefined(keys[i].KeyValue[j].$.include)){
                    includeType = keys[i].KeyValue[j].$.include;
                }else{
                    //if there is include type in the Key level
                    if(isDefined(keys[i].$) && isDefined(keys[i].$.include)){
                        includeType = keys[i].$.include;
                    }else{
                        includeType = this.includeType;
                    }
                }
               //Create obj of each KeyValue    
               keyValues.push({
                    id:keys[i].KeyValue[j].$.id,
                    includeType:includeType,
                    value:keys[i].KeyValue[j].Value[0]._  //Get Value of each KeyValue (each keyValue in DataKeySets has one Value)
               });
            }
            keyData.push({keyValues:keyValues})
            keyValues = [];
        }
        return keyData;
    }

    

}
module.exports = DataKeySetObject;