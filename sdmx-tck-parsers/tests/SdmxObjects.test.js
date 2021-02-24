var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const SdmxStructureObjects = require('sdmx-tck-api/src/model/structure-queries-models/SdmxStructureObjects');

describe('Tests SdmxObjects class', function () {
    it('It assert the parsed PRA ', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/provisionagreement.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            console.assert(sdmxObjects instanceof SdmxStructureObjects )
        })
    });
});