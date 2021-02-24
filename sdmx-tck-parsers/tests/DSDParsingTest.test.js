var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const DataStructureObject = require('sdmx-tck-api/src/model/structure-queries-models/DataStructureObject');

describe('Tests DSD Parser', function () {
    it('It should assert a parsed dsd', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/dsd.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            console.assert(sdmxObjects instanceof SdmxStructureObjects)
            console.assert(sdmxObjects.sdmxObjects.get("DSD")[0] instanceof DataStructureObject )
        })
    });
});