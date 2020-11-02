var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
var StructureReference = require('sdmx-tck-api').model.StructureReference;


var StructureDetail = require('sdmx-tck-api').constants.StructureDetail;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

describe('Tests DataQuery parsing', function () {
    it('It should print dataQuery XML workspce', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/education.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            console.log(sdmxObjects)
        }).catch(function (err) {
            console.log(err);
        });
    });
});