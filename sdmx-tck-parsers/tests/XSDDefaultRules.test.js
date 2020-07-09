var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var SchemasSemanticChecker = require('../../sdmx-tck-manager/src/checker/SchemasSemanticChecker.js')

var StructureDetail = require('sdmx-tck-api').constants.StructureDetail;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

describe('XSD default rules test', function () {
    it('It should validate the XSD group types', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/dsd.xml','utf8')
        let artefact;
        let structWrkspce;
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            // console inside of getIMObjects
            artefact = sdmxObjects.sdmxObjects.get("DSD")[0]
            structWrkspce = sdmxObjects
        }).catch(function (err) {
            console.log(err);
        });

        let xsdMessage = fs.readFileSync('./tests/resources/dsd_xsd_example.xsd','utf8')
        let xsdWorkspace;
        await new SdmxXmlParser().getIMObjects(xsdMessage).then(function (sdmxObjects) {
            // console inside of getIMObjects
            xsdWorkspace = sdmxObjects;
        }).catch(function (err) {
            console.log(err);
        });

        console.log(SchemasSemanticChecker.checkDefaultRules(artefact,xsdWorkspace))
        //console.log(SchemasSemanticChecker.checkSpecificXSDGroupType(artefact,xsdWorkspace))
    });
});