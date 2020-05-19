var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const StructuresSemanticChecker = require('../../sdmx-tck-manager/src/checker/StructuresSemanticChecker.js');

const fs = require('fs');
describe('Tests if Content Constraint Obj gets the cube region', function () {
    it('It should return the obj', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentconstraint.xml', 'utf8');
        //var test = {testType:"Structure Target Category",preparedRequest:{request:{resource:"categoryscheme",agency:"SDMX",id:"STAT_SUBJECT_MATTER",version:"1.0",detail:"full",references:"parentsandsiblings",item:"DEMO_SOCIAL_STAT"}}}
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            // var validation = StructuresSemanticChecker.checkWorkspace(test,sdmxObjects)
            console.log(sdmxObjects.sdmxObjects.get('CONTENT_CONSTRAINT')[0].cubeRegion[0].KeyValue[0].value);
        }).catch(function (err) {
            console.log(err);
        });
    });
});