var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const SdmxSchemaObjects = require('sdmx-tck-api/src/model/schema-queries-models/SdmxSchemaObjects');


describe('Tests SdmxSchemaObjects class', function () {
    it('It should assert the type of workspace', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/XSDexample.xsd','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            console.assert(sdmxObjects instanceof SdmxSchemaObjects)
        })
    });
});