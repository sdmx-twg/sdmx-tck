const sdmx_rest = require('sdmx-rest');
const DATA_QUERY_REPRESENTATIONS = require('sdmx-tck-api').constants.DATA_QUERY_REPRESENTATIONS;
var TckError = require('sdmx-tck-api').errors.TckError;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE
var DataRequestPropsBuilder = require('./DataRequestPropsBuilder.js')

class DataRequestBuilder2 {
    static prepareRequest(endpoint, apiVersion, toRun) {
        return new Promise((resolve, reject) => {
            try {
                var service = sdmx_rest.getService({ url: endpoint, api: apiVersion });
                /*
                -- For data queries ______________________________________________________
                context - An SDMX URN-like identifier for the context (default: *=*:*(*))
                key - the "slices" of the cube to be returned, expressed as key (default: *)
                filters - filters on component values
                updatedAfter - returns only what has changed since the supplied timestamp
                firstNObs - the number of observations to be returned, starting from the first observation
                lastNObs - the number of observations to be returned, starting from the last observation
                obsDimension - the dimension attached to the observations
                attributes - the attributes to be returned (default: dsd)
                measures - the measures to be returned: all, none, {measure_id} (default: all)
                history - Include previous versions of the data (default: false)
                
                __ For data availability queries _________________________________________
                context - An SDMX URN-like identifier for the context (default: *=*:*(*))
                key - the "slices" of the cube to be returned, expressed as key (default: *)
                component - the id of the dimension for which to obtain availability information (default: *)
                filters - filters on component values
                updatedAfter - returns only what has changed since the supplied timestamp
                mode - the desired processing mode (default: exact)
                references - the references to be returned (default: none)
                */
                // NOTE: Missing properties: flow, provider, detail, start, end
                var request = {};
                request.context = DataRequestPropsBuilder.getContext(toRun.identifiers, toRun.reqTemplate);
                request.key = DataRequestPropsBuilder.getKey(apiVersion, toRun.randomKeys, toRun.dsdObj, toRun.reqTemplate);
                // Set the id of the dimension for which to obtain availability information
                if (toRun.reqTemplate.component) {
                    request.component = DataRequestPropsBuilder.getComponent(toRun.randomKeys, toRun.reqTemplate)
                }
                request.filters = DataRequestPropsBuilder.getFilters(toRun);
                if (toRun.reqTemplate.updatedAfter === true) {
                    request.updatedAfter = DataRequestPropsBuilder.getUpdateAfterDate(toRun.indicativeSeries, toRun.reqTemplate)
                }
                if (toRun.reqTemplate.firstNObservations === true) {
                    request.firstNObs = DataRequestPropsBuilder.getNumOfFirstNObservations(toRun.indicativeSeries, toRun.reqTemplate);
                }
                if (toRun.reqTemplate.lastNObservations === true) {
                    request.lastNObs = DataRequestPropsBuilder.getNumOfLastNObservations(toRun.indicativeSeries, toRun.reqTemplate);
                }
                if (toRun.reqTemplate.dimensionAtObservation) {
                    request.obsDimension = DataRequestPropsBuilder.getObsDimension(toRun.dsdObj, toRun.reqTemplate);
                }
                if (toRun.reqTemplate.attributes) {
                    if (toRun.reqTemplate.attributes === true) {
                        let randomAttribute = toRun.dsdObj.getRandomAttribute(); 
                        request.attributes = randomAttribute ? randomAttribute.getId() : null;
                    } else {
                        request.attributes = toRun.reqTemplate.attributes;
                    }
                }
                if (toRun.reqTemplate.measures) {
                    if (toRun.reqTemplate.measures === true) {
                        let randomMeasure = toRun.dsdObj.getRandomMeasure(); 
                        request.measures = randomMeasure ? randomMeasure.getId() : null;
                    } else {
                        request.measures = toRun.reqTemplate.measures;
                    }
                }
                if (toRun.reqTemplate.includeHistory === true) {
                    request.history = toRun.reqTemplate.includeHistory;
                }
                // Set resolution mode: exact, available
                if (toRun.reqTemplate.mode) {
                    request.mode = toRun.reqTemplate.mode
                }
                // References to be returned: codelist, datastructure, conceptscheme, dataflow, dataproviderscheme, none, all
                if (toRun.reqTemplate.references) {
                    request.references = toRun.reqTemplate.references
                }

                let headers = {};
                let representation = toRun.reqTemplate.representation;
                if (!representation) {
                    // TODO: Get default XML representation
                    representation = DATA_QUERY_REPRESENTATIONS.STRUCTURE_SPECIFIC;
                }
                headers = { headers: { accept: representation } }

                if (toRun.reqTemplate.accept_encoding) {
                    if (Object.keys(headers).length === 0) {
                        headers = { headers: { "Accept-Encoding": toRun.reqTemplate.accept_encoding } }
                    } else {
                        headers.headers["Accept-Encoding"] = toRun.reqTemplate.accept_encoding
                    }
                }
                if (toRun.reqTemplate.accept_language) {
                    if (Object.keys(headers).length === 0) {
                        headers = { headers: { "Accept-Language": toRun.reqTemplate.accept_language } }
                    } else {
                        headers.headers["Accept-Language"] = toRun.reqTemplate.accept_language
                    }
                }
                if (toRun.reqTemplate.if_modified_since) {
                    if (Object.keys(headers).length === 0) {
                        headers = { headers: { "If-Modified-Since": toRun.reqTemplate.if_modified_since } }
                    } else {
                        headers.headers["If-Modified-Since"] = toRun.reqTemplate.if_modified_since
                    }
                }
                let preparedRequest = (toRun.testType !== TEST_TYPE.DATA_AVAILABILITY) ?
                    { request: sdmx_rest.getDataQuery2(request), service: service, headers: headers } :
                    { request: sdmx_rest.getAvailabilityQuery2(request), service: service, headers: headers };
                resolve(preparedRequest);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }
};

module.exports = DataRequestBuilder2