var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
const DataKeySetObject = require('sdmx-tck-api').model.DataKeySetObject;

class SdmxV21JsonDataKeySetParser {

    static getDataKeySets (structureType, sdmxJsonObject){
        if (!isDefined(structureType)) {
            throw new Error("Missing mandatory parameter 'structureType'");
        }
        if (!isDefined(sdmxJsonObject)) {
            throw new Error("Missing mandatory parameter 'sdmxJsonObject'.");
        }

        return SdmxV21JsonDataKeySetParser._getDataKeySets(sdmxJsonObject);
    }

    /*Collect all dataKeySet properties inside of a Content Constraint in an array
    of DataKeySet objects*/
    static _getDataKeySets(sdmxJsonObject){
        let dataKeySetArray = [];
        if(sdmxJsonObject.DataKeySet){
            for(let i=0;i<sdmxJsonObject.DataKeySet.length;i++){
                dataKeySetArray.push(new DataKeySetObject(sdmxJsonObject.DataKeySet[i]))
            }
        }
        return dataKeySetArray;
    }
}

module.exports = SdmxV21JsonDataKeySetParser;