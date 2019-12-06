import SdmxXmlParser from '../parsers/SdmxXmlParser';
import SemanticChecker from '../SemanticChecker';
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';
import StructureReference from '../model/StructureReference';
import STRUCTURE_REFERENCE_DETAIL from '../constants/StructureReferenceDetail';
const fs = require('fs');

describe('Parse SDMX-ML Message', function () {
    it('It should parse the SDMX-ML message', async () => {
        let xmlMessage = fs.readFileSync('./src/tests/resources/Datastructure_ESTAT+NA_SU+2.1_descendants.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let requestedStructureRef = new StructureReference(SDMX_STRUCTURE_TYPE.DSD.key, "ESTAT", "NA_SU", "2.1");
            console.log("ALL ? " + SemanticChecker.checkReferences(sdmxObjects, requestedStructureRef, STRUCTURE_REFERENCE_DETAIL.ALL));
            console.log("NONE ? " + SemanticChecker.checkReferences(sdmxObjects, requestedStructureRef, STRUCTURE_REFERENCE_DETAIL.NONE));
            console.log("PARENTS ? " + SemanticChecker.checkReferences(sdmxObjects, requestedStructureRef, STRUCTURE_REFERENCE_DETAIL.PARENTS));
            console.log("PARENTS_SIBLINGS ? " + SemanticChecker.checkReferences(sdmxObjects, requestedStructureRef, STRUCTURE_REFERENCE_DETAIL.PARENTS_SIBLINGS));
            console.log("CHILDREN ? " + SemanticChecker.checkReferences(sdmxObjects, requestedStructureRef, STRUCTURE_REFERENCE_DETAIL.CHILDREN));
            console.log("DESCENDANTS ? " + SemanticChecker.checkReferences(sdmxObjects, requestedStructureRef, STRUCTURE_REFERENCE_DETAIL.DESCENDANTS));
            console.log("SPECIFIC STRUCTURE ? " + SemanticChecker.checkReferences(sdmxObjects, requestedStructureRef, STRUCTURE_REFERENCE_DETAIL.CODE_LIST));
            
        }).catch(function (err) {
            console.log(err);
        });
    });
});