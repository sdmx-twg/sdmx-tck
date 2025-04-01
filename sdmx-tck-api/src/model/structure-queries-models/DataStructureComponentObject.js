class DataStructureComponentObject {
<<<<<<< HEAD
    constructor(id,type,references,representation){
        this.id  = id;
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
=======
    constructor(id, type, references, representation) {
        this.id = id;
        this.type = type;
        this.references = references;
        this.representation = representation;
    }
    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }
    setType(type) {
        this.type = type;
    }
    getType() {
        return this.type;
    }
    setPosition(position) {
        this.position = position;
    }
    getPosition() {
        return this.position;
    }
    setReferences(references) {
        this.references = references
    }
    getReferences() {
        return this.references
    }
    setRepresentation(representation) {
        this.representation = representation
    }
    getRepresentation() {
>>>>>>> v4.8.0
        return this.representation;
    }
}

module.exports = DataStructureComponentObject;