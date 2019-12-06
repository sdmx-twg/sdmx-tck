import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';

describe('Parse structure class', function () {
    it('t should return the correct structure type', function () {
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("AgencyScheme"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("AttachmentConstraint"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("Categorisation"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("CategoryScheme"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("Codelist"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("ConceptScheme"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("ContentConstraint"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("Dataflow"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("DataStructure"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("HierarchicalCodelist"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("Metadataflow"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("MetadataStructure"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("OrganisationUnitScheme"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("Process"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("ReportingTaxonomy"));
        console.log(SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass("StructureSet"));
    });
});