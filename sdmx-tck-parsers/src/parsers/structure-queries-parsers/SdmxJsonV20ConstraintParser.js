var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
var CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject;
var ConstraintKeyValueObject = require('sdmx-tck-api').model.ConstraintKeyValueObject;
var DataKeySetObject = require('sdmx-tck-api').model.DataKeySetObject;

class SdmxJsonV20ConstraintParser {

    static getCubeRegions(sdmxJsonObject) {
        let listOfCubeRegions = [];
        let cubeRegions = sdmxJsonObject.cubeRegions;
        if (cubeRegions) {
            for (let cubeRegion of cubeRegions) {
                let keyValues = SdmxJsonV20ConstraintParser.getCubeRegionKeyValues(cubeRegion)
                listOfCubeRegions.push(new CubeRegionObject(cubeRegion.include, keyValues))
            }
        }
        return listOfCubeRegions
    }

    static getDataKeySets(sdmxJsonObject) {
        let listOfDataKeySets = [];
        let dataKeySet = sdmxJsonObject.dataKeySets;
        if (dataKeySet) {
            for (let set of dataKeySet) {
                let keys = SdmxJsonV20ConstraintParser.getDataKeySetKeys(set)
                listOfDataKeySets.push(new DataKeySetObject(set.isIncluded, keys))
            }
        }
        return listOfDataKeySets
    }

    static getCubeRegionKeyValues(cubeRegionJsonObject) {
        let listOfKeyValues = [];
        let includeTypeOfCubeRegion = cubeRegionJsonObject.include ? cubeRegionJsonObject.include : "true";
        let keyValues = cubeRegionJsonObject.keyValues;
        if (keyValues) {
            for (let keyValue of keyValues) {
                let values = keyValue.values;
                if (values && Array.isArray(values)) {
                    let valueArr = values.map(v => v.value);
                    /* Each Key Value contains:
                        a) Its id.
                        b) Its origin (whether it was inside of CubeRegion or DataKeyset)
                        c) If it has its own include property we keep it else the Key Value inherits the include type of its cube region.
                        d) An array of its values.
                    */
                    let includeType = keyValue.include ? keyValue.include : includeTypeOfCubeRegion;
                    listOfKeyValues.push(new ConstraintKeyValueObject(keyValue.id, CubeRegionObject.name, includeType, valueArr));
                }
            }
        }
        return listOfKeyValues;
    }

    static getDataKeySetKeys(sdmxJsonObject) {
        let listOfKeys = [];
        let includeTypeOfDataKeySet = sdmxJsonObject.isIncluded ? sdmxJsonObject.isIncluded : "true";
        let keys = sdmxJsonObject.keys;
        if (keys) {
            for (let key of keys) {
                let listOfKeyValues = [];
                let keyValues = key.keyValues;
                if (keyValues && Array.isArray(keyValues)) {
                    for (let keyValue of keyValues) {
                        let includeType;
                        // if there is include type in the KeyValue level
                        if (isDefined(keyValue.include)) {
                            includeType = keyValue.include;
                        } else {
                            // if there is include type in the Key level
                            if (isDefined(key.include)) {
                                includeType = key.include;
                            } else {
                                includeType = includeTypeOfDataKeySet;
                            }
                        }
                        listOfKeyValues.push(new ConstraintKeyValueObject(keyValue.id, DataKeySetObject.name, includeType, keyValue.value));
                    }
                }
                listOfKeys.push(listOfKeyValues)
            }
        }
        return listOfKeys
    }

    static getReferencePeriod(sdmxJsonObject) {
        // ReferencePeriod no longer exists in SDMX 3.0
        return null;
    }
}
module.exports = SdmxJsonV20ConstraintParser;