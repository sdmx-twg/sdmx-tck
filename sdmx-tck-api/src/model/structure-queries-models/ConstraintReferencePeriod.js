var DatesHandling = require('../../utils/DatesHandling.js')

class ConstraintReferencePeriod {
    constructor(startTime,endTime){
        this.startTime = startTime;
        this.endTime = endTime;
    }

    setStartTime(startTime){
        this.startTime = startTime
    }
    getStartTime(){
        return this.startTime
    }
    setEndTime(endTime){
        this.endTime = endTime;
    }
    getEndTime(){
        return this.endTime;
    }

    isAfterDate(date){
        return DatesHandling.isAfterDate(this.startTime,date)
    }

    isBeforeDate(date){
        return DatesHandling.isBeforeDate(this.endTime,date)
    }
}

module.exports = ConstraintReferencePeriod;