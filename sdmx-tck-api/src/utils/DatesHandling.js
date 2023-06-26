var DateTransformations = require('./DateTransformations.js')

class DatesHandling{

    static isAfterDate(dateUnderValidation,requestedDate){
        if(requestedDate.indexOf("Q")!==-1 || requestedDate.indexOf("S")!==-1 || requestedDate.indexOf("W")!==-1 ){
            if(dateUnderValidation.indexOf("Q")!==-1 || dateUnderValidation.indexOf("S")!==-1 || dateUnderValidation.indexOf("W")!==-1 ){
                return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(requestedDate).from) <=   DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(dateUnderValidation).from)
            }else{
                return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(requestedDate).from) <=  DateTransformations.fromStringToUtcDate(dateUnderValidation);
            }
        }else{
            if(dateUnderValidation.indexOf("Q")!==-1 || dateUnderValidation.indexOf("S")!==-1 || dateUnderValidation.indexOf("W")!==-1 ){
                return DateTransformations.fromStringToUtcDate(requestedDate) <=  DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(dateUnderValidation).from)
            }else{
                return DateTransformations.fromStringToUtcDate(requestedDate) <=  DateTransformations.fromStringToUtcDate(dateUnderValidation);
            }
        }
    }

   static isBeforeDate(dateUnderValidation,requestedDate){
        if(requestedDate.indexOf("Q")!==-1 || requestedDate.indexOf("S")!==-1 || requestedDate.indexOf("W")!==-1 ){
            if(dateUnderValidation.indexOf("Q")!==-1 || dateUnderValidation.indexOf("S")!==-1 || dateUnderValidation.indexOf("W")!==-1 ){
               return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(requestedDate).until) >=   DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(dateUnderValidation).until)

            }else{
               return DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(requestedDate).until) >=  DateTransformations.fromStringToUtcDate(dateUnderValidation);
            }
        }else{
            requestedDate = DateTransformations.getLastDayOfDate(requestedDate)
            if(dateUnderValidation.indexOf("Q")!==-1 || dateUnderValidation.indexOf("S")!==-1 || dateUnderValidation.indexOf("W")!==-1 ){
                return requestedDate >=  DateTransformations.fromStringToUtcDate(DateTransformations.getFullDatePeriod(dateUnderValidation).until)
            }else{
                return requestedDate >=  DateTransformations.fromStringToUtcDate(dateUnderValidation);
            }
        }
    }
}

module.exports = DatesHandling