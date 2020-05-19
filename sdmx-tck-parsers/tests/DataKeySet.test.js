
var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const StructuresSemanticChecker = require('../../sdmx-tck-manager/src/checker/StructuresSemanticChecker.js');
const ContentConstraintReferencePartialChecker = require('../../sdmx-tck-manager/src/checker/ContentConstraintReferencePartialChecker.js');

const fs = require('fs');
describe('Tests if DataKeySet obj gets the DataKeySet', function () {
    it('It should return the obj', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentconstraint_DataKeysets.xml', 'utf8');

        let preparedRequest = 
        {   service:
            { id: undefined,
              name: undefined,
              url: 'http://sdw-wsrest.ecb.europa.eu/service/',
              api: 'v1.4.0',
              format: undefined }
          }

        //var test = {testType:"Structure Target Category",preparedRequest:{request:{resource:"categoryscheme",agency:"SDMX",id:"STAT_SUBJECT_MATTER",version:"1.0",detail:"full",references:"parentsandsiblings",item:"DEMO_SOCIAL_STAT"}}}
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            // var validation = StructuresSemanticChecker.checkWorkspace(test,sdmxObjects)
            //console.log(sdmxObjects.sdmxObjects.get('CONTENT_CONSTRAINT')[0].dataKeySets[0].keys[0])//.keyValues[5].values);
            //console.log(sdmxObjects.sdmxObjects.get('CONTENT_CONSTRAINT')[0].dataKeySet)
            test = {
                testId: "Test for Reference Partial",
                index: "Structures",
                run: false,
                apiVersion: "v1.3.0",
                resource: "contentconstraint",
                requireRandomSdmxObject: true,
                preparedRequest:{service:{url:"http://sdw-wsrest.ecb.europa.eu/service/"}},
                reqTemplate: {references:"descendants"},
                identifiers: {structureType: "CONTENT_CONSTRAINT", agency: "ECB.DISS", id: "SEC_PUB_CONSTRAINTS", version: "1.0" },
                state: "Waiting",
                failReason: "",
                testType: "Structure Reference Partial",
                subTests: []
            }
            ContentConstraintReferencePartialChecker.checkWorkspace(test,preparedRequest,sdmxObjects)
            .then((result)=>{
                console.log(result)
            }).catch((err) => {
                console.log(err)
            });
        }).catch(function (err) {
            console.log(err);
        });
    });
});