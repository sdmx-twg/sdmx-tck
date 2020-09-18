var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');


describe('Tests the correct selection of maintainables to perform the random xsd tests', function () {
    it('It should print a parsed mainatainable', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/globalRegistry_AllPrasWithDescendants.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            //console.log(sdmxObjects.sdmxObjects.get("complexTypes")[0].compositors)
            //console.log(sdmxObjects.sdmxObjects.get("complexTypes")[0].compositors[0].compositors[0].elements)
        console.log(sdmxObjects.getNonConstraintDataForXSDTests("provisionagreement"))
        //console.log(sdmxObjects)
        }).catch(function (err) {
            console.log(err);
        });
    });
});