var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const StructuresSemanticChecker = require('../../sdmx-tck-manager/src/checker/StructuresSemanticChecker.js');

const fs = require('fs');
const MaintainableObject = require('sdmx-tck-api/src/model/structure-queries-models/MaintainableObject');
const SdmxStructureObjects = require('sdmx-tck-api/src/model/structure-queries-models/SdmxStructureObjects');
describe('Tests Structure Set parsing', function () {
    it('It asserts Structure Set parsed objects', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/structureSet.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            console.assert(sdmxObjects instanceof SdmxStructureObjects)
            console.assert(sdmxObjects.sdmxObjects.get("STRUCTURE_SET")[0] instanceof MaintainableObject)
        })
    });
});