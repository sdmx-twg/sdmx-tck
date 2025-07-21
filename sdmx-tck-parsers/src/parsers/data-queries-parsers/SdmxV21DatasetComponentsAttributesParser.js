var ObservationObject = require('sdmx-tck-api').model.ObservationObject;

class SdmxV21DatasetComponentsAttributesParser {

    static getComponentAttributes(sdmxObjects) {
        if (sdmxObjects.$) {
            let attributesObj = {
                ...sdmxObjects.$,
                ...SdmxV21DatasetComponentsAttributesParser.getComplexAttributes(sdmxObjects.Comp)
            };
            return attributesObj;
        }
        return;
    }

    static getComplexAttributes(compArray) {
        let complexAttributes = {};
        if (compArray) {
            for (let comp of compArray) {
                let values = comp.Value.map(item => item._).filter(value => value !== undefined);
                if (values.length > 0) {
                    complexAttributes[comp.$.id] = {
                        value: undefined,
                        complexValues: values,
                        multilingualValues: undefined
                    };
                } else {
                    let multilingualValues = {};
                    comp.Value.forEach(value => {
                        value.Text.forEach(textItem => {
                            const lang = textItem.$["xml:lang"];
                            const value = textItem._;
                            multilingualValues[lang] = value;
                        });
                    });
                    if (multilingualValues) {
                        complexAttributes[comp.$.id] = {
                            value: undefined,
                            complexValues: undefined,
                            multilingualValues: multilingualValues
                        };
                    }
                }
            }
        }
        return complexAttributes;
    }

    static getNestedObservationsAttributes(sdmxObjects) {
        let arrayOfObs = []
        if (sdmxObjects.Obs) {
            let observations = sdmxObjects.Obs
            for (let obs in observations) {
                if (observations[obs].$) {
                    let attributesObj = {
                        ...observations[obs].$,
                        ...SdmxV21DatasetComponentsAttributesParser.getComplexAttributes(observations[obs].Comp)
                    }
                    arrayOfObs.push(new ObservationObject(attributesObj))
                }
            }
        }
        return arrayOfObs;
    }
}
module.exports = SdmxV21DatasetComponentsAttributesParser;