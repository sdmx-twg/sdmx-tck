var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');

const fs = require('fs');
describe('Tests constraint data retrieval', function () {
    it('print the XSD resourced fond', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentConstraintDataRetrieval.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            var test = {testType:"Prepare Schema Tests",resource:"contentconstraint"}

            var data = sdmxObjects.getConstraintDataForXSDTests()
            console.log(data);
        }).catch(function (err) {
            console.log(err);
        });
    });
});