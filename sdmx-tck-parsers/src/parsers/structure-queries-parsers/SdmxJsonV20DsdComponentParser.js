var DSD_COMPONENTS_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_NAMES;
var USAGE_TYPE = require('sdmx-tck-api').constants.USAGE_TYPE;
var UrnUtil = require('sdmx-tck-api').utils.UrnUtil;
var SdmxJsonV20StructureReferencesParser = require('./SdmxJsonV20StructureReferencesParser.js');
var SdmxJsonV20RepresentationParser = require('./SdmxJsonV20RepresentationParser.js');
var SdmxJsonV20AttributeRelationshipParser = require('./SdmxJsonV20AttributeRelationshipParser.js');
var DataStructureComponentObject = require('sdmx-tck-api').model.DataStructureComponentObject;
var DataStructureAttributeObject = require('sdmx-tck-api').model.DataStructureAttributeObject;
var DataStructureMeasureObject = require('sdmx-tck-api').model.DataStructureMeasureObject;

class SdmxJsonV20DsdComponentParser {
    /**
     * Return an array containing components info about SDMX DSD object.
     * @param {*} sdmxJsonObject 
     */
    static getComponents(sdmxJsonObject) {
        let datastructureComponents = [];
        //Get the DSD dimensions from workspace
        let components = sdmxJsonObject.dataStructureComponents;
        if (components) {
            let dimensionList = components.dimensionList;
            if (dimensionList && dimensionList.dimensions) {
                let dimensions = dimensionList.dimensions;
                for (let dim of dimensions) {
                    let id = dim.id ? dim.id : SdmxJsonV20DsdComponentParser.getConceptId(dim.conceptIdentity);
                    //Push in an array the dimension id and the artefact references of the dimension
                    let dimension = new DataStructureComponentObject(
                        id,
                        DSD_COMPONENTS_NAMES.DIMENSION,
                        SdmxJsonV20StructureReferencesParser.getComponentRefs(dim),
                        SdmxJsonV20RepresentationParser.getRepresentation(dim)
                    );
                    dimension.setPosition(dim.position);
                    datastructureComponents.push(dimension);
                }
            }
            if (dimensionList && dimensionList.timeDimension) {
                let timeDim = dimensionList.timeDimension;
                let id = timeDim.id ? timeDim.id : SdmxJsonV20DsdComponentParser.getConceptId(timeDim.conceptIdentity);
                //Push in an array the timeDimension id and the artefact references of the timeDimension
                datastructureComponents.push(
                    new DataStructureComponentObject(
                        id,
                        DSD_COMPONENTS_NAMES.TIME_DIMENSION,
                        SdmxJsonV20StructureReferencesParser.getComponentRefs(timeDim),
                        SdmxJsonV20RepresentationParser.getRepresentation(timeDim)
                    ));
            }
            
            let attributeList = components.attributeList;
            if (attributeList && attributeList.attributes) {
                let attributes = attributeList.attributes;
                for (let attr of attributes) {
                    let id = attr.id ? attr.id : SdmxJsonV20DsdComponentParser.getConceptId(attr.conceptIdentity);
                    let usage = attr.usage ? attr.usage : USAGE_TYPE.OPTIONAL;
                    //Push in an array the attribute id and the artefact references of the attribute
                    datastructureComponents.push(
                        new DataStructureAttributeObject(
                            id,
                            DSD_COMPONENTS_NAMES.ATTRIBUTE,
                            SdmxJsonV20StructureReferencesParser.getComponentRefs(attr),
                            SdmxJsonV20RepresentationParser.getRepresentation(attr),
                            SdmxJsonV20AttributeRelationshipParser.getAttributeRelationship(attr),
                            USAGE_TYPE.toAssignmentStatus(usage),
                            SdmxJsonV20AttributeRelationshipParser.getMeasureRelationship(attr)
                        ));
                }
            }
            let measureList = components.measureList;
            if (measureList && measureList.measures) {
                let measures = measureList.measures;
                for (let mes of measures) {
                    let id = mes.id ? mes.id : SdmxJsonV20DsdComponentParser.getConceptId(mes.conceptIdentity);
                    let usage = mes.usage ? mes.usage : USAGE_TYPE.OPTIONAL;
                    //Push in an array the measure id and the artefact references of the measure
                    datastructureComponents.push(
                        new DataStructureMeasureObject(
                            id,
                            DSD_COMPONENTS_NAMES.MEASURE,
                            SdmxJsonV20StructureReferencesParser.getComponentRefs(mes),
                            SdmxJsonV20RepresentationParser.getRepresentation(mes),
                            USAGE_TYPE.toAssignmentStatus(usage)));
                }
            }
        }
        return datastructureComponents;
    };

    static getConceptId(conceptIdentity) {
        let conceptId = undefined;
        let ref = UrnUtil.getStructureReference(conceptIdentity);
        if (ref) {
            conceptId = ref.identifiableIds[0];
        }
        console.log("Concept id '" + conceptId + "' extracted from component's concept identity.");
        return conceptId;
    }
};
module.exports = SdmxJsonV20DsdComponentParser;