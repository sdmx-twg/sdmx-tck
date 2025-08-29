class ItemObject {
    constructor(id,references,representation,parentCode){
        this.id  = id;
        this.references = references;
        this.representation = representation;
        this.parentCode = parentCode;
    }
    setId(id){
        this.id =id; 
    }
    getId(){
        return this.id;
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
    setParentCode(parentCode){
        this.parentCode = parentCode
    }
    getParentCode(){
        return this.parentCode;
    }
    hasParent() {
        return !!this.parentCode;
    }
}

module.exports = ItemObject;