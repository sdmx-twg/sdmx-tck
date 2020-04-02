var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
var StructureReference = require('sdmx-tck-api').model.StructureReference;


var StructureDetail = require('sdmx-tck-api').constants.StructureDetail;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

describe('Tests SdmxObjects class', function () {
    it('It should return a random structure', async () => {
       
        var xmlStream = fs.readFileSync('./tests/resources/dsd_xsd_example.xml','utf8');
        console.log(JSON.stringify(xmlStream))      
        new SdmxXmlParser().validate21(JSON.stringify(xmlStream))
    });
});