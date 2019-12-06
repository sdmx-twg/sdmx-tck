import SdmxXmlParser from '../parsers/SdmxXmlParser';
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';
const fs = require('fs');

describe('Parse SDMX-ML Message', function () {
    it('It should parse the SDMX-ML message', async function () {
        let xmlMessage = fs.readFileSync('./src/tests/resources/provisionagreement 3.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            for (const [structureType, structuresArray] of sdmxObjects.getSdmxObjects()) {
                for (let structure in structuresArray) {
                    let children = structuresArray[structure].getChildren();
                    if (children.length === 0 && structureType !== SDMX_STRUCTURE_TYPE.CODE_LIST.key) {
                        console.log(JSON.stringify(structuresArray[structure].asReference()) + " : " + JSON.stringify(structuresArray[structure].getChildren()) + " \n ");
                    }
                }
            }
        }).catch(function (err) {
            console.log(err);
        });

    });
});