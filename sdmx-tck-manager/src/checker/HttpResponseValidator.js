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
                let tckStatus = FAILURE_CODE;
                let code = httpResponse != null ? httpResponse.status : void 0;
                if (code === 404 || code === 501 || code === 406) {
                    tckStatus = SUCCESS_CODE;
                }
                resolve({ status: tckStatus, url: httpResponse.url, httpStatus: httpResponse.status, error: err.toString() });
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
        if (response.status !== 406) {
            throw new TckError("Response status was not 406 but " + response.status + " instead");
        }
    }

    static validateOtherHeaders(template,response){
        try{
            if(template.accept_encoding){
                this.checkCompression(response);
            }
            if(template.accept_language){
                this.checkLanguage(response);
            }
            if(template.if_modified_since){
                this.checkCaching(response);
            }
           return { status: SUCCESS_CODE};
        }catch(err){
           return { status: FAILURE_CODE, error: err.toString() };
        }
       
    }
    static checkCompression(response){
        let contentEncoding = response.headers.get('content-encoding')
        if(contentEncoding!=="gzip"){
            throw new TckError("Response 'Content-Encoding' header was not 'gzip'.");
        }
    }

    static checkLanguage(response){
       //TODO:DETERMINE THE VALIDATION
    }

    static checkCaching(response){
        if(response.status !== 304){
            throw new TckError("Response status should have been 304 but it is "+response.status+" instead.");
        }
     }
};

module.exports = HttpResponseValidator;