const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const STRUCTURE_QUERY_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_QUERY_DETAIL;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const STRUCTURE_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.STRUCTURE_IDENTIFICATION_PARAMETERS;
const STRUCTURE_QUERY_REPRESENTATIONS = require('sdmx-tck-api').constants.STRUCTURE_QUERY_REPRESENTATIONS;
const SCHEMA_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.SCHEMA_IDENTIFICATION_PARAMETERS;
const SCHEMA_FURTHER_DESCRIBING_PARAMETERS = require('sdmx-tck-api').constants.SCHEMA_FURTHER_DESCRIBING_PARAMETERS;
const DATA_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.DATA_IDENTIFICATION_PARAMETERES;
const DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS;
const DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS = require('sdmx-tck-api').constants.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS;
const DATA_RESPRESENTATION_SUPPORT = require('sdmx-tck-api').constants.DATA_RESPRESENTATION_SUPPORT
const DATA_AVAILABILITY = require('sdmx-tck-api').constants.DATA_AVAILABILITY
const DATA_OTHER_FEATURES = require('sdmx-tck-api').constants.DATA_OTHER_FEATURES
const TEST_REQUEST_MODE = require('sdmx-tck-api').constants.TEST_REQUEST_MODE;
/*-----------------------------------------STRUCTURES-----------------------------------------*/

function STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT() {
    let testsArray = [];
    STRUCTURE_IDENTIFICATION_PARAMETERS.getValues().forEach(parameter => {
        testsArray.push({ index: "Structure", url: parameter.url, reqTemplate: parameter.template })
    })
    return testsArray;
};

function STRUCTURE_REFERENCE_PARAMETER_TESTS(restResource,requestMode,apiVersion) {
    let structureType = SDMX_STRUCTURE_TYPE.fromRestResource(restResource);
    let testsArray = [];
    STRUCTURE_REFERENCE_DETAIL.getStructureReferenceDetail(apiVersion).forEach(reference => {
        let isSpecificStructure = STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(reference);
        let refStructureType = SDMX_STRUCTURE_TYPE.fromRestResource(reference);
        let refStructureIsBasic = SDMX_STRUCTURE_TYPE.isStructureBasic(refStructureType);
        let modeApplicableRef = (requestMode === TEST_REQUEST_MODE.FULL) ||
                                (requestMode === TEST_REQUEST_MODE.BASIC && refStructureIsBasic);
        if (!isSpecificStructure ||
            (isSpecificStructure && STRUCTURE_REFERENCE_DETAIL.isApplicableReference(structureType, reference) && modeApplicableRef)) {
            testsArray.push({ index: "Structure", url: "/agency/id/version?references=" + reference, reqTemplate: { references: reference } });
        }
    });
    return testsArray;
};

function STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion,resource,requestMode) {
    let testsArray = [];

    var detailValues = STRUCTURE_QUERY_DETAIL.getStructureQueryDetail(apiVersion);
    for (let i = 0; i < detailValues.length; i++) {
        if (detailValues[i] === STRUCTURE_QUERY_DETAIL.FULL) {
            STRUCTURE_REFERENCE_DETAIL.getStructureReferenceDetail(apiVersion).forEach(reference => {
                let refStructureType = SDMX_STRUCTURE_TYPE.fromRestResource(reference);
                let refStructureIsBasic = SDMX_STRUCTURE_TYPE.isStructureBasic(refStructureType);
                let modeApplicableRef = (requestMode === TEST_REQUEST_MODE.FULL) ||
                                        (requestMode === TEST_REQUEST_MODE.BASIC && refStructureIsBasic);
                if (modeApplicableRef) {
                    testsArray.push({ index: "Structure", url: "/agency/id/version?detail=" + detailValues[i] + "&references=" + reference, reqTemplate: { references: reference, detail: detailValues[i] } });
                }
            });
        }else if(detailValues[i] === STRUCTURE_QUERY_DETAIL.REFERENCE_PARTIAL){
            if(resource === STRUCTURES_REST_RESOURCE.datastructure || resource === STRUCTURES_REST_RESOURCE.metadatastructure){
                testsArray.push({ index: "Structure", url: "/agency/id/version?detail=" + detailValues[i] + "&references=" + STRUCTURE_REFERENCE_DETAIL.CHILDREN, reqTemplate: { references: STRUCTURE_REFERENCE_DETAIL.CHILDREN, detail: detailValues[i] } });
            }else if(resource === STRUCTURES_REST_RESOURCE.contentconstraint){
                testsArray.push({ index: "Structure", url: "Reference Partial Test for Content Constraint", reqTemplate: { references: STRUCTURE_REFERENCE_DETAIL.DESCENDANTS} });
            }
        }else {
            testsArray.push({ index: "Structure", url: "/agency/id/version?detail=" + detailValues[i] + "&references=" + STRUCTURE_REFERENCE_DETAIL.CHILDREN, reqTemplate: { references: STRUCTURE_REFERENCE_DETAIL.CHILDREN, detail: detailValues[i] } });
        }
    }
    return testsArray;
};

