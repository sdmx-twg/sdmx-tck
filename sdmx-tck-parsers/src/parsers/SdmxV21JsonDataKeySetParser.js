var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
const DataKeySetObject = require('sdmx-tck-api').model.DataKeySetObject;
var SdmxV21ConstraintKeyValueParser = require('./SdmxV21ConstraintKeyValueParser.js')
var jsonPath = require('jsonpath');


class SdmxV21JsonDataKeySetParser {

    static getDataKeySets (sdmxJsonObject){
        let listOfDataKeySets = [];
        let dataKeySet = jsonPath.query(sdmxJsonObject, '$..DataKeySet')[0];
        if(dataKeySet){
            for (let i in dataKeySet) {
                let keys = SdmxV21ConstraintKeyValueParser.getDataKeySetKeys(dataKeySet[i])
                console.log(new DataKeySetObject(dataKeySet[i],keys).keys[0])
                listOfDataKeySets.push(new DataKeySetObject(dataKeySet[i],keys))
            }
        }
        return listOfDataKeySets
    }

}

module.exports = SdmxV21JsonDataKeySetParser;