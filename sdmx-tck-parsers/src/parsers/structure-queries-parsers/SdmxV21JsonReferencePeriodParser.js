var jsonPath = require('jsonpath');
var ConstraintReferencePeriod = require('sdmx-tck-api').model.ConstraintReferencePeriod;
class SdmxV21JsonReferencePeriodParser {

    static getReferencePeriod (sdmxJsonObject){

        let refPeriod = jsonPath.query(sdmxJsonObject, '$..ReferencePeriod')[0];
        if(refPeriod){
            if(refPeriod[0] && refPeriod[0].$){
                return new ConstraintReferencePeriod(refPeriod[0].$.startTime,refPeriod[0].$.endTime)
            }
          
        }
        return;
    }
}

module.exports = SdmxV21JsonReferencePeriodParser;