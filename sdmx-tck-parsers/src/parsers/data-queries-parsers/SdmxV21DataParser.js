const DATA_COMPONENTS_TYPES = require('sdmx-tck-api').constants.DATA_COMPONENTS_TYPES;
var SdmxV21DataHeaderParser = require('./SdmxV21DataHeaderParser.js')
var SdmxV21SeriesAttributesParser = require('./SdmxV21SeriesAttributesParser.js')
var SdmxV21ObservationsParser = require('./SdmxV21ObservationsParser.js')
var SeriesObject = require('sdmx-tck-api').model.SeriesObject;
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
        if(s.DataSet && s.DataSet[0].Series){
            let dataSet = s.DataSet[0].Series;
            let dataComponentType = DATA_COMPONENTS_TYPES.DATASET
            dataComponents.set(dataComponentType,[]);
            for (let ds in dataSet){
                dataComponents.get(dataComponentType).push(new SeriesObject (SdmxV21SeriesAttributesParser.getAttributes(dataSet[ds]),
                                                                            SdmxV21ObservationsParser.getAttributes(dataSet[ds])));
            }
        }
        console.log(dataComponents.get("DATASET")[5])

    }
}

module.exports = SdmxV21DataParser;