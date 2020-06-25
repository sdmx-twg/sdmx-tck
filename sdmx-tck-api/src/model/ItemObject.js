class ItemObject {
    constructor(id,references,representation,urn){
        this.id  = id;
        this.references = references;
        this.representation = representation;
        this.urn = urn
    }

    setId(id){
        this.id =id; 
    }
    getId(){
        return this.id;
    }
    setUrn(urn){
        this.urn = urn;
    }
    getUrn(){
        return this.urn;
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

module.exports = ItemObject;