var jsonPath = require('jsonpath');
var DataStructureAttributeRelationshipObject = require('sdmx-tck-api').model.DataStructureAttributeRelationshipObject

class SdmxV21JsonDsdAttributeRelationshipParser {

    static getAttributeRelationship (dsdAtrributeJsonObject){
        let attributeRelationshipData = []
        let listOfIds = [];
        let attributeRelationship = jsonPath.query(dsdAtrributeJsonObject, '$..AttributeRelationship')[0];
        attributeRelationship = attributeRelationship[0]
        if(attributeRelationship){
            if(attributeRelationship.Dimension){
                for (let i in attributeRelationship.Dimension) {
                    listOfIds=[]
                    if(attributeRelationship.Dimension[i].Ref){
                        for (let j in attributeRelationship.Dimension[i].Ref) {
                            listOfIds.push(attributeRelationship.Dimension[i].Ref[j].$.id)
                        }
                    }
                    attributeRelationshipData.push(new DataStructureAttributeRelationshipObject("Dimension",listOfIds))
                }
            }
            if(attributeRelationship.AttachmentGroup){
                for (let i in attributeRelationship.AttachmentGroup) {
                    listOfIds=[]
                    if(attributeRelationship.AttachmentGroup[i].Ref){
                        for (let j in attributeRelationship.AttachmentGroup[i].Ref) {
                            listOfIds.push(attributeRelationship.AttachmentGroup[i].Ref[j].$.id)
                        }
                    }
                    attributeRelationshipData.push(new DataStructureAttributeRelationshipObject("AttachmentGroup",listOfIds))
                }
            }
            if(attributeRelationship.PrimaryMeasure){
                for (let i in attributeRelationship.PrimaryMeasure) {
                    listOfIds=[]
                    if(attributeRelationship.PrimaryMeasure[i].Ref){
                        for (let j in attributeRelationship.PrimaryMeasure[i].Ref) {
                            listOfIds.push(attributeRelationship.PrimaryMeasure[i].Ref[j].$.id)
                        }
                    }
                    attributeRelationshipData.push(new DataStructureAttributeRelationshipObject("PrimaryMeasure",listOfIds))
                }
            }
            if(attributeRelationship.Group){
                for (let i in attributeRelationship.Group) {
                    listOfIds=[]
                    if(attributeRelationship.Group[i].Ref){
                        for (let j in attributeRelationship.Group[i].Ref) {
                            listOfIds.push(attributeRelationship.Group[i].Ref[j].$.id)
                        }
                    }
                    attributeRelationshipData.push(new DataStructureAttributeRelationshipObject("Group",listOfIds))
                }
            }
            if(attributeRelationship.None){
                for (let i in attributeRelationship.None) {
                    listOfIds=[]
                    if(attributeRelationship.None[i].Ref){
                        for (let j in attributeRelationship.None[i].Ref) {
                            listOfIds.push(attributeRelationship.None[i].Ref[j].$.id)
                        }
                    }
                    attributeRelationshipData.push(new DataStructureAttributeRelationshipObject("None",listOfIds))
                }
            }
            
            
        }
        return attributeRelationshipData
    }
}

module.exports = SdmxV21JsonDsdAttributeRelationshipParser;