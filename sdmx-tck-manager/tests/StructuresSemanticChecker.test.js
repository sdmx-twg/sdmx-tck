var SdmxXmlParser = require('../../sdmx-tck-parsers/src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const assert = require('assert');
const StructuresSemanticChecker = require('../src/checker/StructuresSemanticChecker.js');

//////////////////////////////////////////////////////////////////////////
// Resource Identification Tests
//////////////////////////////////////////////////////////////////////////
describe('Tests Resource Identification Test - Multiple Values', function () {
    context('With api version v1.4.0', function () {
        it('Tests mutliple agencies key', async () => {
            let test = {
                testId: "/codelist/agency1+agency2/id/version",
                apiVersion: "v1.3.0",
                reqTemplate: {
                  multipleAgencies: true
                },
                testType: "Structure Identification Parameters"
            }
            let query = { resource: "codelist", agency: "ECB+ESTAT", id: "CL_UNIT", version: "1.0"}
            let xmlMessage = fs.readFileSync('./tests/resources/Structure Identification/SDMX 2.1/Codelist ECB_ESTAT_CL_UNIT_1.0.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage);
            let result = StructuresSemanticChecker.checkIdentification(test, query, sdmxObjects);
            
            assert.equal(result.status, 1, result.error);
        });
    });

    context('With api version v2.0.0', function () {
        it.only('Tests identification', async () => {
            let test = {
                testId: "/codelist/agency1+agency2/id/version",
                apiVersion: "v2.0.0",
                reqTemplate: {
                  multipleAgencies: false
                },
                testType: "Structure Identification Parameters"
            }
            let query = { resource: "structure", agency: "SDMX", id: "RSCONCEPTSCHEME", version: "1.0"}
            let xmlMessage = fs.readFileSync('./tests/resources/Structure Identification/SDMX 3.0/ConceptScheme SDMX+RSCONCEPTSCHEME+1.0.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, test.apiVersion);
            let result = StructuresSemanticChecker.checkIdentification(test, query, sdmxObjects);
            
            assert.equal(result.status, 1, result.error);
        });
        it('Tests references=ancestors', async () => {
            let apiVersion = "v2.0.0";
            let query = { resource: "codelist", agency: "BIS", id: "CL_FREQ", version: "1.0", item: "all", references: "ancestors"}
            let xmlMessage = fs.readFileSync('./tests/resources/Structure Identification/SDMX 3.0/Codelist BIS+CL_FREQ+1.0.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
            let result = StructuresSemanticChecker.checkReferences(query, sdmxObjects);
            
            assert.equal(result.status, 1, result.error);
        });
        it('Tests references=ancestors', async () => {
            let apiVersion = "v2.0.0";
            let query = { resource: "codelist", agency: "UNICEF", id: "CL_AGE", version: "1.0", item: "all", references: "ancestors"}
            let xmlMessage = fs.readFileSync('./tests/resources/Structure Identification/SDMX 3.0/Codelist UNICEF+CL_AGE+1.0.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
            let result = StructuresSemanticChecker.checkReferences(query, sdmxObjects);
            
            assert.equal(result.status, 1, result.error);
        });
        it('Tests references=ancestors', async () => {
            let apiVersion = "v2.0.0";
            let query = { resource: "codelist", agency: "CD2030", id: "CL_SUBREGION", version: "1.0", item: "all", references: "ancestors"}
            let xmlMessage = fs.readFileSync('./tests/resources/Structure Identification/SDMX 3.0/Codelist CD2030+CL_SUBREGION+1.0.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
            let result = StructuresSemanticChecker.checkReferences(query, sdmxObjects);
            
            assert.equal(result.status, 1, result.error);
        });
    });
});