var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const DatasetObject = require('sdmx-tck-api/src/model/data-queries-models/DatasetObject');
const SeriesObject = require('sdmx-tck-api/src/model/data-queries-models/SeriesObject');

describe('Tests DataQuery parsing', function () {
    it('It should print dataQuery XML workspce', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/DataXMLSeriesKeysOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            console.assert(sdmxObjects.sdmxObjects.get("DATASETS")[0] instanceof DatasetObject)
            console.assert(sdmxObjects.sdmxObjects.get("DATASETS")[0].getSeries().every(s => s instanceof SeriesObject))
        })
    });

    it.only('It should print dataQuery XML workspce', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/DataXMLComposite.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
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