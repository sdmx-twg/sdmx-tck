var jsonPath = require('jsonpath');
var SdmxV21StructureReferencesParser = require('./SdmxV21StructureReferencesParser.js');


class SdmxV21JsonDsdComponentParser {
    /**
     * Return an array containing dimensions info about SDMX DSD object.
     * @param {*} sdmxJsonObject 
     */
    static getComponents(sdmxJsonObject) {
        let datastructureDimensions = [];
        let datastructureTimeDimensions = [];
        let datastructureAttributes = [];
        let datastructureMeasures = [];
        
        //Get the DSD dimensions from workspace
        let dimensions = jsonPath.query(sdmxJsonObject, '$..DimensionList..Dimension')[0];
        let timeDimensions = jsonPath.query(sdmxJsonObject, '$..DimensionList..TimeDimension')[0];
        let attributes = jsonPath.query(sdmxJsonObject,'$..AttributeList..Attribute')[0]
        let measures = jsonPath.query(sdmxJsonObject,'$..MeasureList..PrimaryMeasure')[0]

        try{
            for(let i in dimensions){
                if (dimensions[i] && dimensions[i].$ && dimensions[i].$.id) {
                    
                    //Push in an array the dimension id and the artefact references of the dimension
                    datastructureDimensions.push({
                        componentId : dimensions[i].$.id,
                        componentReferences : SdmxV21StructureReferencesParser.getReferences(dimensions[i])
                    })
                }
            }
            for(let i in timeDimensions){
                if (timeDimensions[i] && timeDimensions[i].$ && timeDimensions[i].$.id) {
                    
                    //Push in an array the timeDimension id and the artefact references of the timeDimension
                    datastructureTimeDimensions.push({
                        componentId : timeDimensions[i].$.id,
                        componentReferences : SdmxV21StructureReferencesParser.getReferences(timeDimensions[i])
                    })
                }
            }
            for(let i in attributes){
                if (attributes[i] && attributes[i].$ && attributes[i].$.id) {
                    
                    //Push in an array the attribute id and the artefact references of the attribute
                    datastructureAttributes.push({
                        componentId : attributes[i].$.id,
                        componentReferences : SdmxV21StructureReferencesParser.getReferences(attributes[i])
                    })
                }
            }
            for(let i in measures){
                if (measures[i] && measures[i].$ && measures[i].$.id) {
                    
                    //Push in an array the measure id and the artefact references of the measure
                    datastructureMeasures.push({
                        componentId : measures[i].$.id,
                        componentReferences : SdmxV21StructureReferencesParser.getReferences(measures[i])
                    })
                }
            }
        }catch (ex){

        }
        
        return {Dimensions:datastructureDimensions,
                TimeDimensions:datastructureTimeDimensions,
                Attributes:datastructureAttributes,
                Measures:datastructureMeasures};
    };
    
};

module.exports = SdmxV21JsonDsdComponentParser;