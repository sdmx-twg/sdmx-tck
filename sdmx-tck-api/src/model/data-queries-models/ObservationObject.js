class ObservationObject {

    constructor(obsValue,timePeriod,unitMult){
        this.obsValue = obsValue;
        this.timePeriod = timePeriod;
        this.unitMult = unitMult
    }

    setObsValue(obsValue){
        this.obsValue = obsValue;
    }
    getObsValue(){
        return this.obsValue;
    }
    setTimePeriod(timePeriod){
        this.timePeriod= timePeriod
    }
    getTimePeriod(){
        return this.timePeriod;
    }
    setUnitMult(unitMult){
        this.unitMult = unitMult;
    }
    getUnitMult(){
        return this.unitMult
    }
}

module.exports = ObservationObject;