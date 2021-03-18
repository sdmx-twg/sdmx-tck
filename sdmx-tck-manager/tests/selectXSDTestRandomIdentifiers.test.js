var SdmxXmlParser = require('../../sdmx-tck-parsers/src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const StructureReference = require('sdmx-tck-api/src/model/structure-queries-models/StructureReference');


describe('Tests the correct selection of maintainables to perform the random xsd tests', function () {
    it('It should assert that the result is a PRA reference', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/globalRegistry_AllPrasWithDescendants.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
        console.assert(sdmxObjects.getNonConstraintDataForXSDTests("provisionagreement") instanceof StructureReference)
        console.assert(sdmxObjects.getNonConstraintDataForXSDTests("provisionagreement").getStructureType() === "PROVISION_AGREEMENT")
        })
    });
});