const ObservationObject = require('../data-queries-models/ObservationObject.js');


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

    equals(seriesObject){
        if(!seriesObject instanceof SeriesObject){return false}
        let equalsKeys = Object.keys(this.getAttributes()).every(key=>{
            return Object.keys(seriesObject.getAttributes()).indexOf(key) !== -1;
        })
        let equalsValues = Object.values(this.getAttributes()).every(value=>{
            return Object.values(seriesObject.getAttributes()).indexOf(value) !== -1;
        })

        if(!equalsKeys||!equalsValues){return false;}
        return true;

    }

    getObservationsBetweenPeriod(startPeriod,endPeriod){
        if(!startPeriod && !endPeriod){return this.getObservations()}
        let observationsBetweenPeriod = this.getObservations().filter(obs=>{
            if(startPeriod && !endPeriod){
                return obs.isAfterDate(startPeriod)
            }else if(!startPeriod && endPeriod){
                return obs.isBeforeDate(endPeriod)
            }else if (startPeriod && endPeriod){
                return obs.isAfterDate(startPeriod) && obs.isBeforeDate(endPeriod)
            }
            
        })
        return observationsBetweenPeriod
    }

    static fromJson(seriesJson){
        if(!seriesJson || !seriesJson.attributes || !seriesJson.observations){
            throw new Error("Cannot create Series object.")
        }
        let seriesObsArray = [];
        seriesJson.observations.forEach(obs =>{
            seriesObsArray.push(ObservationObject.fromJson(obs))
        })
        
        return new SeriesObject(seriesJson.attributes,seriesObsArray)
    }
    
}

module.exports = SeriesObject;