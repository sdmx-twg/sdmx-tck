var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const StructuresSemanticChecker = require('../../sdmx-tck-manager/src/checker/StructuresSemanticChecker.js');
const ContentConstraintReferencePartialChecker = require('../../sdmx-tck-manager/src/checker/ContentConstraintReferencePartialChecker.js');
var SdmxObjects = require('sdmx-tck-api').model.SdmxObjects;

const fs = require('fs');
describe('Tests if reference partial testing works with different xml inputs', function () {
    it('It should return the validation result', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentconstraint_PRA_constrainable.xml', 'utf8');
        let test={};
        let preparedRequest = 
        {   service:
            { id: undefined,
              name: undefined,
              url: 'https://registry.sdmx.org/ws/public/sdmxapi/rest/',
              api: 'v1.4.0',
              format: undefined }
          }
        //var test = {testType:"Structure Target Category",preparedRequest:{request:{resource:"categoryscheme",agency:"SDMX",id:"STAT_SUBJECT_MATTER",version:"1.0",detail:"full",references:"parentsandsiblings",item:"DEMO_SOCIAL_STAT"}}}
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
             test = {
                testId: "Test for Reference Partial",
                index: "Structures",
                run: false,
                apiVersion: "v1.3.0",
                resource: "contentconstraint",
                requireRandomSdmxObject: true,
                preparedRequest:{service:{url:"https://registry.sdmx.org/ws/public/sdmxapi/rest/"}},
                reqTemplate: {references:"descendants"},
                identifiers: {structureType: "CONTENT_CONSTRAINT", agency: "OECD", id: "CR_FDI", version: "1.0" },
                state: "Waiting",
                failReason: "",
                testType: "Structure Reference Partial",
                subTests: []
            }
            //console.log(sdmxObjects)
            // var validation = StructuresSemanticChecker.checkWorkspace(test,sdmxObjects)
            ContentConstraintReferencePartialChecker.checkWorkspace(test,preparedRequest,sdmxObjects)
            .then((result)=>{
                console.log(result)
            }).catch((err) => {
                console.log(err)
            });
            
            //console.log(sdmxObjects.structures.get('CONTENT_CONSTRAINT')[0].cubeRegion[0].KeyValue[0].value);
        }).catch(function (err) {
            console.log(err);
        });
    });
});