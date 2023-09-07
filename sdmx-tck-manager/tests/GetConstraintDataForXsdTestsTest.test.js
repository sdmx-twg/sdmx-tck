var SdmxXmlParser = require('../../sdmx-tck-parsers/src/parsers/SdmxXmlParser.js');

const fs = require('fs');
describe('Tests constraint data retrieval', function () {
    it('print the XSD resourced fond', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentConstraintDataRetrieval.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            var data = sdmxObjects.getConstraintDataForXSDTests()
            console.assert(data.datastructure && data.dataflow);
        })
    });
});