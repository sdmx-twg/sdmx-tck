class DataStructureComponentObject {
    constructor(props,type,references,representation){
        this.id  = props.$.id;
        this.type = type,
        this.references = references;
        this.representation = representation;
    }

    setId(id){
        this.id =id; 
    }
    getId(){
        return this.id;
    }
    setType(type){
        this.type = type;
    }
    getType(){
        return this.type;
    }
    setReferences(references){
        this.references = references
    }
    getReferences(){
        return this.references
    }
    setRepresentation(representation){
        this.representation = representation
    }
    getRepresentation(){
        return this.representation;
    }
}

module.exports = DataStructureComponentObject;