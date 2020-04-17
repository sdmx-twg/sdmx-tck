const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
var StructureRequestBuilder = require('../builders/StructureRequestBuilder.js');
var ResponseValidator = require('../checker/HttpResponseValidator.js');
const sdmx_requestor = require('sdmx-rest');
const {UrlGenerator} = require('sdmx-rest/lib/utils/url-generator')
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE
var getResources = require('sdmx-tck-api').constants.getResources
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;



/*Special class that handles the content constraint reference partial testing*/
class SchemaTestsPreparationReqManager {
    static executeTest(toRun, apiVersion, endpoint) {
        return new Promise((resolve, reject) => {
            StructureRequestBuilder.prepareRequest(endpoint, apiVersion, toRun.resource, toRun.reqTemplate,
                toRun.identifiers.agency, toRun.identifiers.id, toRun.identifiers.version, toRun.items)
                .then((preparedRequest) => {
                    toRun.preparedRequest = preparedRequest;
                    let url = new UrlGenerator().getUrl(preparedRequest.request, preparedRequest.service, true)
                    return sdmx_requestor.request2(url,preparedRequest.headers);
                }).then((httpResponse) => {
                    toRun.httpResponse = httpResponse;
                    return ResponseValidator.validateHttpResponse(toRun.preparedRequest.request, toRun.httpResponse);
                }).then((httpResponseValidation) => {
                    toRun.httpResponseValidation = httpResponseValidation;
                    if (httpResponseValidation.status === FAILURE_CODE) {
                        throw new TckError("HTTP validation failed. Cause: " + httpResponseValidation.error);
                    }
                    return toRun.httpResponse.text();
                }).then((xmlBody) => {
                    return new SdmxXmlParser().getIMObjects(xmlBody);
                }).then((workspace) => {
                    toRun.workspace = workspace.toJSON();
                    resolve(this.getSchemaTestsIdentifiers(toRun,workspace))
                }).catch((err) => {
                    console.log(err)
                    reject(err);
                });
        });
        
    };

    static getSchemaTestsIdentifiers(toRun,workspace) {
        let identifiersForSchemaTestsResources = {}
        if(toRun.testType === TEST_TYPE.PREPARE_SCHEMA_TESTS && toRun.resource === STRUCTURES_REST_RESOURCE.contentconstraint){
            let schemaTestsResources = getResources(TEST_INDEX.Schema)
            let requestedStructureType = workspace.getSdmxObjectType(SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource))
            if(requestedStructureType){
                requestedStructureType = requestedStructureType.filter(obj => (obj.type)&& obj.type ==="Allowed" && Array.isArray(obj.getChildren())&& obj.getChildren().length>0);
                let found = false;
                var j=0;
                for(var i in schemaTestsResources){
                    found = false;
                    j=0; 
                    while(j<requestedStructureType.length && !found){
                        let requestedArtefact = requestedStructureType[j].getRandomChildOfSpecificStructureType(SDMX_STRUCTURE_TYPE.fromRestResource(schemaTestsResources[i]))
                        console.log(requestedArtefact)
                        if(Object.keys(requestedArtefact).length > 0){
                            identifiersForSchemaTestsResources[schemaTestsResources[i]] = requestedArtefact
                            found = true;
                        }
                        j++;
                    }
    
                }
            }
        }
        return identifiersForSchemaTestsResources
    }
};


module.exports = SchemaTestsPreparationReqManager;