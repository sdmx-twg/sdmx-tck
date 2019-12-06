import SdmxXmlParser from '../parsers/SdmxXmlParser';
import SemanticChecker from '../checker/StructuresSemanticChecker';

const fs = require('fs');

describe('Check Detail Parameter', function () {
    it('It should check if the checkDetails func works fine', async () => {
        let xmlMessage = fs.readFileSync('./src/tests/resources/ESTAT+STS+1.4.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {

            let query = { resource: "datastructure", agency: "ESTAT", id: "STS_OECD", version: "1.4", detail: "referencepartial" };
            var response = SemanticChecker.checkDetails(query, sdmxObjects);

            console.log(response)

        }).catch(function (err) {
            console.log(err);
        });
    });
});