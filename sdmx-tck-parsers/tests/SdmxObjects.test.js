var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
var StructureReference = require('sdmx-tck-api').model.StructureReference;


var StructureDetail = require('sdmx-tck-api').constants.StructureDetail;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

describe('Tests SdmxObjects class', function () {
    it('It should return a random structure', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentconstraint_PRA_constrainable.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let structure = sdmxObjects.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.CODE_LIST.key);
            
            console.log(structure);
        }).catch(function (err) {
            console.log(err);
        });
    });
});