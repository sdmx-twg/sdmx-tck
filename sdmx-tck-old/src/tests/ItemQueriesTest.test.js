import SdmxXmlParser from '../parsers/SdmxXmlParser';
import SemanticChecker from '../checker/StructuresSemanticChecker';

const fs = require('fs');

describe('Check Item Queries', function () {
    it('It should check if the item queries validation works fine', async () => {
        let xmlMessage = fs.readFileSync('./src/tests/resources/conceptscheme.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {

            let query = { resource: "conceptscheme", agency: "ESTAT", id: "GPP_CONS", version: "1.1", item:"CON1+CON3"};
            var response = SemanticChecker.checkIdentification(query, sdmxObjects);

            console.log(response);

        }).catch(function (err) {
            console.log(err);
        });
    });
});