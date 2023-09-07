var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
var jsonPath = require('jsonpath');
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var SdmxV21ConstraintKeyValueParser = require('./SdmxV21ConstraintKeyValueParser.js')
const CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject;

class SdmxV21JsonCubeRegionParser {

    static getCubeRegions (sdmxJsonObject){
        let listOfCubeRegions = [];
        let cubeRegion = jsonPath.query(sdmxJsonObject, '$..CubeRegion')[0];
        if(cubeRegion){
            for (let i in cubeRegion) {
                let keyValues = SdmxV21ConstraintKeyValueParser.getCubeRegionKeyValues(cubeRegion[i])
                listOfCubeRegions.push(new CubeRegionObject(cubeRegion[i],keyValues))
            }
        }
        return listOfCubeRegions
    }
}

module.exports = SdmxV21JsonCubeRegionParser;