var SdmxV21StructureReferencesParser = require('../structure-queries-parsers/SdmxV21StructureReferencesParser.js')
class SdmxV21DataHeaderParser {

    static getStructureId (sdmxJsonObject){   
        if(sdmxJsonObject.Structure){
            //console.log(SdmxV21StructureReferencesParser.getReferences(sdmxJsonObject.Structure[0].StructureUsage[0]))
            return SdmxV21StructureReferencesParser.getReferences(sdmxJsonObject.Structure[0].StructureUsage[0]);
        }
        return;
        
    }
}

module.exports = SdmxV21DataHeaderParser;