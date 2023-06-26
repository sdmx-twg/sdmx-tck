class DataStructureAttributeRelationshipObject{
    constructor(relationshipType,id){

        this.relationshipType = relationshipType;
        this.id = id;
    }

   setRelationshipType(relationshipType){
       this.relationshipType = relationshipType
   }
   getRelationshipType(){
       return this.relationshipType
   }

   setId(id){
       this.id = id;
   }
   getId(){
       return this.id;
   }
}

module.exports = DataStructureAttributeRelationshipObject;