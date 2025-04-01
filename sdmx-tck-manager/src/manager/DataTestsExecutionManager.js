const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
const SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
<<<<<<< HEAD
=======
const STRUCTURE_QUERY_REPRESENTATIONS = require('sdmx-tck-api').constants.STRUCTURE_QUERY_REPRESENTATIONS;
>>>>>>> v4.8.0
const sdmx_requestor = require('sdmx-rest');
const {UrlGenerator} = require('sdmx-rest/lib/utils/url-generator');
const { DATA_QUERY_KEY } = require('sdmx-tck-api/src/constants/data-queries-constants/DataQueryKey');
const SeriesObject = require('sdmx-tck-api').model.SeriesObject;
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var SdmxXmlParser = require('sdmx-tck-parsers').parsers.SdmxXmlParser;
var TckError = require('sdmx-tck-api').errors.TckError;
<<<<<<< HEAD
var DataRequestBuilder = require('../builders/data-queries-builders/DataRequestBuilder.js');
=======
var DataRequestBuilderFactory = require('../builders/data-queries-builders/DataRequestBuilderFactory.js');
>>>>>>> v4.8.0
var ResponseValidator = require('../checker/HttpResponseValidator.js');
var SemanticCheckerFactory = require('../checker/SemanticCheckerFactory.js');
var DataRequestPropsBuilder = require('../builders/data-queries-builders/DataRequestPropsBuilder.js')
var HelperManager = require('../manager/HelperManager.js')
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");

<<<<<<< HEAD

=======
>>>>>>> v4.8.0
class DataTestsExecutionManager {
    static async executeTest(toRun, apiVersion, endpoint) {
        let testResult = toRun;
        try {
            testResult.startTime = new Date();
            console.log("Test: " + toRun.testId + " started on " + testResult.startTime);
            
<<<<<<< HEAD
            //IF NO IDENTIFIERS WERE FOUND IN TESTS THEN ERROR IS THROWN
            if(toRun.identifiers.structureType === "" && toRun.identifiers.agency === "" && toRun.identifiers.id === "" && toRun.identifiers.version === ""){
                throw new TckError("Unable to execute tests because DF identifiers are missing.")
            }

            //THESE TESTS REQUIRE AT LEAST 2 DIMENSIONS IN EVERY SERIES AND A PAIR OF RANDOM KEYS TO PERFORM THE 'DIM1.DIM2.DIM31+DIM32.DIMn' TEST
            if(toRun.reqTemplate.key === DATA_QUERY_KEY.PARTIAL_KEY || toRun.reqTemplate.key === DATA_QUERY_KEY.MANY_KEYS){
                if (!toRun.randomKeys) {
                    throw new TckError("Unable to execute test, no keys found.")
                }
                if(toRun.reqTemplate.key === DATA_QUERY_KEY.MANY_KEYS && toRun.randomKeys.length<2){
                    throw new TckError("There are not enough different keys to perform the 'OR' statement of this test.")
                }
                if(toRun.randomKeys[0] && Object.keys(toRun.randomKeys[0]).length < 2){
=======
            // IF NO IDENTIFIERS WERE FOUND IN TESTS THEN ERROR IS THROWN
            if (toRun.identifiers.structureType === "" && toRun.identifiers.agency === "" && toRun.identifiers.id === "" && toRun.identifiers.version === "") {
                throw new TckError("Unable to execute tests because DF identifiers are missing.")
            }

            // THESE TESTS REQUIRE AT LEAST 2 DIMENSIONS IN EVERY SERIES AND A PAIR OF RANDOM KEYS TO PERFORM THE 'DIM1.DIM2.DIM31+DIM32.DIMn' TEST
            if (toRun.reqTemplate.key === DATA_QUERY_KEY.PARTIAL_KEY || toRun.reqTemplate.key === DATA_QUERY_KEY.MANY_KEYS) {
                if (!toRun.randomKeys) {
                    throw new TckError("Unable to execute test, no keys found.")
                }
                if (toRun.reqTemplate.key === DATA_QUERY_KEY.MANY_KEYS && toRun.randomKeys.length < 2) {
                    throw new TckError("There are not enough different keys to perform the 'OR' statement of this test.")
                }
                if (toRun.randomKeys[0] && Object.keys(toRun.randomKeys[0]).length < 2) {
>>>>>>> v4.8.0
                    throw new TckError("There are not enough dimensions to perform this test.")
                }
            }
            let providerRefs = [];
<<<<<<< HEAD
            let helpTestParams = {
                testId: "/"+toRun.resource+"/agency/id/version?references="+STRUCTURE_REFERENCE_DETAIL.ALL,
                index: TEST_INDEX.Structure,
                apiVersion: apiVersion,
                resource: toRun.resource,
                reqTemplate: {references:STRUCTURE_REFERENCE_DETAIL.ALL},
                identifiers: {structureType:SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource),agency:toRun.identifiers.agency,id:toRun.identifiers.id,version:toRun.identifiers.version},
                testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS
            }
            toRun.structureWorkspace = await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(helpTestParams),apiVersion,endpoint);
        
=======
            let structureFormat = STRUCTURE_QUERY_REPRESENTATIONS.getXMLRepresentation(apiVersion);
            let helpTestParams = {
                index: TEST_INDEX.Structure,
                apiVersion: apiVersion,
                resource: toRun.resource,
                reqTemplate: { references: STRUCTURE_REFERENCE_DETAIL.ALL, representation: structureFormat },
                identifiers: { 
                    structureType: SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource), 
                    agency: toRun.identifiers.agency, 
                    id: toRun.identifiers.id, 
                    version: toRun.identifiers.version 
                },
                testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS
            }
            toRun.structureWorkspace = await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(helpTestParams),apiVersion,endpoint);
            
>>>>>>> v4.8.0
            let provAggreements = toRun.structureWorkspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key)
            
            provAggreements.forEach(pra =>{
                providerRefs.push(pra.getChildren().find(ref=> (ref.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key)))
            })

            toRun.providerRefs = providerRefs;
            
            let dfObj = toRun.structureWorkspace.getSdmxObject(new StructureReference(SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource),toRun.identifiers.agency,toRun.identifiers.id,toRun.identifiers.version));
            if(dfObj){
                let dsdRef = dfObj.getDsdRef()
                if(dsdRef){
                    toRun.dsdObj = toRun.structureWorkspace.getSdmxObject(dsdRef)
                }
            }
            
            if(toRun.indicativeSeries){
                toRun.indicativeSeries = SeriesObject.fromJson(toRun.indicativeSeries)
            }

