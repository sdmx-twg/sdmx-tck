class ObservationObject {

    constructor(attributes){
        this.attributes = attributes;       
    }
    setAttributes(attributes){
        this.attributes = attributes;
    }
    getAttributes(){
        return this.attributes;
    }
}

module.exports = ObservationObject;