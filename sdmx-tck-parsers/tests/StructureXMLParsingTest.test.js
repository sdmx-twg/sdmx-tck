const SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const DataStructureObject = require('sdmx-tck-api/src/model/structure-queries-models/DataStructureObject');
const MaintainableObject = require('sdmx-tck-api/src/model/structure-queries-models/MaintainableObject.js');
const ItemSchemeObject = require('sdmx-tck-api/src/model/structure-queries-models/ItemSchemeObject.js');
const SdmxStructureObjects = require('sdmx-tck-api/src/model/structure-queries-models/SdmxStructureObjects');
const CubeRegionObject = require('sdmx-tck-api').model.CubeRegionObject;
const DataKeySetObject = require('sdmx-tck-api/src/model/structure-queries-models/DataKeySetObject');
const ATTRIBUTE_RELATIONSHIP_NAMES = require('sdmx-tck-api').constants.ATTRIBUTE_RELATIONSHIP_NAMES;
const SDMX_MESSAGE_FORMAT = require('sdmx-tck-api').constants.SDMX_MESSAGE_FORMAT;

const fs = require('fs');
const assert = require('assert');

describe('Tests SDMX-ML structure parsers', function () {
    context('For SDMX 2.1', function () {
        let format = SDMX_MESSAGE_FORMAT.XML_V21.key;
        let path = "./tests/resources/Structures/SDMX 2.1/";
        it('Tests parsers for datastructures', async () => {
            let xmlMessage = fs.readFileSync(path + 'DataStructure BI+EXIM+1.1.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            assert(sdmxObjects.sdmxObjects.get("DSD")[0] instanceof DataStructureObject);
            console.log("Printing Groups")
            for (let g of sdmxObjects.sdmxObjects.get("DSD")[0].getGroups()) { 
               console.log(JSON.stringify(g));
            }
        });

        it('Tests parsers for hierarchical codelists', async () => {
            let xmlMessage = fs.readFileSync(path + 'Hierarchicalcodelist UNICEF+CME_REGIONS_HIERARCHY+1.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            let hierarchicalCodelist = sdmxObjects.sdmxObjects.get("HIERARCHICAL_CODELIST")[0];
            assert(hierarchicalCodelist instanceof ItemSchemeObject);
            let items = hierarchicalCodelist.getItems();
            assert(items.length === 3);
        });

        it('Tests parsers for provision agreements', async () => {
            let xmlMessage = fs.readFileSync(path + 'Provisionagreements.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            assert(sdmxObjects instanceof SdmxStructureObjects)
        });

        it('Tests parsers for structure sets', async () => {
            let xmlMessage = fs.readFileSync(path + 'Structureset ESTAT+STS-UPRG-TES+1.0.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            assert(sdmxObjects.sdmxObjects.get("STRUCTURE_SET")[0] instanceof MaintainableObject);
        });

        it('Tests parsers for registrations', async () => {
            let xmlMessage = fs.readFileSync(path + 'Registrations.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            assert(sdmxObjects.sdmxObjects.get("REGISTRATION")[0] instanceof MaintainableObject);
        });

        it('It should assert that cube regions are an instance of CubeRegion Object', async () => {
            let xmlMessage = fs.readFileSync(path + 'Contentconstraint ESTAT+CR_HICP_AP_A+1.1.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            let cubeRegions = sdmxObjects.sdmxObjects.get('CONTENT_CONSTRAINT')[0].cubeRegions;
            let condition = cubeRegions.every(cube => cube instanceof CubeRegionObject);
            assert(condition, true);
        });

        it('It should assert the DataKeySet obj', async () => {
            let xmlMessage = fs.readFileSync(path + 'Contentconstraint DataKeysets.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            let dataKeySets = sdmxObjects.sdmxObjects.get('CONTENT_CONSTRAINT')[0].dataKeySets;
            let condition = dataKeySets.every(dataKeySet => dataKeySet instanceof DataKeySetObject);
            assert(condition, true);
        });
    });
    context('For SDMX 3.0', function () {
        let format = SDMX_MESSAGE_FORMAT.XML_V300.key;
        let path = "./tests/resources/Structures/SDMX 3.0/";
        it('Tests parsers for Geographic codelists', async () => {
            let xmlMessage = fs.readFileSync(path + 'Geospatial/geospatial_geographiccodelist.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            assert(sdmxObjects.sdmxObjects.get("CODE_LIST")[0] instanceof ItemSchemeObject);
        });
        it('Tests parsers for Geogrid codelists', async () => {
            let xmlMessage = fs.readFileSync(path + 'Geospatial/geospatial_geogridcodelist.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            assert(sdmxObjects.sdmxObjects.get("CODE_LIST")[0] instanceof ItemSchemeObject);
        });
        it('Tests parsers for DSDs', async () => {
            let xmlMessage = fs.readFileSync(path + 'DataStructure EXAMPLE+DSD_NEW_FEATURE+1.0.3.xml', 'utf8');
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            assert(sdmxObjects instanceof SdmxStructureObjects);
            let dsd = sdmxObjects.sdmxObjects.get("DSD")[0];
            let attributes = dsd.getAttributes();
            console.log("Printing attributes");
            for (let attr of attributes) {
                console.log(attr.id, "DIMENSION", attr.getAttributeRelationshipOfType(ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION), attr.hasAttributeRelationshipOfType(ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION));
                console.log(attr.id, "GROUP", attr.getAttributeRelationshipOfType(ATTRIBUTE_RELATIONSHIP_NAMES.GROUP), attr.hasAttributeRelationshipOfType(ATTRIBUTE_RELATIONSHIP_NAMES.GROUP));
                console.log(attr.id, "DATAFLOW", attr.getAttributeRelationshipOfType(ATTRIBUTE_RELATIONSHIP_NAMES.DATAFLOW), attr.hasAttributeRelationshipOfType(ATTRIBUTE_RELATIONSHIP_NAMES.DATAFLOW));
                console.log(attr.id, "OBSERVATION", attr.getAttributeRelationshipOfType(ATTRIBUTE_RELATIONSHIP_NAMES.OBSERVATION), attr.hasAttributeRelationshipOfType(ATTRIBUTE_RELATIONSHIP_NAMES.OBSERVATION));
            }
            console.log("Printing measures");
            for (let m of dsd.getMeasures()) {
                console.log(m);
            }
             console.log("Printing Groups")
             for (let g of dsd.getGroups()) { 
                console.log(JSON.stringify(g));
             }
             
        });
    });
});