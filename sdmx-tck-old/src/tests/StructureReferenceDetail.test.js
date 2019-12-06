import STRUCTURE_REFERENCE_DETAIL from '../constants/StructureReferenceDetail';
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';

describe('Test the STRUCTURE_REFERENCE_DETAIL class', function () {
    it('Test the STRUCTURE_REFERENCE_DETAIL#getSdmxStructureType() function', function () {
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("datastructure")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("metadatastructure")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("categoryscheme")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("conceptscheme")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("codelist")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("hierarchicalcodelist")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("organisationscheme")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("agencyscheme")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("dataproviderscheme")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("dataconsumerscheme")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("organisationunitscheme")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("dataflow")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("metadataflow")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("reportingtaxonomy")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("provisionagreement")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("structureset")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("process")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("categorisation")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("contentconstraint")]).not.toBeUndefined();
        expect(SDMX_STRUCTURE_TYPE[STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType("attachmentconstraint")]).not.toBeUndefined();
    });

    it("Test the STRUCTURE_REFERENCE_DETAIL#getSdmxStructureTypes() function ", function () {
        let structureTypes = STRUCTURE_REFERENCE_DETAIL.getSdmxStructureTypes();
        expect(structureTypes.length > 0).toBe(true);
        expect(structureTypes.length).toBe(20);
        structureTypes.forEach(t => {
            expect(SDMX_STRUCTURE_TYPE[t]).not.toBeUndefined();
        });
    });

    it("Test the STRUCTURE_REFERENCE_DETAIL#isApplicableReference function", function () {
        // CHECK REFERENCE APPLICABILITY FOR DSDs
        expect(STRUCTURE_REFERENCE_DETAIL.isApplicableReference(SDMX_STRUCTURE_TYPE.DSD.key, STRUCTURE_REFERENCE_DETAIL.CATEGORISATION)).toBe(true);
        expect(STRUCTURE_REFERENCE_DETAIL.isApplicableReference(SDMX_STRUCTURE_TYPE.DSD.key, STRUCTURE_REFERENCE_DETAIL.PROCESS)).toBe(true);
        expect(STRUCTURE_REFERENCE_DETAIL.isApplicableReference(SDMX_STRUCTURE_TYPE.DSD.key, STRUCTURE_REFERENCE_DETAIL.CODE_LIST)).toBe(true);
        expect(STRUCTURE_REFERENCE_DETAIL.isApplicableReference(SDMX_STRUCTURE_TYPE.DSD.key, STRUCTURE_REFERENCE_DETAIL.CONCEPT_SCHEME)).toBe(true);
        expect(STRUCTURE_REFERENCE_DETAIL.isApplicableReference(SDMX_STRUCTURE_TYPE.DSD.key, STRUCTURE_REFERENCE_DETAIL.CONTENT_CONSTRAINT)).toBe(true);
        expect(STRUCTURE_REFERENCE_DETAIL.isApplicableReference(SDMX_STRUCTURE_TYPE.DSD.key, STRUCTURE_REFERENCE_DETAIL.DATAFLOW)).toBe(true);
        expect(STRUCTURE_REFERENCE_DETAIL.isApplicableReference(SDMX_STRUCTURE_TYPE.DSD.key, STRUCTURE_REFERENCE_DETAIL.STRUCTURE_SET)).toBe(true);
        expect(STRUCTURE_REFERENCE_DETAIL.isApplicableReference(SDMX_STRUCTURE_TYPE.DSD.key, STRUCTURE_REFERENCE_DETAIL.AGENCY_SCHEME)).toBe(false);     
    });
});