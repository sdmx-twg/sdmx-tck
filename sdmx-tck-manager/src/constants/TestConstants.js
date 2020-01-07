const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
var STRUCTURE_QUERY_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_QUERY_DETAIL;
var getStructureQueryDetail = require('sdmx-tck-api').constants.getStructureQueryDetail;
var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;

var STRUCTURE_IDENTIFICATION_PARAMETERS = require('./StructureIdentificationParameters.js').STRUCTURE_IDENTIFICATION_PARAMETERS;
var STRUCTURE_QUERY_REPRESENTATIONS = require('./StructureQueryRepresentations.js').STRUCTURE_QUERY_REPRESENTATIONS;
var SCHEMA_IDENTIFICATION_PARAMETERS = require('./SchemaIdentificationParameters.js').SCHEMA_IDENTIFICATION_PARAMETERS;
var SCHEMA_FURTHER_DESCRIBING_RESULTS = require('./SchemaFurtherDescribingResults.js').SCHEMA_FURTHER_DESCRIBING_RESULTS;
/*-----------------------------------------STRUCTURES-----------------------------------------*/

function STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT() {
    let testsArray = [];
    STRUCTURE_IDENTIFICATION_PARAMETERS.getValues().forEach(parameter => {
        testsArray.push({ index: "Structure", url: parameter.url, reqTemplate: parameter.template })
    })
    return testsArray;
};

function STRUCTURE_REFERENCE_PARAMETER_TESTS(restResource) {
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

function STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS(apiVersion) {
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

function STRUCTURES_REPRESENTATIONS_SUPPORT() {
    let testsArray = [];

    STRUCTURE_QUERY_REPRESENTATIONS.getValues().forEach(representation => {
        testsArray.push({ index: "Structure", url: "/agency/id/version (" + representation + ")", reqTemplate: { representation: representation, references: STRUCTURE_REFERENCE_DETAIL.NONE, detail: STRUCTURE_QUERY_DETAIL.ALL_STUBS } })
    });

    return testsArray;
};

/*-----------------------------------------SCHEMAS-----------------------------------------*/
function SCHEMAS_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT() {
    let testsArray = [];
    SCHEMA_IDENTIFICATION_PARAMETERS.getValues().forEach(parameter => {
        testsArray.push({ index: "Schema", url: parameter.url, reqTemplate: parameter.template })
    })
    return testsArray;
};

function SCHEMAS_FOR_FURTHER_DESCRIBING_RESULTS() {
    let testsArray = [];
    SCHEMA_FURTHER_DESCRIBING_RESULTS.getValues().forEach(parameter => {
        testsArray.push({ index: "Schema", url: parameter.url, reqTemplate: parameter.template })
    })
    return testsArray;
};

module.exports = {
    STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT: STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT,
    STRUCTURE_REFERENCE_PARAMETER_TESTS: STRUCTURE_REFERENCE_PARAMETER_TESTS,
    STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS: STRUCTURES_PARAMETERS_FOR_FURTHER_DESCRIBING_THE_RESULTS,
    STRUCTURES_REPRESENTATIONS_SUPPORT: STRUCTURES_REPRESENTATIONS_SUPPORT,
    SCHEMAS_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT:SCHEMAS_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT,
    SCHEMAS_FOR_FURTHER_DESCRIBING_RESULTS,SCHEMAS_FOR_FURTHER_DESCRIBING_RESULTS
};