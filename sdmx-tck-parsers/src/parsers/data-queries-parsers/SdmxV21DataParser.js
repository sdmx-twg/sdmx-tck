const DATA_COMPONENTS_TYPES = require('sdmx-tck-api').constants.DATA_COMPONENTS_TYPES;
var SdmxV21DataHeaderParser = require('./SdmxV21DataHeaderParser.js')
var SdmxV21DatasetComponentsAttributesParser = require('./SdmxV21DatasetComponentsAttributesParser.js')
var SeriesObject = require('sdmx-tck-api').model.SeriesObject;
var GroupObject = require('sdmx-tck-api').model.GroupObject;
var ObservationObject = require('sdmx-tck-api').model.ObservationObject;

class SdmxV21DataParser{
    static parseData(sdmxJsonObjects) {
       
        if (sdmxJsonObjects === null || sdmxJsonObjects === undefined) {
            throw new Error("Missing mandatory parameter.");
        }
        let dataComponents = new Map();

        if (sdmxJsonObjects && sdmxJsonObjects.StructureSpecificData) {
            let s = sdmxJsonObjects.StructureSpecificData;

            SdmxV21DataParser.parseHeader(dataComponents,s);
            SdmxV21DataParser.parseDataset(dataComponents,s)
        }
        return dataComponents;
    };

    static parseHeader(dataComponents,s){

        if(s.Header){
            let header = s.Header[0];
            let dataComponentType = DATA_COMPONENTS_TYPES.STRUCTURE_ID

            dataComponents.set(dataComponentType,SdmxV21DataHeaderParser.getStructureId(header));
        }
    }
    static parseDataset(dataComponents,s){
        let dataComponentType = DATA_COMPONENTS_TYPES.DATASET
        dataComponents.set(dataComponentType,[]);
        if(s.DataSet){
            if(s.DataSet[0].Series){
                let series = s.DataSet[0].Series;
                for (let s in series){
                    dataComponents.get(dataComponentType).push(new SeriesObject (
                        SdmxV21DatasetComponentsAttributesParser.getComponentAttributes(series[s]),
                        SdmxV21DatasetComponentsAttributesParser.getNestedObservationsAttributes(series[s]))
                        );
                }
            }
            if(s.DataSet[0].Group){
                let groups = s.DataSet[0].Group;
                for(let g in groups){
                    dataComponents.get(dataComponentType).push(new GroupObject (
                        SdmxV21DatasetComponentsAttributesParser.getComponentAttributes(groups[g]))
                        );
                }
            }

            if(s.DataSet[0].Obs){
                let obs = s.DataSet[0].Obs;
                for(let o in obs){
                    dataComponents.get(dataComponentType).push(new ObservationObject (
                        SdmxV21DatasetComponentsAttributesParser.getComponentAttributes(obs[o]))
                        );
                }
            }
        }
    }
}

module.exports = SdmxV21DataParser;