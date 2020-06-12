var jsonPath = require('jsonpath');
var DataStructureGroupObject = require('sdmx-tck-api').model.DataStructureGroupObject

class SdmxV21JsonCubeRegionParser {

    static getGroups (sdmxJsonObject){
        let listOfGroups = [];
        let listOfDimensionIds = []
        let groups = jsonPath.query(sdmxJsonObject, '$..Group')[0];
        
        if(groups){
            for (let i in groups) {
                listOfDimensionIds = [];
                let dimensionsRefs = jsonPath.query(groups[i], '$..Ref');
               
                if(dimensionsRefs){
                    for(let j in dimensionsRefs){
                        listOfDimensionIds.push(dimensionsRefs[j][0].$.id)
                    }
                listOfGroups.push(new DataStructureGroupObject(groups[i],listOfDimensionIds))
                }
            }
        }
        return listOfGroups
    }
}

module.exports = SdmxV21JsonCubeRegionParser;