<<<<<<< HEAD
            let preparedRequest = await DataRequestBuilder.prepareRequest(endpoint, apiVersion,toRun)
=======
            let preparedRequest = await DataRequestBuilderFactory.getBuilder(apiVersion).prepareRequest(endpoint, apiVersion,toRun)
>>>>>>> v4.8.0
            console.log("Test: " + toRun.testId + " HTTP request prepared." + JSON.stringify(preparedRequest));
            
            //Alternative way to pass the url generated as string in order to configure the skipDefaults parameter.
            let url = new UrlGenerator().getUrl(preparedRequest.request, preparedRequest.service, true)
            let httpResponse = await sdmx_requestor.request2(url, preparedRequest.headers);
            //let httpResponse = await sdmx_requestor.request2(preparedRequest.request, preparedRequest.service, preparedRequest.headers);
            console.log("Test: " + toRun.testId + " HTTP response received.");

            //// HTTP RESPONSE VALIDATION ////
            let httpResponseValidation = null;
            httpResponseValidation = await ResponseValidator.validateHttpResponse(preparedRequest.request, httpResponse);
            testResult.httpResponseValidation = httpResponseValidation;
            console.log("Test: " + toRun.testId + " HTTP response validated. " + JSON.stringify(httpResponseValidation));
<<<<<<< HEAD
            if (httpResponseValidation.status === FAILURE_CODE 
                || (httpResponseValidation.status === SUCCESS_CODE && (httpResponseValidation.httpStatus === 404 || httpResponseValidation.httpStatus === 501))) {
=======
            if (httpResponseValidation.status === FAILURE_CODE) {
>>>>>>> v4.8.0
                throw new TckError("HTTP validation failed. Cause: " + httpResponseValidation.error);
            }

            //REPRESENTATION VALIDATION - OTHER FEATURES (HEADERS) VALIDATION
            if (toRun.testType === TEST_TYPE.DATA_REPRESENTATION_SUPPORT_PARAMETERS || toRun.testType === TEST_TYPE.DATA_OTHER_FEATURES) {
                let httpResponseHeadersValidation;
                if(toRun.testType === TEST_TYPE.DATA_REPRESENTATION_SUPPORT_PARAMETERS){
<<<<<<< HEAD
                    httpResponseHeadersValidation = await ResponseValidator.validateRepresentation(toRun.reqTemplate.representation, httpResponse);
=======
                    httpResponseHeadersValidation = await ResponseValidator.validateRepresentation(toRun.reqTemplate.representation, httpResponse, apiVersion);
>>>>>>> v4.8.0
                }else{
                    httpResponseHeadersValidation = ResponseValidator.validateOtherHeaders(toRun.reqTemplate, httpResponse);
                }
                testResult.httpResponseHeadersValidation = httpResponseHeadersValidation;
                if (httpResponseHeadersValidation.status === FAILURE_CODE) {
                    throw new TckError("Response headers validation failed. Cause: " + httpResponseHeadersValidation.error);
                }
                return testResult
            }

<<<<<<< HEAD
            //// WORKSPACE CREATION ////
            let response =await httpResponse.text() 
            let workspace = await new SdmxXmlParser().getIMObjects(response);
            testResult.workspace = workspace;
            console.log("Test: " + toRun.testId + " SDMX workspace created.");
      
=======
            // WORKSPACE CREATION
            let response = await httpResponse.text()
            let workspace = await new SdmxXmlParser().getIMObjects(response, apiVersion);
            if (!workspace) {
                throw new TckError("Workspace validation failed. Cause: The workspace is empty.");
            }
            testResult.workspace = workspace;
            console.log("Test: " + toRun.testId + " SDMX workspace created.");
>>>>>>> v4.8.0

            // WORKSPACE VALIDATION
            let workspaceValidation = await SemanticCheckerFactory.getChecker(toRun).checkWorkspace(toRun, preparedRequest, workspace);
            testResult.workspaceValidation = workspaceValidation;
            if (workspaceValidation.status === FAILURE_CODE) {
                throw new TckError("Workspace validation failed: Cause: " + workspaceValidation.error);
            }

<<<<<<< HEAD
            //RANDOM KEY TO GIVE TO CHILDREN (DATA EXTENDED RESOURCES TESTS)
            if(toRun.testType === TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS && !toRun.requireRandomKey){
                testResult.randomKeys = workspace.getRandomKeysPair(toRun.dsdObj);
            }

            //RANDOM KEY TO GIVE TO CHILDREN (DATA AVAILABILITY TESTS)
            if(toRun.testType === TEST_TYPE.DATA_AVAILABILITY && !toRun.requireRandomKey){
                testResult.randomKeys = workspace.getRandomKeysPairFromAvailableConstraint(toRun.dsdObj);
            }
            
            
=======
            // RANDOM KEY TO GIVE TO CHILDREN (DATA EXTENDED RESOURCES TESTS)
            if (toRun.testType === TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS && !toRun.requireRandomKey) {
                testResult.randomKeys = workspace.getRandomKeysPair(toRun.dsdObj);
            }

            // RANDOM KEY TO GIVE TO CHILDREN (DATA AVAILABILITY TESTS)
            if (toRun.testType === TEST_TYPE.DATA_AVAILABILITY && toRun.isParent === true) {
                //let randomKeysFromConstraint = workspace.getRandomKeysPairFromAvailableConstraint(toRun.dsdObj);
                testResult.randomKeys = toRun.dsdObj.filterDimensions(toRun.indicativeSeriesAttributes);
            }
>>>>>>> v4.8.0
        } catch (err) {
            testResult.failReason = err.toString();
        } finally {
            testResult.endTime = new Date();
            console.log("Test: " + toRun.testId + " completed on " + testResult.endTime);
        }
        return testResult;
    }
};

module.exports = DataTestsExecutionManager;