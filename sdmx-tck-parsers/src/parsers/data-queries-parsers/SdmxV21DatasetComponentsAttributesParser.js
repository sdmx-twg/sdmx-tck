var ObservationObject = require('sdmx-tck-api').model.ObservationObject;

class SdmxV21DatasetComponentsAttributesParser {

    static getComponentAttributes(sdmxObjects){
        if(sdmxObjects.$){
            let attributesObj = sdmxObjects.$
            return attributesObj;
        }
        return;
    }

    static getNestedObservationsAttributes(sdmxObjects){
        let arrayOfObs = []
        if(sdmxObjects.Obs){
            let observations = sdmxObjects.Obs
            for (let obs in observations){
                if(observations[obs].$){
                    arrayOfObs.push(new ObservationObject(observations[obs].$))
                }
            }
           
        }
        return arrayOfObs;
    }
}
module.exports = SdmxV21DatasetComponentsAttributesParser;