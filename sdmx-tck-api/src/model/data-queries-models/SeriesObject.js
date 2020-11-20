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

    complyWithRequestedKey(reqKey){
        reqKey = reqKey.split(".")
        let attributeValues = Object.values(this.getAttributes());
        for(let i in reqKey){
            if(reqKey[i]!==""){
                if(reqKey[i].indexOf("+")!== -1){
                    let keysWithOr = reqKey[i].split("+")
                    if(!keysWithOr.some(key => key === attributeValues[i])){return false}
                }else{
                    if(reqKey[i] !== attributeValues[i]){return false}
                }
            }             
        }
        return true;
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