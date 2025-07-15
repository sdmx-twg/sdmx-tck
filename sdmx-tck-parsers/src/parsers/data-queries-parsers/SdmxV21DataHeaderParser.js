var SdmxXmlV21StructureReferencesParser = require('../structure-queries-parsers/SdmxXmlV21StructureReferencesParser.js')
var HeaderStructureObject = require('sdmx-tck-api').model.HeaderStructureObject
var jsonPath = require('jsonpath');
var UrnUtil = require('sdmx-tck-api').utils.UrnUtil
class SdmxV21DataHeaderParser {

    static getStructureData (sdmxJsonObject){   
        let structureData = [];
        if(sdmxJsonObject.Structure){
            for (let i in sdmxJsonObject.Structure){
                let structureID ;
                let namespace = jsonPath.query(sdmxJsonObject.Structure[i], '$..namespace');
                if(namespace){
                    structureID =  UrnUtil.getStructureIdentityRef(namespace[0])// structureID[0];
                }
                structureData.push(new HeaderStructureObject(structureID,SdmxXmlV21StructureReferencesParser.getReferences(sdmxJsonObject.Structure[i]))) 
            }
        }
        return structureData; 
        
    }
}

module.exports = SdmxV21DataHeaderParser;