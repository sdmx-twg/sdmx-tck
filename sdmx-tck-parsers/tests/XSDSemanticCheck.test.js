var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var SchemasSemanticChecker = require('../../sdmx-tck-manager/src/checker/SchemasSemanticChecker.js')

var StructureDetail = require('sdmx-tck-api').constants.StructureDetail;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

describe('XSD validation test', function () {
    it('It should validate the XSD', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/testXml.xml','utf8')
        let artefact;
        let structWrkspce;
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            // console inside of getIMObjects
            artefact = sdmxObjects.sdmxObjects.get("DSD")[0]
            structWrkspce = sdmxObjects
        }).catch(function (err) {
            console.log(err);
        });

        let xsdMessage = fs.readFileSync('./tests/resources/testXsd.xsd','utf8')
        let xsdWorkspace;
        await new SdmxXmlParser().getIMObjects(xsdMessage).then(function (sdmxObjects) {
            // console inside of getIMObjects
            xsdWorkspace = sdmxObjects;
        }).catch(function (err) {
            console.log(err);
        });


        let constraint = fs.readFileSync('./tests/resources/contentconstraint_OECD_FDI_1.0.xml','utf8')
        let constraintWorkspace;
        await new SdmxXmlParser().getIMObjects(constraint).then(function (sdmxObjects) {
            // console inside of getIMObjects
            constraintWorkspace = sdmxObjects;
        }).catch(function (err) {
            console.log(err);
        });

        let query = {explicit:true,version:"latest"}
        let constraintObj = constraintWorkspace.toJSON().sdmxObjects.CONTENT_CONSTRAINT[0];
        let test = {structureWorkspace:structWrkspce,constraintParent:constraintObj}
        console.log(SchemasSemanticChecker.checkXSDSimpleTypesWithEnums(test,query,xsdWorkspace))
        //console.log(SchemasSemanticChecker.checkSpecificXSDGroupType(artefact,xsdWorkspace))
    });
});