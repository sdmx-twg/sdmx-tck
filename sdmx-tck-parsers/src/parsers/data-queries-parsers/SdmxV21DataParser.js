const DATA_COMPONENTS_TYPES = require('sdmx-tck-api').constants.DATA_COMPONENTS_TYPES;
var SdmxV21DataHeaderParser = require('./SdmxV21DataHeaderParser.js')
var SdmxV21DatasetParser = require('.//SdmxV21DatasetParser.js')
var SdmxDataObjects = require('sdmx-tck-api').model.SdmxDataObjects;

class SdmxV21DataParser{
    static parseMessage(sdmxJsonObjects) {
       
        if (sdmxJsonObjects === null || sdmxJsonObjects === undefined) {
            throw new Error("Missing mandatory parameter.");
        }
        let dataComponents = new Map();

        if (sdmxJsonObjects && sdmxJsonObjects.StructureSpecificData) {
            let s = sdmxJsonObjects.StructureSpecificData;

            SdmxV21DataParser.parseHeader(dataComponents,s);
            SdmxV21DataParser.parseDatasets(dataComponents,s)
        }
        return new SdmxDataObjects(dataComponents);
    };

    static parseHeader(dataComponents,s){

        if(s.Header){
            let header = s.Header[0];

            let dataComponentType = DATA_COMPONENTS_TYPES.STRUCTURE_DATA
            dataComponents.set(dataComponentType,SdmxV21DataHeaderParser.getStructureData(header));
        }
    }
    static parseDatasets(dataComponents,s){
        let dataComponentType = DATA_COMPONENTS_TYPES.DATASETS
        dataComponents.set(dataComponentType,[]);
        if(s.DataSet){
            s.DataSet.forEach(dataset => {
                dataComponents.get(dataComponentType).push(SdmxV21DatasetParser.getDataset(dataset, s.Header[0]))
            });

        }
    }
}

module.exports = SdmxV21DataParser;