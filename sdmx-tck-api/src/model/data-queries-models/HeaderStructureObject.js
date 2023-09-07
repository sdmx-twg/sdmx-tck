class HeaderStructureObject {

    constructor(identification,references){
        this.identification = identification;
        this.references = references;
    }

    setIdentification(identification){
        this.identification = identification;
    }
    getIdentification(){
        return this.identification;
    }
    setReferences(references){
        this.references= references
    }
    getReferences(){
        return this.references;
    }
}

module.exports = HeaderStructureObject;