const fs = require('fs');
const StructureReference = require('sdmx-tck-api/src/model/structure-queries-models/StructureReference');
var SdmxParser = require('../../sdmx-tck-parsers/src/parsers/SdmxParser.js');
const SDMX_MESSAGE_FORMAT = require('sdmx-tck-api').constants.SDMX_MESSAGE_FORMAT;

describe('Tests the correct selection of maintainables to perform the random xsd tests', function () {
    let format = SDMX_MESSAGE_FORMAT.XML_V21.key;
    it('It should assert that the result is a PRA reference', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/globalRegistry_AllPrasWithDescendants.xml','utf8')
        await new SdmxParser().getIMObjects(xmlMessage, format).then(function (sdmxObjects) {
        console.assert(sdmxObjects.getNonConstraintDataForXSDTests("provisionagreement") instanceof StructureReference)
        console.assert(sdmxObjects.getNonConstraintDataForXSDTests("provisionagreement").getStructureType() === "PROVISION_AGREEMENT")
        })
    });
});