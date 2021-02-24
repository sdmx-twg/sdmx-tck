var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var SchemasSemanticChecker = require('../../sdmx-tck-manager/src/checker/SchemasSemanticChecker.js')

var StructureDetail = require('sdmx-tck-api').constants.StructureDetail;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

describe('XSD Simple Types validation test', function () {
    it('It should assert the validation the XSD', async () => {
       
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
        let validation  = SchemasSemanticChecker.checkXSDSimpleTypesWithEnums(test,query,artefact,xsdWorkspace)
        console.assert(validation.status === 1)
    });
});
describe('XSD with Multiple Groups test', function () {
    it('It should assert the validation of the XSD group types', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/dsdMultipleGroups.xml','utf8')
        let artefact;
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            artefact = sdmxObjects.sdmxObjects.get("DSD")[0]
        })
        let xsdMessage = fs.readFileSync('./tests/resources/XSDMultipleGroups.xsd','utf8')
        let xsdWorkspace;
        await new SdmxXmlParser().getIMObjects(xsdMessage).then(function (sdmxObjects) {
            xsdWorkspace = sdmxObjects;
        })
        let validation  = SchemasSemanticChecker.checkSpecificXSDGroupType(artefact,xsdWorkspace)
        console.assert(validation.status === 1)
    });
});

describe('XSD default rules test', function () {
    it('It should validate the XSD group types', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/dsd.xml','utf8')
        let artefact;
        let structWrkspce;
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            artefact = sdmxObjects.sdmxObjects.get("DSD")[0]
            structWrkspce = sdmxObjects
        })

        let xsdMessage = fs.readFileSync('./tests/resources/dsd_xsd_example.xsd','utf8')
        let xsdWorkspace;
        await new SdmxXmlParser().getIMObjects(xsdMessage).then(function (sdmxObjects) {
            xsdWorkspace = sdmxObjects;
        })
        let result = SchemasSemanticChecker.checkDefaultRules(artefact,xsdWorkspace,"TIME_PERIOD")
        console.assert(result.status === 1)
    });
});

describe('XSD Complex types of measure dimension concpets test', function () {
    it('It should assert the XSD validation', async () => {
       
        let xmlMessage = fs.readFileSync('./tests/resources/xmlForObsType.xml','utf8')
        let artefact;
        let structWrkspce;
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            artefact = sdmxObjects.sdmxObjects.get("DSD")[0]
            structWrkspce = sdmxObjects
        })

        let xsdMessage = fs.readFileSync('./tests/resources/xsdForObsType.xsd','utf8')
        let xsdWorkspace;
        await new SdmxXmlParser().getIMObjects(xsdMessage).then(function (sdmxObjects) {
            xsdWorkspace = sdmxObjects;
        })
        let result  = SchemasSemanticChecker.checkComplexTypesOfMeasureDimensionConcepts({structureWorkspace:structWrkspce},artefact,xsdWorkspace)
        console.assert(result.status === 1)
    });
});