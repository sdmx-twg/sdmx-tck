class DataStructureGroupObject {

    constructor(groupId,dimensionReferences) {
        this.id = groupId;
        this.dimensionReferences = dimensionReferences;
    };

    setId(id){
        this.id = id;
    }
    getId(){
        return this.id
    }

    setDimensionReferences(dimensionReferences){
        this.dimensionReferences=dimensionReferences
    }
    getDimensionReferences(){
        return this.dimensionReferences;
    }
}
module.exports = DataStructureGroupObject;