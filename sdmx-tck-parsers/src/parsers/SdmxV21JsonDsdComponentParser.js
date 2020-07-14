var jsonPath = require('jsonpath');
var SdmxV21StructureReferencesParser = require('./SdmxV21StructureReferencesParser.js');
var SdmxV21JsonComponentRepresentationParser = require('./SdmxV21JsonComponentRepresentationParser.js')
var DataStructureComponentObject = require('sdmx-tck-api').model.DataStructureComponentObject;
const DSD_COMPONENTS_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_NAMES;
var SdmxV21JsonDsdAttributeRelationshipParser = require('./SdmxV21JsonDsdAttributeRelationshipParser.js')
var DataStructureAttributeObject = require('sdmx-tck-api').model.DataStructureAttributeObject;
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
        let primaryMeasure = jsonPath.query(sdmxJsonObject,'$..MeasureList..PrimaryMeasure')[0]
        let measureDimension = jsonPath.query(sdmxJsonObject,'$..DimensionList..MeasureDimension')[0]
        try{
            for(let i in dimensions){
                let id = (dimensions[i] && dimensions[i].$ && dimensions[i].$.id) ? dimensions[i].$.id : jsonPath.query(dimensions[i].ConceptIdentity[0],'$..Ref')[0][0].$.id
                //Push in an array the dimension id and the artefact references of the dimension
                datastructureComponents.push(
                    new DataStructureComponentObject(
                        id,
                        DSD_COMPONENTS_NAMES.DIMENSION,
                        SdmxV21StructureReferencesParser.getReferences(dimensions[i]),
                        SdmxV21JsonComponentRepresentationParser.getRepresentation(dimensions[i])))
                
            }
            for(let i in timeDimensions){
                let id = (timeDimensions[i] && timeDimensions[i].$ && timeDimensions[i].$.id) ? timeDimensions[i].$.id : jsonPath.query(timeDimensions[i].ConceptIdentity[0],'$..Ref')[0][0].$.id
                //Push in an array the timeDimension id and the artefact references of the timeDimension
                datastructureComponents.push(
                    new DataStructureComponentObject(
                        id,
                        DSD_COMPONENTS_NAMES.TIME_DIMENSION,
                        SdmxV21StructureReferencesParser.getReferences(timeDimensions[i]),
                        SdmxV21JsonComponentRepresentationParser.getRepresentation(timeDimensions[i])))
                
                
            }
            for(let i in attributes){
                let id = (attributes[i] && attributes[i].$ && attributes[i].$.id) ? attributes[i].$.id : jsonPath.query(attributes[i].ConceptIdentity[0],'$..Ref')[0][0].$.id
                //Push in an array the attribute id and the artefact references of the attribute
                datastructureComponents.push(
                    new DataStructureAttributeObject(
                        id,
                        DSD_COMPONENTS_NAMES.ATTRIBUTE,
                        SdmxV21StructureReferencesParser.getReferences(attributes[i]),
                        SdmxV21JsonComponentRepresentationParser.getRepresentation(attributes[i]),
                        SdmxV21JsonDsdAttributeRelationshipParser.getAttributeRelationship(attributes[i])))

            }
            for(let i in primaryMeasure){
                let id = (primaryMeasure[i] && primaryMeasure[i].$ && primaryMeasure[i].$.id) ? primaryMeasure[i].$.id : jsonPath.query(primaryMeasure[i].ConceptIdentity[0],'$..Ref')[0][0].$.id
                //Push in an array the measure id and the artefact references of the measure
                datastructureComponents.push(
                    new DataStructureComponentObject(
                        id,
                        DSD_COMPONENTS_NAMES.PRIMARY_MEASURE,
                        SdmxV21StructureReferencesParser.getReferences(primaryMeasure[i]),
                        SdmxV21JsonComponentRepresentationParser.getRepresentation(primaryMeasure[i])))
                
                
            }
            for(let i in measureDimension){
                let id = (measureDimension[i] && measureDimension[i].$ && measureDimension[i].$.id) ? measureDimension[i].$.id : jsonPath.query(measureDimension[i].ConceptIdentity[0],'$..Ref')[0][0].$.id
                //Push in an array the measure id and the artefact references of the measure
                datastructureComponents.push(
                    new DataStructureComponentObject(
                        id,
                        DSD_COMPONENTS_NAMES.MEASURE_DIMENSION,
                        SdmxV21StructureReferencesParser.getReferences(measureDimension[i]),
                        SdmxV21JsonComponentRepresentationParser.getRepresentation(measureDimension[i])))
                
                
            }
        }catch (ex){
        }
        return datastructureComponents;

    };
    
};

module.exports = SdmxV21JsonDsdComponentParser;