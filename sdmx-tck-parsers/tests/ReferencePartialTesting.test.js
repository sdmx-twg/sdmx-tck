
var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const StructuresSemanticChecker = require('../../sdmx-tck-manager/src/checker/StructuresSemanticChecker.js');
const ContentConstraintReferencePartialChecker = require('../../sdmx-tck-manager/src/checker/ContentConstraintReferencePartialChecker.js');

const fs = require('fs');
describe('Tests if DataKeySet obj gets the DataKeySet', function () {
    it('It should return the obj', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/WB-GCI_GHA-1.0.xml', 'utf8');

        let preparedRequest = 
        {   service:
            { id: undefined,
              name: undefined,
              url: 'https://demo.metadatatechnology.com/FusionRegistry/ws/public/sdmxapi/rest',
              api: 'v1.4.0',
              format: undefined }
          }

        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
           
            test = {
                testId: "Test for Reference Partial",
                index: "Structure",
                run: false,
                apiVersion: "v1.3.0",
                resource: "contentconstraint",
                requireRandomSdmxObject: true,
                preparedRequest:{service:{url:"https://demo.metadatatechnology.com/FusionRegistry/ws/public/sdmxapi/rest"}},
                reqTemplate: {references:"descendants"},
                identifiers: {structureType: "CONTENT_CONSTRAINT", agency: "WB", id: "GCI_GHA", version: "1.0" },
                state: "Waiting",
                failReason: "",
                testType: "Structure Reference Partial",
                subTests: []
            }
            ContentConstraintReferencePartialChecker.checkWorkspace(test,preparedRequest,sdmxObjects)
            .then((result)=>{
                console.assert(result.status === 0)
            })
         
        })
    });
});