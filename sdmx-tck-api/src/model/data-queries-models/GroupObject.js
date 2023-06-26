class GroupObject {

    constructor(id,attributes){
        this.id=id;
        this.attributes = attributes;       
    }
    setId(id){
        this.id = id;
    }
    getId(){
        return this.id;
    }
    setAttributes(attributes){
        this.attributes = attributes;
    }
    getAttributes(){
        return this.attributes;
    }
}

module.exports = GroupObject;