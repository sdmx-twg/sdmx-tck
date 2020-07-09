var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

describe('Tests DSD Parser', function () {
    it('It should a parsed dsd', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/dsd.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            //console.log(sdmxObjects.sdmxObjects.get("DSD")[0].getGroups())
        }).catch(function (err) {
            console.log(err);
        });
    });
});