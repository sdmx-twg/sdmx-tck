var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject;
var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const DataKeySetObject = require('sdmx-tck-api/src/model/structure-queries-models/DataKeySetObject');

describe('Tests if Content Constraint Obj gets the cube region', function () {
    it('It should assert that cube regions are an instance of CubeRegion Object', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentconstraint.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let cubeRegions = sdmxObjects.sdmxObjects.get('CONTENT_CONSTRAINT')[0].cubeRegions;
            console.assert(cubeRegions.every(cube=> cube instanceof CubeRegionObject))
        })
    });
});

describe('Tests if DataKeySet obj gets the DataKeySet', function () {
    it('It should assert the DataKeySet obj', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentconstraint_DataKeysets.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let dataKeySets = sdmxObjects.sdmxObjects.get('CONTENT_CONSTRAINT')[0].dataKeySets;
            console.assert(dataKeySets.every(dataKeySet=> dataKeySet instanceof DataKeySetObject))
        })
    })
});