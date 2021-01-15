var DatesHandling = require('../../utils/DatesHandling.js')

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

    equals(obsObj){
        if(!obsObj instanceof ObservationObject){return false}

        let equalsKeys = Object.keys(this.getAttributes()).every(key=>{
            return Object.keys(obsObj.getAttributes()).indexOf(key) !== -1;
        })
        let equalsValues = Object.values(this.getAttributes()).every(value=>{
            return Object.values(obsObj.getAttributes()).indexOf(value) !== -1;
        })

        if(!equalsKeys||!equalsValues){return false;}
        return true;
    }

    isAfterDate(date){
        return DatesHandling.isAfterDate(this.getAttributes().TIME_PERIOD,date)
    }

    isBeforeDate(date){
        return DatesHandling.isBeforeDate(this.getAttributes().TIME_PERIOD,date)
    }
}

module.exports = ObservationObject;