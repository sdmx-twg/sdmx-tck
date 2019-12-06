import { SUCCESS_CODE } from './constants/AppConstants'
import TckError from './errors/TckError';
import STRUCTURE_QUERY_REPRESENTATIONS from './constants/StructureQueryRepresentations';
import {checkEmptyRepresentationTestResponse} from  './handlers/helperFunctions';
const sdmx_requestor = require('sdmx-rest');

export default class HttpResponseValidator {
    /**
     * It returns an object with the following format:
     * { httpResponseValidation: { status: status, query: query, httpResponse: httpResponse } }
     * @param {*} query an object that contains the parameters used in the http request.
     * @param {*} httpResponse the http response
     */
    static validateHttpResponse(query, httpResponse) {
        return new Promise((resolve, reject) => {
            try {
                sdmx_requestor.checkStatus(query, httpResponse);
                // TODO + additional checks
                resolve({ httpResponseValidation: { status: SUCCESS_CODE, query: query, httpResponse: httpResponse } });
            } catch (err) {
                reject(new TckError(err));
            }
        });
    };

   
    static validateRepresentation (requestedRepresentation,response){
        return new Promise((resolve, reject) => {
            try {
                if(requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.SDMX_ML_21 
                    || requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.SDMX_JSON_100 ){
                        sdmx_requestor.checkMediaType(requestedRepresentation, response);
                }else if(requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.INVALID_TYPE){
                        checkEmptyRepresentationTestResponse (response)
                }else if(requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.EMPTY){
                        sdmx_requestor.checkMediaType(STRUCTURE_QUERY_REPRESENTATIONS.SDMX_ML_21 , response);
                }else if(requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_ML_21){
                        sdmx_requestor.checkMediaType(STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_ML_21 , response);
                }else if(requestedRepresentation === STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_JSON_100){
                        sdmx_requestor.checkMediaType(STRUCTURE_QUERY_REPRESENTATIONS.WEIGHTED_SDMX_JSON_100 , response);
                }
               resolve('Representation Test successfully validated')
            } catch (err) {
                reject(new TckError(err));
            }
        });
    };
};