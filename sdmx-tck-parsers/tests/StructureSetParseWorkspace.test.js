var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const StructuresSemanticChecker = require('../../sdmx-tck-manager/src/checker/StructuresSemanticChecker.js');

const fs = require('fs');
describe('Tests Structure Set parsing', function () {
    it('It workspace objects', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/structureSet.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            //var validation = StructuresSemanticChecker.checkWorkspace(test,sdmxObjects)
            console.log(sdmxObjects);
        }).catch(function (err) {
            console.log(err);
        });
    });
});