var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const DatasetObject = require('sdmx-tck-api/src/model/data-queries-models/DatasetObject');
const SeriesObject = require('sdmx-tck-api/src/model/data-queries-models/SeriesObject');
const SDMX_MESSAGE_FORMAT = require('sdmx-tck-api').constants.SDMX_MESSAGE_FORMAT;

describe('Tests DataQuery parsing', function () {
    it('It should print dataQuery XML workspce', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/DataXMLSeriesKeysOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, SDMX_MESSAGE_FORMAT.XML_V21.key).then(function (sdmxObjects) {
            console.assert(sdmxObjects.sdmxObjects.get("DATASETS")[0] instanceof DatasetObject)
            console.assert(sdmxObjects.sdmxObjects.get("DATASETS")[0].getSeries().every(s => s instanceof SeriesObject))
        })
    });

    it.only('It should print dataQuery XML workspce - SDMX-ML 2.1', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/DataXMLComplex.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, SDMX_MESSAGE_FORMAT.XML_V21.key).then(function (sdmxObjects) {
            console.assert(sdmxObjects.sdmxObjects.get("DATASETS")[0] instanceof DatasetObject)
            sdmxObjects.sdmxObjects.get("DATASETS")[0].getSeries().forEach(series => {
                let attributes = series.attributes;
                for (let attrId in attributes) {
                    let isComplex = series.isComplexAttribute(attrId);
                    console.log(attrId, attributes[attrId], "isComplex=", isComplex);
                }
            });
        })
    });
    it.only('It should print dataQuery XML workspce - SDMX-ML 3.0', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/Data/SDMX 3.0/ECB_EXR_1.0_filtered.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, SDMX_MESSAGE_FORMAT.XML_V300.key).then(function (sdmxObjects) {
            console.assert(sdmxObjects.sdmxObjects.get("DATASETS")[0] instanceof DatasetObject)
            sdmxObjects.sdmxObjects.get("DATASETS")[0].getSeries().forEach(series => {
                let attributes = series.attributes;
                for (let attrId in attributes) {
                    let isComplex = series.isComplexAttribute(attrId);
                    console.log(attrId, attributes[attrId], "isComplex=", isComplex);
                }
            });
        })
    });
});