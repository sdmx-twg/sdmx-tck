const SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var TckError = require('sdmx-tck-api').errors.TckError;
const sdmx_requestor = require('sdmx-rest');
var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;
const DATA_QUERY_REPRESENTATIONS = require('sdmx-tck-api').constants.DATA_QUERY_REPRESENTATIONS;

const STRUCTURE_QUERY_REPRESENTATIONS = require('sdmx-tck-api').constants.STRUCTURE_QUERY_REPRESENTATIONS;


class HttpResponseValidator {
    /**
     * It returns an object with the following format:
     * { status: status, query: query, httpResponse: httpResponse }
     * @param {*} query an object that contains the parameters used in the http request.
     * @param {*} httpResponse the http response
     */
    static validateHttpResponse(query, httpResponse) {
        return new Promise((resolve, reject) => {
            try {
                sdmx_requestor.checkStatus(query, httpResponse);
                // TODO + additional checks
                resolve({ status: SUCCESS_CODE, url: httpResponse.url, httpStatus: httpResponse.status });
            } catch (err) {
                resolve({ status: FAILURE_CODE, url: httpResponse.url, httpStatus: httpResponse.status, error: err.toString() });
            }
        });
    };

    static validateRepresentation(requestedRepresentation, response) {
        return new Promise((resolve, reject) => {
            try {
                if (requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.SDMX_ML_21
                    || requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.SDMX_JSON_100) {
                    sdmx_requestor.checkMediaType(requestedRepresentation, response);
                } else if (requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.INVALID_TYPE) {
                    HttpResponseValidator.checkEmptyRepresentationTestResponse(response)
                } else if (requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.EMPTY) {
                    sdmx_requestor.checkMediaType(STRUCTURE_QUERY_REPRESENTATIONS.SDMX_ML_21, response);
                } else if (requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_ML_21) {
                    sdmx_requestor.checkMediaType(STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_ML_21, response);
                } else if (requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_JSON_100) {
                    sdmx_requestor.checkMediaType(STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_JSON_100, response);
                } else if(requestedRepresentation === DATA_QUERY_REPRESENTATIONS.GENERIC){
                    sdmx_requestor.checkMediaType(DATA_QUERY_REPRESENTATIONS.GENERIC, response);
                }else if(requestedRepresentation === DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC){
                    sdmx_requestor.checkMediaType(DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC, response);
                }else if(requestedRepresentation === DATA_QUERY_REPRESENTATIONS.GENERIC_TIME_SERIES){
                    sdmx_requestor.checkMediaType(DATA_QUERY_REPRESENTATIONS.GENERIC_TIME_SERIES, response);
                }else if(requestedRepresentation === DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC_TIME_SERIES){
                    sdmx_requestor.checkMediaType(DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC_TIME_SERIES, response);
                }else if(requestedRepresentation === DATA_QUERY_REPRESENTATIONS.JSON_1_0_0){
                    sdmx_requestor.checkMediaType(DATA_QUERY_REPRESENTATIONS.JSON_1_0_0, response);
                }else if(requestedRepresentation === DATA_QUERY_REPRESENTATIONS.CSV_1_0_0){
                    sdmx_requestor.checkMediaType(DATA_QUERY_REPRESENTATIONS.CSV_1_0_0, response);
                }
                resolve({ status: SUCCESS_CODE});
            } catch (err) {
                resolve({ status: FAILURE_CODE, error: err.toString() });
            }
        });
    };

    static checkEmptyRepresentationTestResponse(response) {
        if (!isDefined(response) && !response.status) {
            throw new TckError('No response status')
        }
        if (response.status !== "406") {
            throw new TckError("Response status was not 406 but " + response.status + " instead");
        }
    }
};

module.exports = HttpResponseValidator;