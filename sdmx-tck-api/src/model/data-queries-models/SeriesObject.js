const { model } = require("../..");

class SeriesObject {

    constructor(attributes,observations){
        this.attributes = attributes;
        this.observations = observations;
    }

    setAttributes(attributes){
        this.attributes = attributes;
    }
    getAttributes(){
        return this.attributes;
    }
    setObservations(observations){
        this.observations= observations
    }
    getObservations(){
        return this.observations;
    }
}

module.exports = SeriesObject;