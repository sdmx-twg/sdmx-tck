var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const DataStructureObject = require('sdmx-tck-api/src/model/structure-queries-models/DataStructureObject');
const SdmxStructureObjects = require('sdmx-tck-api/src/model/structure-queries-models/SdmxStructureObjects');

describe('Tests DSD Parser', function () {
    it('It should assert a parsed dsd', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/DSD_ECB_ECB_RAI1_1.0.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            console.assert(sdmxObjects instanceof SdmxStructureObjects)
            console.assert(sdmxObjects.sdmxObjects.get("DSD")[0] instanceof DataStructureObject )
        })
    });
});