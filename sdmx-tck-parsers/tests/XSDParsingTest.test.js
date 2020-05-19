var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');


describe('Tests XSD Parser', function () {
    it('It should print a parsed xsd', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/XSDexample.xsd','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            //console.log(sdmxObjects.sdmxObjects.get("complexTypes")[0].compositors)
            //console.log(sdmxObjects.sdmxObjects.get("complexTypes")[0].compositors[0].compositors[0].elements)
            console.log(sdmxObjects.sdmxObjects.get("complexTypes")[2].compositors[0])
        }).catch(function (err) {
            console.log(err);
        });
    });
});