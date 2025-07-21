var isDefined = require('../../utils/Utils').isDefined;

class DataKeySetObject {
    constructor(included, keys) {
        this.includeType = included ? included : "true";
        this.keys = keys;
    };

    setKeys(keys){
        this.keys = keys;
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

    getSameIdKeyValues(keyValueId){
        let keyValArr = [];
        
        if(!isDefined(this.keys) || !Array.isArray(this.keys)){
            return [];
        }
       
        this.keys.forEach(keySet => {
            if(isDefined(keySet) && Array.isArray(keySet)){
                keySet.forEach(keyVal => {
                    //push keyvalues with same id - no duplicates
                    if(keyVal.id === keyValueId && !(keyValArr.some(element => (element.includeType === keyVal.includeType && element.values === keyVal.values)))){
                        keyValArr.push(keyVal)
                    }
                })
            }
        })
        return keyValArr;
    }
}
module.exports = DataKeySetObject;