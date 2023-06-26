var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
var jsonPath = require('jsonpath');
let CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject;
let DataKeySetObject = require('sdmx-tck-api').model.DataKeySetObject;
var ConstraintKeyValueObject = require('sdmx-tck-api').model.ConstraintKeyValueObject;
class SdmxV21ConstraintKeyValueParser {

    static getCubeRegionKeyValues (sdmxJsonObject){
        let listOfKeyValues = [];
        let valueArr = [];
        let includeTypeOfCubeRegion = (sdmxJsonObject.$ && sdmxJsonObject.$.include)?sdmxJsonObject.$.include:"true"
        let keyValue = jsonPath.query(sdmxJsonObject, '$..KeyValue')[0];
        if(keyValue){
            for (let i in keyValue) {
                if(keyValue[i].Value && Array.isArray(keyValue[i].Value)){
                    for(let j=0;j<keyValue[i].Value.length;j++){
                        valueArr.push(keyValue[i].Value[j]._ );
                        }
                    /* Each Key Value contains:
                        a) Its id.
                        b) Its origin (whether it was inside of CubeRegion or DataKeyset)
                        c) If it has its own include property we keep it else the Key Value inherits the include type of its cube region.
                        d) An array of its values.
                    */
                    let includeType = isDefined(keyValue[i].$) && isDefined(keyValue[i].$.include)? keyValue[i].$.include : includeTypeOfCubeRegion;
                    listOfKeyValues.push(new ConstraintKeyValueObject(keyValue[i],CubeRegionObject.name,includeType,valueArr))
    
                    valueArr = [];
                }
            }
        }
        return listOfKeyValues;
    }

    static getDataKeySetKeys (sdmxJsonObject){
        let listOfKeys = [];
        let keyValues = [];
        let includeType;
        let includeTypeOfDataKeySet = (sdmxJsonObject.$ && sdmxJsonObject.$.isIncluded)?sdmxJsonObject.$.isIncluded:"true"
        let key = jsonPath.query(sdmxJsonObject, '$..Key')[0];

        if(key){
            for(let i in key){
                if(key[i].KeyValue && Array.isArray(key[i].KeyValue)){
                    for(let j=0;j<key[i].KeyValue.length;j++){
                        
                            //if there is include type in the KeyValue level
                            if(isDefined(key[i].KeyValue[j].$) && isDefined(key[i].KeyValue[j].$.include)){
                                includeType = key[i].KeyValue[j].$.include;
                            }else{
                                //if there is include type in the Key level
                                if(isDefined(key[i].$) && isDefined(key[i].$.include)){
                                    includeType = key[i].$.include;
                                }else{
                                    includeType = includeTypeOfDataKeySet;
                                }
                            }
                            keyValues.push(new ConstraintKeyValueObject(key[i].KeyValue[j],DataKeySetObject.name,includeType,key[i].KeyValue[j].Value[0]._))
                        }
                    }
                listOfKeys.push(keyValues)
                keyValues = [];
            }
        }
        return listOfKeys
    }
}

module.exports = SdmxV21ConstraintKeyValueParser;