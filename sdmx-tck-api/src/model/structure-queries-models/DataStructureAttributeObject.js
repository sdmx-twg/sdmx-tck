var DataStructureComponentObject = require('./DataStructureComponentObject.js')
class DataStructureAttributeObject extends DataStructureComponentObject{
    constructor(id,type,references,representation,attributeRelationship){

        super(id,type,references,representation)
        this.attributeRelationship = attributeRelationship;
    }

    setAttributeRelationship(attributeRelationship){
        this.attributeRelationship = attributeRelationship;
    }

    getAttributeRelationship(){
        return this.attributeRelationship;
    }
}

module.exports = DataStructureAttributeObject;