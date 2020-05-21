var jsonPath = require('jsonpath');
var SdmxV21StructureReferencesParser = require('./SdmxV21StructureReferencesParser.js');
var SdmxV21JsonDsdComponentRepresentationParser = require('./SdmxV21JsonDsdComponentRepresentationParser.js')
var DataStructureComponentObject = require('sdmx-tck-api').model.DataStructureComponentObject;
const DSD_COMPONENTS_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_NAMES;
class SdmxV21JsonDsdComponentParser {
    /**
     * Return an array containing components info about SDMX DSD object.
     * @param {*} sdmxJsonObject 
     */
    static getComponents(sdmxJsonObject) {

        let datastructureComponents= [];
        //Get the DSD dimensions from workspace
        let dimensions = jsonPath.query(sdmxJsonObject, '$..DimensionList..Dimension')[0];
        let timeDimensions = jsonPath.query(sdmxJsonObject, '$..DimensionList..TimeDimension')[0];
        let attributes = jsonPath.query(sdmxJsonObject,'$..AttributeList..Attribute')[0]
        let measures = jsonPath.query(sdmxJsonObject,'$..MeasureList..PrimaryMeasure')[0]

        try{
            for(let i in dimensions){
                if (dimensions[i] && dimensions[i].$ && dimensions[i].$.id) {
                    //Push in an array the dimension id and the artefact references of the dimension
                    datastructureComponents.push(
                        new DataStructureComponentObject(
                            dimensions[i],
                            DSD_COMPONENTS_NAMES.DIMENSION,
                            SdmxV21StructureReferencesParser.getReferences(dimensions[i]),
                            SdmxV21JsonDsdComponentRepresentationParser.getRepresentation(dimensions[i])))
                    
                }
            }
            for(let i in timeDimensions){
                if (timeDimensions[i] && timeDimensions[i].$ && timeDimensions[i].$.id) {
                    //Push in an array the timeDimension id and the artefact references of the timeDimension
                    datastructureComponents.push(
                        new DataStructureComponentObject(
                            timeDimensions[i],
                            DSD_COMPONENTS_NAMES.TIME_DIMENSION,
                            SdmxV21StructureReferencesParser.getReferences(timeDimensions[i]),
                            SdmxV21JsonDsdComponentRepresentationParser.getRepresentation(timeDimensions[i])))
                    
                }
            }
            for(let i in attributes){
                if (attributes[i] && attributes[i].$ && attributes[i].$.id) {
                    //Push in an array the attribute id and the artefact references of the attribute
                    datastructureComponents.push(
                        new DataStructureComponentObject(
                            attributes[i],
                            DSD_COMPONENTS_NAMES.ATTRIBUTE,
                            SdmxV21StructureReferencesParser.getReferences(attributes[i]),
                            SdmxV21JsonDsdComponentRepresentationParser.getRepresentation(attributes[i])))
                  
                }
            }
            for(let i in measures){
                if (measures[i] && measures[i].$ && measures[i].$.id) {
                    //Push in an array the measure id and the artefact references of the measure
                    datastructureComponents.push(
                        new DataStructureComponentObject(
                            measures[i],
                            DSD_COMPONENTS_NAMES.MEASURE,
                            SdmxV21StructureReferencesParser.getReferences(measures[i]),
                            SdmxV21JsonDsdComponentRepresentationParser.getRepresentation(measures[i])))
                    
                }
            }
        }catch (ex){
        }
        return datastructureComponents;

    };
    
};

module.exports = SdmxV21JsonDsdComponentParser;