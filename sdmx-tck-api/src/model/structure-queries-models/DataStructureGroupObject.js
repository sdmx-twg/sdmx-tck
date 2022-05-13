class DataStructureGroupObject {

    constructor(props,dimensionReferences) {
        this.id = props.$.id
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