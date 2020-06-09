var DataStructureComponentObject = require('./DataStructureComponentObject.js')
class DataStructureAttributeObject extends DataStructureComponentObject{
    constructor(props,type,references,representation,attributeRelationship){

        super(props,type,references,representation)
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