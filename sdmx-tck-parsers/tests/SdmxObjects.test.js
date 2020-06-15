var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

describe('Tests SdmxObjects class', function () {
    it('It should return a random structure', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentconstraint.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            //let structure = sdmxObjects.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.CODE_LIST.key);
            
            console.log(sdmxObjects);
        }).catch(function (err) {
            console.log(err);
        });
    });
});