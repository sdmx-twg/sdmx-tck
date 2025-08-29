var SdmxXmlParser = require('../../sdmx-tck-parsers/src/parsers/SdmxXmlParser.js');
const SDMX_MESSAGE_FORMAT = require('sdmx-tck-api').constants.SDMX_MESSAGE_FORMAT;

const fs = require('fs');
describe('Tests constraint data retrieval', function () {
    let format = SDMX_MESSAGE_FORMAT.XML_V21.key;
    it('print the XSD resourced fond', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentConstraintDataRetrieval.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (sdmxObjects) {
            var data = sdmxObjects.getConstraintDataForXSDTests()
            console.assert(data.datastructure && data.dataflow);
        })
    });
});