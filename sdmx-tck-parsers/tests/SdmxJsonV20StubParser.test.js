const fs = require('fs');
const assert = require('assert');

const SdmxJsonV20ForStubsParser = require ("../src/parsers/structure-queries-parsers/SdmxJsonV20ForStubsParser.js");

describe('Tests JSON 2.0 structure parsers', function () {
    context('For SDMX JSON 2.0', function () {
        let path = "./tests/resources/Structures/JSON 2.0/";

        it('Tests Stub parsers for categorisations', async () => {
            let json = fs.readFileSync(path + 'Categorisation BIS+A104A40CA7B6DB47EF2F89BB8A618F8C9+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("CATEGORISATION", jsonMessage.data.categorisations[0]);
            assert (detail === "full");            
        });

        it('Tests Stub parsers for Codelists', async () => {
            let json = fs.readFileSync(path + 'Codelist.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("CODE_LIST",jsonMessage.data.codelists[0]);
            assert (detail === "full");            
        });

        it('Tests Stub parsers for GeoGraphicCodelists', async () => {
            let json = fs.readFileSync(path + 'GeographicCodelist.json', 'utf8');
            let jsonMessage = JSON.parse(json);            
            let detail = await SdmxJsonV20ForStubsParser.getDetail("CODE_LIST",jsonMessage.data.geographicCodelists[0]);
            assert (detail === "full");            
        });

        it('Tests Stub parsers for GeoGridCodelists', async () => {
            let json = fs.readFileSync(path + 'GeoGridCodelist.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("CODE_LIST",jsonMessage.data.geoGridCodelists[0]);
            assert (detail === "full");            
        });

        it('Tests Stub parsers for AgencySchemes', async () => {
            let json = fs.readFileSync(path + 'AgencyScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("AGENCY_SCHEME",jsonMessage.data.agencySchemes[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for DataProviderSchemes', async () => {
            let json = fs.readFileSync(path + 'DataProviderScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("DATA_PROVIDER_SCHEME",jsonMessage.data.dataProviderSchemes[0]);
            assert (detail === "full");            
        });

        it('Tests Stub parsers for DataConsumerSchemes', async () => {
            let json = fs.readFileSync(path + 'DataConsumerScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("DATA_CONSUMER_SCHEME",jsonMessage.data.dataConsumerSchemes[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for OrgansisationUnitScheme', async () => {
            let json = fs.readFileSync(path + 'OrganisationUnitScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("ORGANISATION_UNIT_SCHEME",jsonMessage.data.organisationUnitSchemes[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for MetadataProvidersScheme', async () => {
            let json = fs.readFileSync(path + 'MetadataProviderScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("METADATA_PROVIDER_SCHEME",jsonMessage.data.metadataProviderSchemes[0]);
            assert (detail === "full");
        });


        it('Tests Stub parsers for conceptschemes', async () => {
            let json = fs.readFileSync(path + 'ConceptScheme CD2030+CS_CONSOLIDATED_CD2030+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("CONCEPT_SCHEME",jsonMessage.data.conceptSchemes[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for CategorySchemes', async () => {
            let json = fs.readFileSync(path + 'CategoryScheme.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("CATEGORY_SCHEME",jsonMessage.data.categorySchemes[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for datastructures', async () => {
            let json = fs.readFileSync(path + 'DataStructure ECB+ECB_EXR1_DSD+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("DSD",jsonMessage.data.dataStructures[0]);
            assert (detail === "full");
        });
        
        it('Tests Stub parsers for metadatastructures', async () => {
            let json = fs.readFileSync(path + 'Metadatastructure ECB+ECB_METADATA+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("MSD",jsonMessage.data.metadataStructures[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for dataflows', async () => {
            let json = fs.readFileSync(path + 'Dataflow ESTAT+ACF_D_LO1+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("DATAFLOW",jsonMessage.data.dataflows[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for metadataflows', async () => {
            let json = fs.readFileSync(path + 'Metadataflow ECB+DATASET_METADATA+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("METADATA_FLOW",jsonMessage.data.metadataflows[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for provision agreement', async () => {
            let json = fs.readFileSync(path + 'Provisionagreement CD2030+CD2030_ALL_CD2030_CD2030+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("PROVISION_AGREEMENT",jsonMessage.data.provisionAgreements[0]);
            assert (detail === "full");
        });

        it('Tests parsers for metadata provision agreement', async () => {
            let json = fs.readFileSync(path + 'MetadataProvisionAgreement.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("METADATA_PROVISION_AGREEMENT",jsonMessage.data.metadataProvisionAgreements[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for reporting taxonomy', async () => {
            let json = fs.readFileSync(path + 'ReportingTaxonomy.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("REPORTING_TAXONOMY",jsonMessage.data.reportingTaxonomies[0]);
            assert (detail === "full");
        });
        
        it('Tests Stub parsers for processes', async () => {
            let json = fs.readFileSync(path + 'Process.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("PROCESS",jsonMessage.data.processes[0]);
            assert (detail === "full");
        });
        
        it('Tests Stub parsers for data constraints', async () => {
            let json = fs.readFileSync(path + 'DataConstraint WB+EDUCATION_CUBE+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("DATA_CONSTRAINT",jsonMessage.data.dataConstraints[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for metadataconstraints', async () => {
            let json = fs.readFileSync(path + 'MetadataConstraint.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("METADATA_CONSTRAINT",jsonMessage.data.metadataConstraints[0]);
            assert (detail === "full");
        });
        
        it('Tests Stub parsers for Hierarchies', async () => {
            let json = fs.readFileSync(path + 'Hierarchy METATECH+CURRENCY_HIERARCHY+1.0.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("HIERARCHY",jsonMessage.data.hierarchies[0]);
            assert (detail === "full");
        });
        
        it('Tests Stub parsers for Hierarchy Associations', async () => {
            let json = fs.readFileSync(path + 'HierarchyAssociations.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("HIERARCHY_ASSOCIATION",jsonMessage.data.hierarchyAssociations[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for Valuelists', async () => {
            let json = fs.readFileSync(path + 'ValueList.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("VALUE_LIST",jsonMessage.data.valueLists[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for StructureMap', async () => {
            let json = fs.readFileSync(path + 'StructureMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("STRUCTURE_MAP",jsonMessage.data.structureMaps[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for RepresentationMap', async () => {
            let json = fs.readFileSync(path + 'Representationmap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("REPRESENTATION_MAP",jsonMessage.data.representationMaps[0]);
            assert (detail === "full");
        });
        
        it('Tests Stub parsers for ConceptSchemeMap', async () => {
            let json = fs.readFileSync(path + 'ConceptSchemeMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("CONCEPT_SCHEME_MAP",jsonMessage.data.conceptSchemeMaps[0]);
            assert (detail === "full");
        });
    
        it('Tests Stub parsers for CategorySchemeMap', async () => {
            let json = fs.readFileSync(path + 'CategorySchemeMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("CATEGORY_SCHEME_MAP",jsonMessage.data.categorySchemeMaps[0]);
            assert (detail === "full");
        });
    
        it('Tests parsers for OrganisationSchemeMap', async () => {
            let json = fs.readFileSync(path + 'OrganisationSchemeMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("ORGANISATION_SCHEME_MAP",jsonMessage.data.organisationSchemeMaps[0]);
            assert (detail === "full");
        });

        it('Tests Stub parsers for ReportingTaxonomyMap', async () => {
            let json = fs.readFileSync(path + 'ReportingTaxonomyMap.json', 'utf8');
            let jsonMessage = JSON.parse(json);
            let detail = await SdmxJsonV20ForStubsParser.getDetail("REPORTING_TAXONOMY_MAP",jsonMessage.data.reportingTaxonomyMaps[0]);
            assert (detail === "full");
        });
    });
});