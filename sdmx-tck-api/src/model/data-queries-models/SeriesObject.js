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

    hasAttribute(attribute){
        let attributeValues = Object.values(this.getAttributes());
        return attributeValues.some(attr=> attr === attribute)
    }

    hasOneOfTheAttributes(attributesArray){
        let attributeValues = Object.values(this.getAttributes());
        return attributeValues.some(attr=> {
            for(let i in attributesArray){
                if(attr === attributesArray[i]){return true;}
            }
            return false;
        })
    }
    
}

module.exports = SeriesObject;