var jsonPath = require('jsonpath');
var DataStructureAttributeRelationshipObject = require('sdmx-tck-api').model.DataStructureAttributeRelationshipObject
const ATTRIBUTE_RELATIONSHIP_NAMES = require('sdmx-tck-api').constants.ATTRIBUTE_RELATIONSHIP_NAMES;

class SdmxXmlV30AttributeRelationshipParser {

    static getAttributeRelationship(dsdAtrributeJsonObject) {
        let attributeRelationshipData = [];
        let attributeRelationship = jsonPath.query(dsdAtrributeJsonObject, '$..AttributeRelationship')[0];
        if (attributeRelationship) {
            attributeRelationship = attributeRelationship[0];
        }
        if (attributeRelationship) {
            if (attributeRelationship.Dataflow) {
                attributeRelationshipData.push(
                    new DataStructureAttributeRelationshipObject(
                        ATTRIBUTE_RELATIONSHIP_NAMES.DATAFLOW,
                        undefined
                    )
                )
            } else if (attributeRelationship.Dimension) {
                for (let i in attributeRelationship.Dimension) {
                    if (attributeRelationship.Dimension[i]) {
                        attributeRelationshipData.push(
                            new DataStructureAttributeRelationshipObject(
                                ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION,
                                attributeRelationship.Dimension[i]._
                            )
                        );
                    }
                }
            } else if (attributeRelationship.Group) {
                for (let i in attributeRelationship.Group) {
                    if (attributeRelationship.Group[i]) {
                        attributeRelationshipData.push(
                            new DataStructureAttributeRelationshipObject(
                                ATTRIBUTE_RELATIONSHIP_NAMES.GROUP,
                                attributeRelationship.Group[i]._
                            )
                        );
                    }
                }
            } else if (attributeRelationship.Observation) {
                attributeRelationshipData.push(
                    new DataStructureAttributeRelationshipObject(
                        ATTRIBUTE_RELATIONSHIP_NAMES.OBSERVATION,
                        undefined
                    )
                )
            }
        }
        return attributeRelationshipData;
    }

    static getMeasureRelationship(dsdAtrributeJsonObject) {
        let relationshipData = [];
        let relationship = jsonPath.query(dsdAtrributeJsonObject, '$..MeasureRelationship')[0];
        if (relationship) {
            relationship = relationship[0];
        }
        if (relationship && relationship.Measure) {
            for (let i in relationship.Measure) {
                if (relationship.Measure[i]) {
                    relationshipData.push(
                        new DataStructureAttributeRelationshipObject(
                            ATTRIBUTE_RELATIONSHIP_NAMES.MEASURE,
                            relationship.Measure[i]._
                        )
                    );
                }
            }
        }
        return relationshipData;
    }
}
module.exports = SdmxXmlV30AttributeRelationshipParser;