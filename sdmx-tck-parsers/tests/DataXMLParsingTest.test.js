var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');

describe('Tests DataQuery parsing', function () {
    it('It should print dataQuery XML workspce', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/dataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            console.log(sdmxObjects.sdmxObjects.get("DATASETS")[0].observations)
        }).catch(function (err) {
            console.log(err);
        });
    });
});