function STRUCTURES_REPRESENTATIONS_SUPPORT(apiVersion) {
    let testsArray = [];

    STRUCTURE_QUERY_REPRESENTATIONS.getStructureQueryRepresentations(apiVersion).forEach(representation => {
        testsArray.push({ index: "Structure", url: "/agency/id/version (" + representation + ")", reqTemplate: { representation: representation, references: STRUCTURE_REFERENCE_DETAIL.NONE, detail: STRUCTURE_QUERY_DETAIL.ALL_STUBS } })
    });

    return testsArray;
};

/*-----------------------------------------SCHEMAS-----------------------------------------*/

function SCHEMA_IDENTIFICATION_PARAMETERS_TESTS() {
    let testsArray = [];

    SCHEMA_IDENTIFICATION_PARAMETERS.getValues().forEach(parameter => {
        testsArray.push({ index: "Schema", url: parameter.url, reqTemplate: parameter.template })
    });

    return testsArray;
};

function SCHEMA_FURTHER_DESCRIBING_PARAMETERS_TESTS() {
    let testsArray = [];

    SCHEMA_FURTHER_DESCRIBING_PARAMETERS.getValues().forEach(parameter => {
        testsArray.push({ index: "Schema", url: parameter.url, reqTemplate: parameter.template })
    });

    return testsArray;
};

/*-----------------------------------------DATA-----------------------------------------*/
function DATA_IDENTIFICATION_PARAMETERS_TESTS(apiVersion){
    let testsArray = [];

    DATA_IDENTIFICATION_PARAMETERS.getDataIdentificationParameters(apiVersion).forEach(parameter => {
        testsArray.push({ index: "Data", url: parameter.url, reqTemplate: parameter.template })
    });

    return testsArray;
    
}

function DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS_TESTS(){
    let testsArray = [];

    DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS.getValues().forEach(parameter => {
        testsArray.push({ index: "Data", url: parameter.url, reqTemplate: parameter.template })
    });

    return testsArray;
}

function DATA_FURTHER_DESCRIBING_RESULTS_TESTS(apiVersion){
    let testsArray = [];

    DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS.getDataFurtherDescribingParameters(apiVersion).forEach(parameter => {
        testsArray.push({ index: "Data", url: parameter.url, reqTemplate: parameter.template })
    });

    return testsArray;
}

function DATA_REPRESENTATION_SUPPORT_TESTS(apiVersion){
    let testsArray = [];

    DATA_RESPRESENTATION_SUPPORT.getDataRepresentationSupportParameters(apiVersion).forEach(parameter => {
        testsArray.push({ index: "Data", url: parameter.url, reqTemplate: parameter.template })
    });

    return testsArray;
}

function DATA_OTHER_FEATURES_TESTS(){
    let testsArray = [];

    DATA_OTHER_FEATURES.getValues().forEach(parameter => {
        testsArray.push({ index: "Data", url: parameter.url, reqTemplate: parameter.template })
    });

    return testsArray;
}

function DATA_AVAILABILITY_TESTS(apiVersion){
    let testsArray = [];

    DATA_AVAILABILITY.getDataAvailabilityParameters(apiVersion).forEach(parameter => {
        testsArray.push({ index: "Data", url: parameter.url, reqTemplate: parameter.template })
    });

    return testsArray;
}
module.exports = {
    STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT: STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT,
    STRUCTURE_REFERENCE_PARAMETER_TESTS: STRUCTURE_REFERENCE_PARAMETER_TESTS,
    STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS: STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS,
    STRUCTURES_REPRESENTATIONS_SUPPORT: STRUCTURES_REPRESENTATIONS_SUPPORT,
    SCHEMA_IDENTIFICATION_PARAMETERS_TESTS:SCHEMA_IDENTIFICATION_PARAMETERS_TESTS,
    SCHEMA_FURTHER_DESCRIBING_PARAMETERS_TESTS:SCHEMA_FURTHER_DESCRIBING_PARAMETERS_TESTS,
    DATA_IDENTIFICATION_PARAMETERS_TESTS:DATA_IDENTIFICATION_PARAMETERS_TESTS,
    DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS_TESTS:DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS_TESTS,
    DATA_FURTHER_DESCRIBING_RESULTS_TESTS:DATA_FURTHER_DESCRIBING_RESULTS_TESTS,
    DATA_REPRESENTATION_SUPPORT_TESTS:DATA_REPRESENTATION_SUPPORT_TESTS,
    DATA_OTHER_FEATURES_TESTS:DATA_OTHER_FEATURES_TESTS,
    DATA_AVAILABILITY_TESTS:DATA_AVAILABILITY_TESTS
};