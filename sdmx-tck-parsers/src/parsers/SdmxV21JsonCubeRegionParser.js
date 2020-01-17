var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject;

class SdmxV21JsonCubeRegionParser {

    static getCubeRegion (structureType, sdmxJsonObject){
        if (!isDefined(structureType)) {
            throw new Error("Missing mandatory parameter 'structureType'");
        }
        if (!isDefined(sdmxJsonObject)) {
            throw new Error("Missing mandatory parameter 'sdmxJsonObject'.");
        }

        return SdmxV21JsonCubeRegionParser._getCubeRegion(sdmxJsonObject);
    }

    /*Collect all cubeRegion properties inside of a Content Constraint in an array
    of CubeRegion objects*/
    static _getCubeRegion(sdmxJsonObject){
        let cubeRegionArray = [];
        if(sdmxJsonObject.CubeRegion){
            
            for(let i=0;i<sdmxJsonObject.CubeRegion.length;i++){
                cubeRegionArray.push(new CubeRegionObject(sdmxJsonObject.CubeRegion[i]))
            }
        }
        return cubeRegionArray;
    }
}

module.exports = SdmxV21JsonCubeRegionParser;