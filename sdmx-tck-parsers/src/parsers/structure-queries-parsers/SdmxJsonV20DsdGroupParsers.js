var jsonPath = require('jsonpath');
var DataStructureGroupObject = require('sdmx-tck-api').model.DataStructureGroupObject

/**
 * Return an array containing the groups of a dsd.
 * @param {*} sdmxJsonObject 
 */
class SdmxJsonV20DsdGroupParser {

    static getGroups (sdmxJsonObject){
        let listOfGroups = [];
        let groups = sdmxJsonObject.dataStructureComponents?.groups;
        if(groups){
            for (let i in groups) {
                let listOfDimensionIds = groups[i].groupDimensions;
                listOfGroups.push(new DataStructureGroupObject(groups[i].id,listOfDimensionIds));
            }
        }
        return listOfGroups
    }
}

module.exports = SdmxJsonV20DsdGroupParser;