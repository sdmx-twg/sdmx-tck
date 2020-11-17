var SdmxV21StructureReferencesParser = require('../structure-queries-parsers/SdmxV21StructureReferencesParser.js')
var jsonPath = require('jsonpath');

class SdmxV21DataHeaderParser {

    static getStructureRefs (sdmxJsonObject){   
        if(sdmxJsonObject.Structure){
            return SdmxV21StructureReferencesParser.getReferences(sdmxJsonObject.Structure[0]);           
        }
        return;
        
    }

    static getStructureId (sdmxJsonObject){   
        if(sdmxJsonObject.Structure){
            let structureID = jsonPath.query(sdmxJsonObject, '$..structureID');
            if(structureID){
                return structureID[0];
            }
        }
        return;
        
    }
}

module.exports = SdmxV21DataHeaderParser;