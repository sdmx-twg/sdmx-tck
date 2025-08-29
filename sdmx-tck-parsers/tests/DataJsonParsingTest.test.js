//var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
var SdmxJsonV20DataParser  = require('../src/parsers/data-queries-parsers/SdmxJsonV20DataParser.js');

const fs = require('fs');
const DatasetObject = require('sdmx-tck-api/src/model/data-queries-models/DatasetObject');
const GroupObject = require('sdmx-tck-api/src/model/data-queries-models/GroupObject.js');
const ObservationObject = require('sdmx-tck-api/src/model/data-queries-models/ObservationObject.js');
const SeriesObject = require('sdmx-tck-api/src/model/data-queries-models/SeriesObject');
const SDMX_MESSAGE_FORMAT = require('sdmx-tck-api').constants.SDMX_MESSAGE_FORMAT;

describe('Tests DataQuery parsing', function () {
    const outputFile = './tests/output/test-output.txt';

    before(() => {
        // clear file before test suite runs
        fs.writeFileSync(outputFile, '', 'utf8');
    });

    it('It should print dataQuery XML workspce - Time Series', async () => {
        let json = fs.readFileSync('./tests/resources/Data/JSON 2.0/exr-time-series.json','utf8')
        parseMessage(json); 
    });

    it('It should print dataQuery XML workspce - Time Series Filtered', async () => {
        let json = fs.readFileSync('./tests/resources/Data/JSON 2.0/ECB_EXR_1.0_USD_TRT.json', 'utf8')
        parseMessage(json);
    });


    it('It should print dataQuery XML workspce - TWG Constructed sample', async () => {
        let json = fs.readFileSync('./tests/resources/Data/JSON 2.0/constructed-sample-full.json', 'utf8')
        parseMessage(json); 
    });

    it('It should print dataQuery XML workspce - TWG flat sample', async () => {
        let json = fs.readFileSync('./tests/resources/Data/JSON 2.0/exr-flat.json', 'utf8')
        parseMessage(json); 
    });
    
    it('It should print dataQuery XML workspce - demo11.metadatatechnology.com Flat File', async () => {
        let json = fs.readFileSync('./tests/resources/Data/JSON 2.0/ECB_TRD_1.0-filtered-flat.json', 'utf8')
        parseMessage(json);
    });

    it('It should print dataQuery XML workspce - Coded measures File', async () => {
        let json = fs.readFileSync('./tests/resources/Data/JSON 2.0/data with coded measure.json', 'utf8')
        parseMessage(json);
    });

    it('It should print dataQuery XML workspce - Complex Attributes File', async () => {
        let json = fs.readFileSync('./tests/resources/Data/JSON 2.0/data complex attributes.json', 'utf8')
        parseMessage(json);
    });
    it.only('It should print dataQuery XML workspce - No Measures', async () => {
        let json = fs.readFileSync('./tests/resources/Data/JSON 2.0/data no measures.json', 'utf8')
        parseMessage(json);
    });
    it.only('It should print dataQuery XML workspce - Default Measure is OBS_VALUE', async () => {
        let json = fs.readFileSync('./tests/resources/Data/JSON 2.0/data deafult measure.json', 'utf8')
        parseMessage(json);
    });

    function parseMessage (json) {
        let sdmxMessage = JSON.parse(json);
        var sdmxObjects = SdmxJsonV20DataParser.parseMessage(sdmxMessage);

        console.log("number of datasets " + sdmxObjects.sdmxObjects.get("DATASETS").length);
        //Print dataset attributes
        sdmxObjects.sdmxObjects.get("DATASETS").forEach(dataset => {

            writeLine('------------------------------')
            writeLine("Dataset.............");
            writeLine('------------------------------')
            
            console.assert(dataset instanceof DatasetObject)
            console.assert(dataset.getSeries().every(s => s instanceof SeriesObject))
            console.assert(dataset.getObservations().every(s => s instanceof ObservationObject))
            console.assert(dataset.getGroups().every(s => s instanceof GroupObject));
            
            ////////////////////////////////////////////////////

            // Dataset level attributes
            writeLine("Dataset-level attributes....")
            let attributes = dataset.getAttributes();
            for (let attrId in attributes) {
                write(`${attrId}=${attributes[attrId]}, `);
            }
            writeLine('');
            ////////////////////////////////////////////////////

            // Observations (flat, dimension at observation = all)
            writeLine(' Dataset Observations..........')
            dataset.getObservations().forEach((obs, index) => {
                write(`ds obs ${index}:`);
                let obsAttributes = obs.attributes;
                for (let attrId in obsAttributes) {
                    write(`${attrId}=${obsAttributes[attrId]}, `);
                }
                writeLine('');
            });
            ////////////////////////////////////////////////////

            // Dimension Groups
            writeLine("dimension-groups....")
            let groups = dataset.getGroups();
            groups.forEach(group  => {
                let groupAttributes = group.getAttributes();
                for (let attrId in groupAttributes) {
                    write(`${attrId}=${groupAttributes[attrId]}, `);
                }
                writeLine('');
            })
            writeLine('');
            ////////////////////////////////////////////////////

            // Series
            writeLine("Series.......")
            dataset.getSeries().forEach(series => {
                writeLine('');
                let attributes = series.attributes;
                for (let attrId in attributes) {
                    let isComplex = series.isComplexAttribute(attrId);
                    write(`${attrId}=${attributes[attrId]}, `);
                }
                writeLine('');
                writeLine('series obs...');

                let observations = series.observations;
                observations.forEach((obs, index) => {
                    write(`obs ${index}:`);
                    let obsAttributes = obs.attributes;
                    for (let attrId in obsAttributes) {
                        let isComplex = series.isComplexAttribute(attrId);
                        write(`${attrId}=${obsAttributes[attrId]}, `);
                    }
                    writeLine('');
                })
            });

            ////////////////////////////////////////////////////
        });
    }

    // Utility function to append a line to a file
    function writeLine(line) {
        write(line +"\n")
    }
    // Utility function to append to a file (without new line)
    function write(content) {
        fs.appendFileSync(outputFile, content , 'utf8');
    }
});