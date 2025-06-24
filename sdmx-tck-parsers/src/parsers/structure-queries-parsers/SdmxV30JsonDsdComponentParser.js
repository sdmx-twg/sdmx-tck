var jsonPath = require('jsonpath');
var SdmxV30StructureReferencesParser = require('./SdmxV30StructureReferencesParser.js');
var SdmxV21JsonComponentRepresentationParser = require('./SdmxV21JsonComponentRepresentationParser.js')
var DataStructureComponentObject = require('sdmx-tck-api').model.DataStructureComponentObject;
const DSD_COMPONENTS_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_NAMES;
const USAGE_TYPE = require('sdmx-tck-api').constants.USAGE_TYPE;
var SdmxV30JsonDsdAttributeRelationshipParser = require('./SdmxV30JsonDsdAttributeRelationshipParser.js')
var DataStructureAttributeObject = require('sdmx-tck-api').model.DataStructureAttributeObject;
var DataStructureMeasureObject = require('sdmx-tck-api').model.DataStructureMeasureObject;

class SdmxV30JsonDsdComponentParser {
    /**
     * Return an array containing components info about SDMX DSD object.
     * @param {*} sdmxJsonObject 
     */
    static getComponents(sdmxJsonObject) {

        let datastructureComponents = [];
        //Get the DSD dimensions from workspace
        let dimensions = jsonPath.query(sdmxJsonObject, '$..DimensionList..Dimension')[0];
        let timeDimensions = jsonPath.query(sdmxJsonObject, '$..DimensionList..TimeDimension')[0];
        let attributes = jsonPath.query(sdmxJsonObject, '$..AttributeList..Attribute')[0];
        let measures = jsonPath.query(sdmxJsonObject, '$..MeasureList..Measure')[0];

        for (let i in dimensions) {
            let id = (dimensions[i] && dimensions[i].$ && dimensions[i].$.id) ? dimensions[i].$.id : SdmxV30JsonDsdComponentParser.getConceptId(dimensions[i].ConceptIdentity[0]);
            //Push in an array the dimension id and the artefact references of the dimension
            let dimension = new DataStructureComponentObject(
                id,
                DSD_COMPONENTS_NAMES.DIMENSION,
                SdmxV30StructureReferencesParser.getReferences(dimensions[i]),
                SdmxV21JsonComponentRepresentationParser.getRepresentation(dimensions[i]));
            dimension.setPosition(dimensions[i].$.position);

            datastructureComponents.push(dimension);
        }
        for (let i in timeDimensions) {
            let id = (timeDimensions[i] && timeDimensions[i].$ && timeDimensions[i].$.id) ? timeDimensions[i].$.id : SdmxV30JsonDsdComponentParser.getConceptId(timeDimensions[i].ConceptIdentity[0]);
            //Push in an array the timeDimension id and the artefact references of the timeDimension
            datastructureComponents.push(
                new DataStructureComponentObject(
                    id,
                    DSD_COMPONENTS_NAMES.TIME_DIMENSION,
                    SdmxV30StructureReferencesParser.getReferences(timeDimensions[i]),
                    SdmxV21JsonComponentRepresentationParser.getRepresentation(timeDimensions[i])));
        }
        for (let i in attributes) {
            let id = (attributes[i] && attributes[i].$ && attributes[i].$.id) ? attributes[i].$.id : SdmxV30JsonDsdComponentParser.getConceptId(attributes[i].ConceptIdentity[0]);
            let usage = (attributes[i] && attributes[i].$ && attributes[i].$.usage) ? (attributes[i] && attributes[i].$ && attributes[i].$.usage) : USAGE_TYPE.OPTIONAL;
            //Push in an array the attribute id and the artefact references of the attribute
            datastructureComponents.push(
                new DataStructureAttributeObject(
                    id,
                    DSD_COMPONENTS_NAMES.ATTRIBUTE,
                    SdmxV30StructureReferencesParser.getReferences(attributes[i]),
                    SdmxV21JsonComponentRepresentationParser.getRepresentation(attributes[i]),
                    SdmxV30JsonDsdAttributeRelationshipParser.getAttributeRelationship(attributes[i]),
                    USAGE_TYPE.toAssignmentStatus(usage),
                    SdmxV30JsonDsdAttributeRelationshipParser.getMeasureRelationship(attributes[i])
                ));
        }
        for (let i in measures) {
            let id = (measures[i] && measures[i].$ && measures[i].$.id) ? measures[i].$.id : SdmxV30JsonDsdComponentParser.getConceptId(measures[i].ConceptIdentity[0]);
            let usage = (measures[i] && measures[i].$ && measures[i].$.usage) ? (measures[i] && measures[i].$ && measures[i].$.usage) : USAGE_TYPE.OPTIONAL;
            //Push in an array the measure id and the artefact references of the measure
            datastructureComponents.push(
                new DataStructureMeasureObject(
                    id,
                    DSD_COMPONENTS_NAMES.MEASURE,
                    SdmxV30StructureReferencesParser.getReferences(measures[i]),
                    SdmxV21JsonComponentRepresentationParser.getRepresentation(measures[i]),
                    USAGE_TYPE.toAssignmentStatus(usage)));
        }
        return datastructureComponents;
    };

    static getConceptId(conceptIdentity) {
        let conceptId = undefined;
        if (conceptIdentity) {
            let urn = conceptIdentity._;
            let ref = SdmxV30StructureReferencesParser.getStructureReference(urn);
            if (ref) {
                conceptId = ref.identifiableIds[0];
            }
            console.log("Concept id '" + conceptId + "' extracted from component's concept identity.");
        }
        return conceptId;
    }
};
module.exports = SdmxV30JsonDsdComponentParser;