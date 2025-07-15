var jsonPath = require('jsonpath');
var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;

var ConstraintReferencePeriod = require('sdmx-tck-api').model.ConstraintReferencePeriod;
var CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject;
var ConstraintKeyValueObject = require('sdmx-tck-api').model.ConstraintKeyValueObject;
var DataKeySetObject = require('sdmx-tck-api').model.DataKeySetObject;

class SdmxXmlV21ConstraintParser {
    static getCubeRegions(sdmxJsonObject) {
        let listOfCubeRegions = [];
        let cubeRegion = jsonPath.query(sdmxJsonObject, '$..CubeRegion')[0];
        if (cubeRegion) {
            for (let i in cubeRegion) {
                let keyValues = SdmxXmlV21ConstraintParser.getCubeRegionKeyValues(cubeRegion[i])
                let include = (cubeRegion[i] && cubeRegion[i].$) ? cubeRegion[i].$.include : undefined;
                listOfCubeRegions.push(new CubeRegionObject(include, keyValues))
            }
        }
        return listOfCubeRegions
    }

    static getDataKeySets(sdmxJsonObject) {
        let listOfDataKeySets = [];
        let dataKeySet = jsonPath.query(sdmxJsonObject, '$..DataKeySet')[0];
        if (dataKeySet) {
            for (let i in dataKeySet) {
                let keys = SdmxXmlV21ConstraintParser.getDataKeySetKeys(dataKeySet[i])
                let included = (dataKeySet[i] && dataKeySet[i].$) ? dataKeySet[i].$.isIncluded : undefined;
                listOfDataKeySets.push(new DataKeySetObject(included, keys))
            }
        }
        return listOfDataKeySets
    }

    static getCubeRegionKeyValues(sdmxJsonObject) {
        let listOfKeyValues = [];
        let valueArr = [];
        let includeTypeOfCubeRegion = (sdmxJsonObject.$ && sdmxJsonObject.$.include) ? sdmxJsonObject.$.include : "true"
        let keyValue = jsonPath.query(sdmxJsonObject, '$..KeyValue')[0];
        if (keyValue) {
            for (let i in keyValue) {
                if (keyValue[i].Value && Array.isArray(keyValue[i].Value)) {
                    for (let j = 0; j < keyValue[i].Value.length; j++) {
                        valueArr.push(keyValue[i].Value[j]._);
                    }
                    /* Each Key Value contains:
                        a) Its id.
                        b) Its origin (whether it was inside of CubeRegion or DataKeyset)
                        c) If it has its own include property we keep it else the Key Value inherits the include type of its cube region.
                        d) An array of its values.
                    */
                    let includeType = isDefined(keyValue[i].$) && isDefined(keyValue[i].$.include) ? keyValue[i].$.include : includeTypeOfCubeRegion;
                    let keyValueId = (keyValue[i] && keyValue[i].$) ? keyValue[i].$.id : undefined;
                    listOfKeyValues.push(new ConstraintKeyValueObject(keyValueId, CubeRegionObject.name, includeType, valueArr))

                    valueArr = [];
                }
            }
        }
        return listOfKeyValues;
    }

    static getDataKeySetKeys(sdmxJsonObject) {
        let listOfKeys = [];
        let keyValues = [];
        let includeType;
        let includeTypeOfDataKeySet = (sdmxJsonObject.$ && sdmxJsonObject.$.isIncluded) ? sdmxJsonObject.$.isIncluded : "true"
        let key = jsonPath.query(sdmxJsonObject, '$..Key')[0];

        if (key) {
            for (let i in key) {
                if (key[i].KeyValue && Array.isArray(key[i].KeyValue)) {
                    for (let j = 0; j < key[i].KeyValue.length; j++) {

                        //if there is include type in the KeyValue level
                        if (isDefined(key[i].KeyValue[j].$) && isDefined(key[i].KeyValue[j].$.include)) {
                            includeType = key[i].KeyValue[j].$.include;
                        } else {
                            //if there is include type in the Key level
                            if (isDefined(key[i].$) && isDefined(key[i].$.include)) {
                                includeType = key[i].$.include;
                            } else {
                                includeType = includeTypeOfDataKeySet;
                            }
                        }
                        let keyValueId = (key[i].KeyValue[j] && key[i].KeyValue[j].$) ? key[i].KeyValue[j].$.id : undefined;
                        keyValues.push(new ConstraintKeyValueObject(keyValueId, DataKeySetObject.name, includeType, key[i].KeyValue[j].Value[0]._))
                    }
                }
                listOfKeys.push(keyValues)
                keyValues = [];
            }
        }
        return listOfKeys
    }

    static getReferencePeriod(sdmxJsonObject) {
        let refPeriod = jsonPath.query(sdmxJsonObject, '$..ReferencePeriod')[0];
        if (refPeriod) {
            if (refPeriod[0] && refPeriod[0].$) {
                return new ConstraintReferencePeriod(refPeriod[0].$.startTime, refPeriod[0].$.endTime)
            }
        }
        return;
    }
}
module.exports = SdmxXmlV21ConstraintParser;