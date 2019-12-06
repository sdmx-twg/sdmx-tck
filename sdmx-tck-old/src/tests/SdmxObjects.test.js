import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';
import SdmxXmlParser from '../parsers/SdmxXmlParser';
const fs = require('fs');

describe('Tests SdmxObjects class', function () {
    it('It should return a random structure', async () => {
        let xmlMessage = fs.readFileSync('./src/tests/resources/OrganisationsScheme.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let structure = sdmxObjects.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.ORGANISATION_SCHEME.key);
            console.log(structure.getStructureType());
        }).catch(function (err) {
            console.log(err);
        });
    });

    it('It should filter workspace artefactes based on certain criteria.', async () => {
        let xmlMessage = fs.readFileSync('./src/tests/resources/Datastructure_ESTAT+NA_SU+2.1_parentsandsiblings.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let filteredStructures = sdmxObjects.getSdmxObjectsWithCriteria(SDMX_STRUCTURE_TYPE.CODE_LIST.key, 'ESTAT', null, null);
            console.log(filteredStructures);
        }).catch(function (err) {
            console.log(err);
        });
    });
});