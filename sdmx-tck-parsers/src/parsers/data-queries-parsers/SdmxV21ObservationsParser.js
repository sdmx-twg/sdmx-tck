var ObservationObject = require('sdmx-tck-api').model.ObservationObject;

class SdmxV21ObservationsParser {

    static getAttributes(sdmxObjects){
        let arrayOfObs = []
        if(sdmxObjects.Obs){
            let observations = sdmxObjects.Obs
            for (let obs in observations){
                if(observations[obs].$){
                    arrayOfObs.push(new ObservationObject(observations[obs].$.OBS_VALUE,
                                                         observations[obs].$.TIME_PERIOD,
                                                        observations[obs].$.UNIT_MULT))
                }
            }
           
        }
        return arrayOfObs;
    }
}
module.exports = SdmxV21ObservationsParser;