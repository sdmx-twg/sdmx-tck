const fs = require('fs');
const assert = require('assert');

const SdmxJsonV20StructuresParser = require('../src/parsers/structure-queries-parsers/SdmxJsonV20StructuresParser.js');
const DataStructureObject = require('sdmx-tck-api/src/model/structure-queries-models/DataStructureObject');
const MaintainableObject = require('sdmx-tck-api/src/model/structure-queries-models/MaintainableObject.js');
const ItemSchemeObject = require('sdmx-tck-api/src/model/structure-queries-models/ItemSchemeObject.js');
const SdmxStructureObjects = require('sdmx-tck-api/src/model/structure-queries-models/SdmxStructureObjects');
const DataflowObject = require('sdmx-tck-api/src/model/structure-queries-models/DataflowObject.js');
const ProvisionAgreementObject = require('sdmx-tck-api/src/model/structure-queries-models/ProvisionAgreementObject.js');
const ContentConstraintObject = require('sdmx-tck-api/src/model/structure-queries-models/ContentConstraintObject.js');
const RegistrationObject = require('sdmx-tck-api/src/model/structure-queries-models/RegistrationObject.js');

describe('Tests JSON 2.0 structure parsers', function () {
    context('For SDMX JSON 2.0', function () {
        let path = "./tests/resources/Structures/JSON 2.0/";

        it('Tests parsers for categorisations', async () => {
            let json = fs.readFileSync(path + 'Categorisation BIS+A104A40CA7B6DB47EF2F89BB8A618F8C9+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("CATEGORISATION")[0] instanceof MaintainableObject);
        });

        it('Tests parsers for Codelists', async () => {
            let json = fs.readFileSync(path + 'Codelist.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("CODE_LIST")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for GeoGraphicCodelists', async () => {
            let json = fs.readFileSync(path + 'GeographicCodelist.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("CODE_LIST")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for GeoGridCodelists', async () => {
            let json = fs.readFileSync(path + 'GeoGridCodelist.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("CODE_LIST")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for AgencySchemes', async () => {
            let json = fs.readFileSync(path + 'AgencyScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("AGENCY_SCHEME")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for DataProviderSchemes', async () => {
            let json = fs.readFileSync(path + 'DataProviderScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("DATA_PROVIDER_SCHEME")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for DataConsumerSchemes', async () => {
            let json = fs.readFileSync(path + 'DataConsumerScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("DATA_CONSUMER_SCHEME")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for OrgansisationUnitScheme', async () => {
            let json = fs.readFileSync(path + 'OrganisationUnitScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("ORGANISATION_UNIT_SCHEME")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for MetadataProvidersScheme', async () => {
            let json = fs.readFileSync(path + 'MetadataProviderScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("METADATA_PROVIDER_SCHEME")[0] instanceof ItemSchemeObject);
        });


        it('Tests parsers for conceptschemes', async () => {
            let json = fs.readFileSync(path + 'ConceptScheme CD2030+CS_CONSOLIDATED_CD2030+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("CONCEPT_SCHEME")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for CategorySchemes', async () => {
            let json = fs.readFileSync(path + 'CategoryScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("CATEGORY_SCHEME")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for datastructures', async () => {
            let json = fs.readFileSync(path + 'DataStructure ESTAT+RAIL_TF_PASSMOV_DSD+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("DSD")[0] instanceof DataStructureObject);
        });
        
        it('Tests parsers for metadatastructures', async () => {
            let json = fs.readFileSync(path + 'Metadatastructure ECB+ECB_METADATA+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("MSD")[0] instanceof MaintainableObject);
        });

        it('Tests parsers for dataflows', async () => {
            let json = fs.readFileSync(path + 'Dataflow ESTAT+ACF_D_LO1+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("DATAFLOW")[0] instanceof DataflowObject);
        });

        it('Tests parsers for metadataflows', async () => {
            let json = fs.readFileSync(path + 'Metadataflow ECB+DATASET_METADATA+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("METADATA_FLOW")[0] instanceof MaintainableObject);
        });

        it('Tests parsers for provision agreement', async () => {
            let json = fs.readFileSync(path + 'Provisionagreement CD2030+CD2030_ALL_CD2030_CD2030+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("PROVISION_AGREEMENT")[0] instanceof ProvisionAgreementObject);
        });

        it.only('Tests parsers for metadata provision agreement', async () => {
            let json = fs.readFileSync(path + 'MetadataProvisionAgreement.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("METADATA_PROVISION_AGREEMENT")[0] instanceof MaintainableObject);
        });

        it('Tests parsers for reporting taxonomy', async () => {
            let json = fs.readFileSync(path + 'ReportingTaxonomy.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("REPORTING_TAXONOMY")[0] instanceof MaintainableObject);
        });
        
        it('Tests parsers for processes', async () => {
            let json = fs.readFileSync(path + 'Process.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("PROCESS")[0] instanceof MaintainableObject);
        });
        
        it('Tests parsers for data constraints', async () => {
            let json = fs.readFileSync(path + 'DataConstraint WB+EDUCATION_CUBE+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("DATA_CONSTRAINT")[0] instanceof ContentConstraintObject);
        });

        it('Tests parsers for metadataconstraints', async () => {
            let json = fs.readFileSync(path + 'MetadataConstraint.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("METADATA_CONSTRAINT")[0] instanceof ContentConstraintObject);
        });
        
        it('Tests parsers for Hierarchies', async () => {
            let json = fs.readFileSync(path + 'Hierarchy METATECH+CURRENCY_HIERARCHY+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("HIERARCHY")[0] instanceof MaintainableObject);
        });
        
        it('Tests parsers for Hierarchy Associations', async () => {
            let json = fs.readFileSync(path + 'HierarchyAssociations.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("HIERARCHY_ASSOCIATION")[0] instanceof MaintainableObject);
        });

        it('Tests parsers for Valuelists', async () => {
            let json = fs.readFileSync(path + 'ValueList.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("VALUE_LIST")[0] instanceof ItemSchemeObject);
        });

        it('Tests parsers for StructureMap', async () => {
            let json = fs.readFileSync(path + 'StructureMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("STRUCTURE_MAP")[0] instanceof MaintainableObject);
        });

        it('Tests parsers for RepresentationMap', async () => {
            let json = fs.readFileSync(path + 'Representationmap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("REPRESENTATION_MAP")[0] instanceof MaintainableObject);
        });
        
        it('Tests parsers for ConceptSchemeMap', async () => {
            let json = fs.readFileSync(path + 'ConceptSchemeMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("CONCEPT_SCHEME_MAP")[0] instanceof MaintainableObject);
        });
    
        it('Tests parsers for CategorySchemeMap', async () => {
            let json = fs.readFileSync(path + 'CategorySchemeMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("CATEGORY_SCHEME_MAP")[0] instanceof MaintainableObject);
        });
    
        it('Tests parsers for OrganisationSchemeMap', async () => {
            let json = fs.readFileSync(path + 'OrganisationSchemeMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("ORGANISATION_SCHEME_MAP")[0] instanceof MaintainableObject);
        });

        it('Tests parsers for ReportingSchemeMap', async () => {
            let json = fs.readFileSync(path + 'ReportingTaxonomyMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let workspace = await SdmxJsonV20StructuresParser.parseMessage(jsonMessage);
            assert(workspace instanceof SdmxStructureObjects);
            assert(workspace.sdmxObjects.get("REPORTING_TAXONOMY_MAP")[0] instanceof MaintainableObject);
        });
    });
});