var DataStructureComponentObject = require('./DataStructureComponentObject.js')
class DataStructureAttributeObject extends DataStructureComponentObject{
    constructor(id,type,references,representation,attributeRelationship,assignmentStatus){

        super(id,type,references,representation)
        this.attributeRelationship = attributeRelationship;
        this.assignmentStatus = assignmentStatus;
    }

    setAssignementStatus(assignmentStatus){
        this.assignmentStatus = assignmentStatus;
    }

    getAssignementStatus(){
        return this.assignmentStatus;
    }
    
    setAttributeRelationship(attributeRelationship){
        this.attributeRelationship = attributeRelationship;
    }

    getAttributeRelationship(){
        return this.attributeRelationship;
    }
}

module.exports = DataStructureAttributeObject;