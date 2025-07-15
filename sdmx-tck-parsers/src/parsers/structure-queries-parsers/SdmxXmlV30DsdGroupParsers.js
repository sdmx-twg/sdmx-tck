var jsonPath = require('jsonpath');
var DataStructureGroupObject = require('sdmx-tck-api').model.DataStructureGroupObject

/**
 * Return an array containing the groups of a dsd.
 * @param {*} sdmxJsonObject 
 */
class SdmxXmlV30DsdGroupParser {

    static getGroups (sdmxJsonObject){
        let listOfGroups = [];
        let listOfDimensionIds = [];
        //get all Groups (groups minOccurs=0 maxOccurs=unbounded)
        let groups = jsonPath.query(sdmxJsonObject, '$..DataStructureComponents[0].Group')[0];
        
        if(groups){
            for (let i in groups) {
                listOfDimensionIds = [];
                let groupDimension = groups[i].GroupDimension;
                if(groupDimension){
                    for(let j in groupDimension){
                        listOfDimensionIds.push(groupDimension[j].DimensionReference[0]["_"])
                    }
                    listOfGroups.push(new DataStructureGroupObject(groups[i].$.id,listOfDimensionIds))
                }
            }
        }
        return listOfGroups
    }
}

module.exports = SdmxXmlV30DsdGroupParser;