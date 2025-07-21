var jsonPath = require('jsonpath');
var SdmxXmlV30StructureReferencesParser = require('./SdmxXmlV30StructureReferencesParser.js');
var SdmxXmlRepresentationParser = require('./SdmxXmlRepresentationParser.js')
var DataStructureComponentObject = require('sdmx-tck-api').model.DataStructureComponentObject;
const DSD_COMPONENTS_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_NAMES;
const USAGE_TYPE = require('sdmx-tck-api').constants.USAGE_TYPE;
var SdmxXmlV30AttributeRelationshipParser = require('./SdmxXmlV30AttributeRelationshipParser.js');
const UrnUtil = require('sdmx-tck-api').utils.UrnUtil;
var DataStructureAttributeObject = require('sdmx-tck-api').model.DataStructureAttributeObject;
var DataStructureMeasureObject = require('sdmx-tck-api').model.DataStructureMeasureObject;

class SdmxXmlV30DsdComponentParser {
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
            let id = (dimensions[i] && dimensions[i].$ && dimensions[i].$.id) ? dimensions[i].$.id : SdmxXmlV30DsdComponentParser.getConceptId(dimensions[i].ConceptIdentity[0]);
            //Push in an array the dimension id and the artefact references of the dimension
            let dimension = new DataStructureComponentObject(
                id,
                DSD_COMPONENTS_NAMES.DIMENSION,
                SdmxXmlV30StructureReferencesParser.getReferences(dimensions[i]),
                SdmxXmlRepresentationParser.getRepresentation(dimensions[i]));
            dimension.setPosition(dimensions[i].$.position);

            datastructureComponents.push(dimension);
        }
        for (let i in timeDimensions) {
            let id = (timeDimensions[i] && timeDimensions[i].$ && timeDimensions[i].$.id) ? timeDimensions[i].$.id : SdmxXmlV30DsdComponentParser.getConceptId(timeDimensions[i].ConceptIdentity[0]);
            //Push in an array the timeDimension id and the artefact references of the timeDimension
            datastructureComponents.push(
                new DataStructureComponentObject(
                    id,
                    DSD_COMPONENTS_NAMES.TIME_DIMENSION,
                    SdmxXmlV30StructureReferencesParser.getReferences(timeDimensions[i]),
                    SdmxXmlRepresentationParser.getRepresentation(timeDimensions[i])));
        }
        for (let i in attributes) {
            let id = (attributes[i] && attributes[i].$ && attributes[i].$.id) ? attributes[i].$.id : SdmxXmlV30DsdComponentParser.getConceptId(attributes[i].ConceptIdentity[0]);
            let usage = (attributes[i] && attributes[i].$ && attributes[i].$.usage) ? (attributes[i] && attributes[i].$ && attributes[i].$.usage) : USAGE_TYPE.OPTIONAL;
            //Push in an array the attribute id and the artefact references of the attribute
            datastructureComponents.push(
                new DataStructureAttributeObject(
                    id,
                    DSD_COMPONENTS_NAMES.ATTRIBUTE,
                    SdmxXmlV30StructureReferencesParser.getReferences(attributes[i]),
                    SdmxXmlRepresentationParser.getRepresentation(attributes[i]),
                    SdmxXmlV30AttributeRelationshipParser.getAttributeRelationship(attributes[i]),
                    USAGE_TYPE.toAssignmentStatus(usage),
                    SdmxXmlV30AttributeRelationshipParser.getMeasureRelationship(attributes[i])
                ));
        }
        for (let i in measures) {
            let id = (measures[i] && measures[i].$ && measures[i].$.id) ? measures[i].$.id : SdmxXmlV30DsdComponentParser.getConceptId(measures[i].ConceptIdentity[0]);
            let usage = (measures[i] && measures[i].$ && measures[i].$.usage) ? (measures[i] && measures[i].$ && measures[i].$.usage) : USAGE_TYPE.OPTIONAL;
            //Push in an array the measure id and the artefact references of the measure
            datastructureComponents.push(
                new DataStructureMeasureObject(
                    id,
                    DSD_COMPONENTS_NAMES.MEASURE,
                    SdmxXmlV30StructureReferencesParser.getReferences(measures[i]),
                    SdmxXmlRepresentationParser.getRepresentation(measures[i]),
                    USAGE_TYPE.toAssignmentStatus(usage)));
        }
        return datastructureComponents;
    };

    static getConceptId(conceptIdentity) {
        let conceptId = undefined;
        if (conceptIdentity) {
            let urn = conceptIdentity._;
            let ref = UrnUtil.getStructureReference(urn);
            if (ref) {
                conceptId = ref.identifiableIds[0];
            }
            console.log("Concept id '" + conceptId + "' extracted from component's concept identity.");
        }
        return conceptId;
    }
};
module.exports = SdmxXmlV30DsdComponentParser;