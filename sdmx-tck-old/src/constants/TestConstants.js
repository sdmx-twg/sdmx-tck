import STRUCTURE_REFERENCE_DETAIL from './StructureReferenceDetail';
import STRUCTURE_IDENTIFICATION_PARAMETERS from './StructureIdentificationParameters'
import { STRUCTURE_QUERY_DETAIL, getStructureQueryDetail } from './StructureQueryDetail';
import STRUCTURE_QUERY_REPRESENTATIONS from './StructureQueryRepresentations';
import SDMX_STRUCTURE_TYPE from './SdmxStructureType';

export function STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT (){

      let testsArray = [];
      STRUCTURE_IDENTIFICATION_PARAMETERS.getValues().forEach(parameter =>{
          testsArray.push({index:"Structure",url:parameter.url,reqTemplate:parameter.template})
      })  
    return testsArray;
};

export function STRUCTURE_REFERENCE_PARAMETER_TESTS(restResource) {
    let structureType = SDMX_STRUCTURE_TYPE.fromRestResource(restResource);
    let testsArray = [];
    STRUCTURE_REFERENCE_DETAIL.getValues().forEach(reference => {
        let isSpecificStructure = STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(reference);
        if (!isSpecificStructure ||
            (isSpecificStructure && STRUCTURE_REFERENCE_DETAIL.isApplicableReference(structureType, reference))) {
            testsArray.push({ index: "Structure", url: "/agency/id/version?references=" + reference, reqTemplate: { references: reference } });
        }
    });
    return testsArray;
};

export function STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion) {
    let testsArray = [];

    var detailValues = getStructureQueryDetail(apiVersion);
    for (let i = 0; i < detailValues.length; i++) {
        if (detailValues[i] === STRUCTURE_QUERY_DETAIL.FULL) {
            STRUCTURE_REFERENCE_DETAIL.getValues().forEach(reference => {
                testsArray.push({ index: "Structure", url: "/agency/id/version?detail=" + detailValues[i] + "&references=" + reference, reqTemplate: { references: reference, detail: detailValues[i] } });
            });
        } else {
            testsArray.push({ index: "Structure", url: "/agency/id/version?detail=" + detailValues[i] + "&references=" + STRUCTURE_REFERENCE_DETAIL.CHILDREN, reqTemplate: { references: STRUCTURE_REFERENCE_DETAIL.CHILDREN, detail: detailValues[i] } });
        }
    }
    return testsArray;
};

export function STRUCTURES_REPRESENTATIONS_SUPPORT() {
    let testsArray = [];

    STRUCTURE_QUERY_REPRESENTATIONS.getValues().forEach(representation => {
        testsArray.push({ index: "Structure", url: "/agency/id/version (" + representation + ")", reqTemplate: { representation: representation, references: STRUCTURE_REFERENCE_DETAIL.NONE, detail: STRUCTURE_QUERY_DETAIL.ALL_STUBS } })
    });

    return testsArray;
};