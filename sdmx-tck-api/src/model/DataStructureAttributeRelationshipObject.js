class DataStructureAttributeRelationshipObject{
    constructor(relationshipType,ids){

        this.relationshipType = relationshipType;
        this.ids = ids;
    }

   setRelationshipType(relationshipType){
       this.relationshipType = relationshipType
   }
   getRelationshipType(){
       return this.relationshipType
   }

   setIds(ids){
       this.id = ids;
   }
   getId(){
       return this.ids;
   }
}

module.exports = DataStructureAttributeRelationshipObject;