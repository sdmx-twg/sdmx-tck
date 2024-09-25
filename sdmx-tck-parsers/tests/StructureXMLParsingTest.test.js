const SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const DataStructureObject = require('sdmx-tck-api/src/model/structure-queries-models/DataStructureObject');
const MaintainableObject = require('sdmx-tck-api/src/model/structure-queries-models/MaintainableObject.js');
const ItemSchemeObject = require('sdmx-tck-api/src/model/structure-queries-models/ItemSchemeObject.js');
const SdmxStructureObjects = require('sdmx-tck-api/src/model/structure-queries-models/SdmxStructureObjects');
const CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject;
const DataKeySetObject = require('sdmx-tck-api/src/model/structure-queries-models/DataKeySetObject');

const fs = require('fs');
const assert = require('assert');

describe('Tests SDMX-ML structure parsers', function () {
    context('For SDMX 2.1', function () {
        let apiVersion = "v1.4.0";
        let path = "./tests/resources/Structures/SDMX 2.1/";
        it('Tests parsers for datastructures', async () => {
            let xmlMessage = fs.readFileSync(path + 'DataStructure BI+EXIM+1.1.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            assert(sdmxObjects.sdmxObjects.get("DSD")[0] instanceof DataStructureObject);
        });

        it('Tests parsers for hierarchical codelists', async () => {
            let xmlMessage = fs.readFileSync(path + 'Hierarchicalcodelist UNICEF+CME_REGIONS_HIERARCHY+1.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            let hierarchicalCodelist = sdmxObjects.sdmxObjects.get("HIERARCHICAL_CODELIST")[0];
            assert(hierarchicalCodelist instanceof ItemSchemeObject);
            let items = hierarchicalCodelist.getItems();
            assert(items.length === 3);
        });

        it('Tests parsers for provision agreements', async () => {
            let xmlMessage = fs.readFileSync(path + 'Provisionagreements.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
            assert(sdmxObjects instanceof SdmxStructureObjects)
        });

        it('Tests parsers for structure sets', async () => {
            let xmlMessage = fs.readFileSync(path + 'Structureset ESTAT+STS-UPRG-TES+1.0.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            assert(sdmxObjects.sdmxObjects.get("STRUCTURE_SET")[0] instanceof MaintainableObject);
        });

        it('It should assert that cube regions are an instance of CubeRegion Object', async () => {
            let xmlMessage = fs.readFileSync(path + 'Contentconstraint ESTAT+CR_HICP_AP_A+1.1.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
            let cubeRegions = sdmxObjects.sdmxObjects.get('CONTENT_CONSTRAINT')[0].cubeRegions;
            let condition = cubeRegions.every(cube => cube instanceof CubeRegionObject);
            assert(condition, true);
        });

        it('It should assert the DataKeySet obj', async () => {
            let xmlMessage = fs.readFileSync(path + 'Contentconstraint DataKeysets.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
            let dataKeySets = sdmxObjects.sdmxObjects.get('CONTENT_CONSTRAINT')[0].dataKeySets;
            let condition = dataKeySets.every(dataKeySet => dataKeySet instanceof DataKeySetObject);
            assert(condition, true);
        });
    });
});