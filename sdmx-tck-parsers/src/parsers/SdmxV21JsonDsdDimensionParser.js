var jsonPath = require('jsonpath');
var SdmxV21StructureReferencesParser = require('./SdmxV21StructureReferencesParser.js');


class SdmxV21JsonDsdDimensionParser {
    /**
     * Return an array containing dimensions info about SDMX DSD object.
     * @param {*} sdmxJsonObject 
     */
    static getDimensions(sdmxJsonObject) {
        let datastructureDimensions = [];
        
        //Get the DSD dimensions from workspace
        let dimensions = jsonPath.query(sdmxJsonObject, '$..DimensionList..Dimension')[0];
        try{
            for(let i in dimensions){
                if (dimensions[i] && dimensions[i].$ && dimensions[i].$.id) {
                    
                    //Push in an array the dimension id and the artefact references of the dimension
                    datastructureDimensions.push({
                        dimensionId : dimensions[i].$.id,
                        dimensionReferences : SdmxV21StructureReferencesParser.getReferences(dimensions[i])
                    })
                }
            }
        }catch (ex){

        }
        
        return datastructureDimensions;
    };
    
};

module.exports = SdmxV21JsonDsdDimensionParser;