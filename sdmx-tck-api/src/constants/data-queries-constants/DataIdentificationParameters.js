const DATA_QUERY_DETAIL = require("./DataQueryDetail.js").DATA_QUERY_DETAIL;
const API_VERSIONS = require('../ApiVersions.js').API_VERSIONS;

const DATA_IDENTIFICATION_PARAMETERS = {
    AGENCY_ID_VERSION:{ url: "/agency,id,version", template: {detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"} },
    AGENCY_ID:{ url: "/agency,id", template: {version:"latest",detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"}  },
    ID:{ url: "/id",template: {agency : "all", version:"latest",detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"}},
    AGENCY_ID_VERSION_ALL_AGENCY_PROVIDERID:{url:"/agency,id,version/all/agency,providerId", template: {providerAgency:true,providerId:true,detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"} },
    AGENCY_ID_VERSION_ALL_PROVIDERID:{ url:"/agency,id,version/all/providerId", template: {providerId:true,detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY,representation:"application/vnd.sdmx.structurespecificdata+xml;version=2.1"} },
    AGENCY_ID_VERSION_ALL_AGENCY_PRVIDERID1_PROVIDERID2:{ url:"/agency,id,version/all/providerId1+providerId2", template: {detail:DATA_QUERY_DETAIL.SERIES_KEYS_ONLY}},

    // getValues() {
    //     let references = Object.values(this).filter((value) => {
    //         return typeof value !== 'function';
    //     });
    //     return references;
    // }
}

function getDataIdentificationParameters(apiVersion) {
    var availableDetailValues = [];
    availableDetailValues.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION);
    availableDetailValues.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID);
    availableDetailValues.push(DATA_IDENTIFICATION_PARAMETERS.ID);
    availableDetailValues.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION_ALL_AGENCY_PROVIDERID)
    availableDetailValues.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION_ALL_PROVIDERID)
    if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]) {
        availableDetailValues.push(DATA_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION_ALL_AGENCY_PRVIDERID1_PROVIDERID2)
        
    }
    return availableDetailValues;
};


module.exports.DATA_IDENTIFICATION_PARAMETERS = Object.freeze(DATA_IDENTIFICATION_PARAMETERS);
module.exports.getDataIdentificationParameters = getDataIdentificationParameters;
