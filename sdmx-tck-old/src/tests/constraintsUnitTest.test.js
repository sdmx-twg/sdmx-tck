import SdmxXmlParser from "../parsers/SdmxXmlParser";
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';

const fs = require('fs');

describe('Actual and Allowed Constraint tests', function () {
    it("Actual and Allowed Constraint tests", function () {
        let xmlMessage = fs.readFileSync('./src/tests/resources/contentconstraint.xml', 'utf8');
        new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let allowedConstraints = sdmxObjects.getSdmxObjectsWithCriteria(SDMX_STRUCTURE_TYPE.ALLOWED_CONTRAINT.key, null, null, null);
            console.log(allowedConstraints.length);

            let actualConstraints = sdmxObjects.getSdmxObjectsWithCriteria(SDMX_STRUCTURE_TYPE.ACTUAL_CONSTRAINT.key, null, null, null);
            console.log(actualConstraints.length);

            let contentonstraints = sdmxObjects.getSdmxObjectsWithCriteria(SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key, null, null, null);
            console.log(contentonstraints.length);

            expect(allowedConstraints.length + actualConstraints.length).toBe(contentonstraints.length);

        }).catch(function (err) {
            console.log(err);
        });
    });
});