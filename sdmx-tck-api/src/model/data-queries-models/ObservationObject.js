var DateTransformations = require('../../utils/DateTransformations.js')
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
        if(date.indexOf("Q")!==-1 || date.indexOf("S")!==-1 || date.indexOf("W")!==-1 ){
            if(this.getAttributes().TIME_PERIOD.indexOf("Q")!==-1 || this.getAttributes().TIME_PERIOD.indexOf("S")!==-1 || this.getAttributes().TIME_PERIOD.indexOf("W")!==-1 ){
                return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(date).from) <=   DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from)

                //return new Date(DateTransformations.getFullDatePeriod(date).from) <=  new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from)
            }else{
                return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(date).from) <=  DateTransformations.fromStringToUtcDate(this.getAttributes().TIME_PERIOD);
                //return new Date(DateTransformations.getFullDatePeriod(date).from) <=  new Date(this.getAttributes().TIME_PERIOD);
            }
        }else{
            if(this.getAttributes().TIME_PERIOD.indexOf("Q")!==-1 || this.getAttributes().TIME_PERIOD.indexOf("S")!==-1 || this.getAttributes().TIME_PERIOD.indexOf("W")!==-1 ){
                // if(this.getAttributes().TIME_PERIOD === "2002-S1"){
                //     console.log(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from)
                //     console.log(new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from))
                //     console.log(new Date(date))

                // }
                return DateTransformations.fromStringToUtcDate(date) <=  DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from)

                //return new Date(date) <=  new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from)
            }else{
                return DateTransformations.fromStringToUtcDate(date) <=  DateTransformations.fromStringToUtcDate(this.getAttributes().TIME_PERIOD);
                //return new Date(date) <=  new Date(this.getAttributes().TIME_PERIOD);
            }
        }
    }

    isBeforeDate(date){
        if(date.indexOf("Q")!==-1 || date.indexOf("S")!==-1 || date.indexOf("W")!==-1 ){
            if(this.getAttributes().TIME_PERIOD.indexOf("Q")!==-1 || this.getAttributes().TIME_PERIOD.indexOf("S")!==-1 || this.getAttributes().TIME_PERIOD.indexOf("W")!==-1 ){
                return new Date(DateTransformations.getFullDatePeriod(date).until) >=  new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).until)
            }else{
                return new Date(DateTransformations.getFullDatePeriod(date).until) >=  new Date(this.getAttributes().TIME_PERIOD);
            }
        }else{
            date = DateTransformations.getLastDayOfDate(date)
            if(this.getAttributes().TIME_PERIOD.indexOf("Q")!==-1 || this.getAttributes().TIME_PERIOD.indexOf("S")!==-1 || this.getAttributes().TIME_PERIOD.indexOf("W")!==-1 ){
                return date >=  new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).until)
            }else{
                return date >=  new Date(this.getAttributes().TIME_PERIOD);
            }
        }
    }
}

module.exports = ObservationObject;