var jsonPath = require('jsonpath');
var DataStructureAttributeRelationshipObject = require('sdmx-tck-api').model.DataStructureAttributeRelationshipObject
const ATTRIBUTE_RELATIONSHIP_NAMES=require('sdmx-tck-api').constants.ATTRIBUTE_RELATIONSHIP_NAMES;

class SdmxV21JsonDsdAttributeRelationshipParser {

    static getAttributeRelationship (dsdAtrributeJsonObject){
        let attributeRelationshipData = []
        let attributeRelationship = jsonPath.query(dsdAtrributeJsonObject, '$..AttributeRelationship')[0];
        attributeRelationship = attributeRelationship[0]
        if(attributeRelationship){
            if(attributeRelationship.Dimension){
                for (let i in attributeRelationship.Dimension) {
                    if(attributeRelationship.Dimension[i].Ref){
                        attributeRelationshipData.push(new DataStructureAttributeRelationshipObject(ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION,attributeRelationship.Dimension[i].Ref[0].$.id))
                    }
                }
            }
            if(attributeRelationship.AttachmentGroup){
                for (let i in attributeRelationship.AttachmentGroup) {
                    if(attributeRelationship.AttachmentGroup[i].Ref){
                        attributeRelationshipData.push(new DataStructureAttributeRelationshipObject(ATTRIBUTE_RELATIONSHIP_NAMES.ATTACHMENT_GROUP,attributeRelationship.AttachmentGroup[i].Ref[0].$.id))

                    }
                }
            }
            if(attributeRelationship.PrimaryMeasure){
                for (let i in attributeRelationship.PrimaryMeasure) {
                    if(attributeRelationship.PrimaryMeasure[i].Ref){
                        attributeRelationshipData.push(new DataStructureAttributeRelationshipObject(ATTRIBUTE_RELATIONSHIP_NAMES.PRIMARY_MEASURE,attributeRelationship.PrimaryMeasure[i].Ref[0].$.id))
                    }
                }
            }
            if(attributeRelationship.Group){
                for (let i in attributeRelationship.Group) {
                    if(attributeRelationship.Group[i].Ref){
                        attributeRelationshipData.push(new DataStructureAttributeRelationshipObject(ATTRIBUTE_RELATIONSHIP_NAMES.GROUP,attributeRelationship.Group[i].Ref[0].$.id))
                    }
                }
            }
            if(attributeRelationship.None){
                attributeRelationshipData.push(new DataStructureAttributeRelationshipObject(ATTRIBUTE_RELATIONSHIP_NAMES.NONE,undefined))
            }
            
            
        }
        return attributeRelationshipData
    }
}

module.exports = SdmxV21JsonDsdAttributeRelationshipParser;