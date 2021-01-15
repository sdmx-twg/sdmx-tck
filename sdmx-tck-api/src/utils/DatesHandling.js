var DateTransformations = require('./DateTransformations.js')

class DatesHandling{

    static isAfterDate(dateUnderValidation,requestedDate){
        if(requestedDate.indexOf("Q")!==-1 || requestedDate.indexOf("S")!==-1 || requestedDate.indexOf("W")!==-1 ){
            if(dateUnderValidation.indexOf("Q")!==-1 || dateUnderValidation.indexOf("S")!==-1 || dateUnderValidation.indexOf("W")!==-1 ){
                return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(requestedDate).from) <=   DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(dateUnderValidation).from)

                //return new Date(DateTransformations.getFullDatePeriod(date).from) <=  new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from)
            }else{
                return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(requestedDate).from) <=  DateTransformations.fromStringToUtcDate(dateUnderValidation);
                //return new Date(DateTransformations.getFullDatePeriod(date).from) <=  new Date(this.getAttributes().TIME_PERIOD);
            }
        }else{
            if(dateUnderValidation.indexOf("Q")!==-1 || dateUnderValidation.indexOf("S")!==-1 || dateUnderValidation.indexOf("W")!==-1 ){
                // if(this.getAttributes().TIME_PERIOD === "2002-S1"){
                //     console.log(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from)
                //     console.log(new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from))
                //     console.log(new Date(date))

                // }
                return DateTransformations.fromStringToUtcDate(requestedDate) <=  DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(dateUnderValidation).from)

                //return new Date(date) <=  new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).from)
            }else{
                return DateTransformations.fromStringToUtcDate(requestedDate) <=  DateTransformations.fromStringToUtcDate(dateUnderValidation);
                //return new Date(date) <=  new Date(this.getAttributes().TIME_PERIOD);
            }
        }
    }

   static isBeforeDate(dateUnderValidation,requestedDate){
        if(requestedDate.indexOf("Q")!==-1 || requestedDate.indexOf("S")!==-1 || requestedDate.indexOf("W")!==-1 ){
            if(dateUnderValidation.indexOf("Q")!==-1 || dateUnderValidation.indexOf("S")!==-1 || dateUnderValidation.indexOf("W")!==-1 ){
               // return new Date(DateTransformations.getFullDatePeriod(date).until) >=  new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).until)
               return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(requestedDate).until) >=   DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(dateUnderValidation).until)

            }else{
               // return new Date(DateTransformations.getFullDatePeriod(date).until) >=  new Date(this.getAttributes().TIME_PERIOD);
               return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(requestedDate).until) >=  DateTransformations.fromStringToUtcDate(dateUnderValidation);
            }
        }else{
            requestedDate = DateTransformations.getLastDayOfDate(requestedDate)
            if(dateUnderValidation.indexOf("Q")!==-1 || dateUnderValidation.indexOf("S")!==-1 || dateUnderValidation.indexOf("W")!==-1 ){
                //return date >=  new Date(DateTransformations.getFullDatePeriod(this.getAttributes().TIME_PERIOD).until)
                return requestedDate >=  DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(dateUnderValidation).until)
            }else{
                //return date >=  new Date(this.getAttributes().TIME_PERIOD);
                return requestedDate >=  DateTransformations.fromStringToUtcDate(dateUnderValidation);
            }
        }
    }
}

module.exports = DatesHandling