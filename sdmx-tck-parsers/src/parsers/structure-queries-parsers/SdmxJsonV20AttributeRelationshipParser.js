var DataStructureAttributeRelationshipObject = require('sdmx-tck-api').model.DataStructureAttributeRelationshipObject
const ATTRIBUTE_RELATIONSHIP_NAMES = require('sdmx-tck-api').constants.ATTRIBUTE_RELATIONSHIP_NAMES;

class SdmxJsonV20AttributeRelationshipParser {

    static getAttributeRelationship(atrributeJsonObject) {
        let attributeRelationshipData = [];
        let attributeRelationship = atrributeJsonObject.attributeRelationship;
        if (attributeRelationship) {
            if (attributeRelationship.dataflow) {
                attributeRelationshipData.push(
                    new DataStructureAttributeRelationshipObject(
                        ATTRIBUTE_RELATIONSHIP_NAMES.DATAFLOW,
                        undefined
                    )
                )
            } else if (attributeRelationship.dimensions) {
                for (let dimension of attributeRelationship.dimensions) {
                    attributeRelationshipData.push(
                        new DataStructureAttributeRelationshipObject(
                            ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION,
                            dimension
                        )
                    );
                }
            } else if (attributeRelationship.group) {
                attributeRelationshipData.push(
                    new DataStructureAttributeRelationshipObject(
                        ATTRIBUTE_RELATIONSHIP_NAMES.GROUP,
                        group
                    )
                );
            } else if (attributeRelationship.observation) {
                attributeRelationshipData.push(
                    new DataStructureAttributeRelationshipObject(
                        ATTRIBUTE_RELATIONSHIP_NAMES.OBSERVATION,
                        undefined
                    )
                );
            }
        }
        return attributeRelationshipData;
    }

    static getMeasureRelationship(atrributeJsonObject) {
        let relationshipData = [];
        let measures = atrributeJsonObject.measureRelationship;
        if (measures) {
            for (let measure of measures) {
                relationshipData.push(
                    new DataStructureAttributeRelationshipObject(
                        ATTRIBUTE_RELATIONSHIP_NAMES.MEASURE,
                        measure
                    )
                );
            }
        }
        return relationshipData;
    }
}
module.exports = SdmxJsonV20AttributeRelationshipParser;