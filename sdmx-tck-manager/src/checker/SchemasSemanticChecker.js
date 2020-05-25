const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
var Utils = require('sdmx-tck-api').utils.Utils;
var SdmxSchemaObjects = require('sdmx-tck-api').model.SdmxSchemaObjects;
var HelperManager = require('../manager/HelperManager.js')
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");

class SchemasSemanticChecker {

    static checkWorkspace(test, preparedRequest, workspace) { 
        return new Promise((resolve, reject) => {
            //var query = preparedRequest;
            try {
                let validation = {};
                if (test.testType === TEST_TYPE.SCHEMA_IDENTIFICATION_PARAMETERS) {
                    validation = SchemasSemanticChecker.checkIdentification(preparedRequest, workspace)
                }
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }

    static checkIdentification (preparedRequest,sdmxObjects){
        if (!Utils.isDefined(preparedRequest)) {
            throw new Error("Missing mandatory parameter 'preparedRequest'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        //1. Check SimpleTypes
        let simpleTypeValidation = SchemasSemanticChecker.checkXSDSimpleTypes(preparedRequest,sdmxObjects)

        //2. Check ComplexTypes
    }

    static async checkXSDSimpleTypes(preparedRequest,sdmxObjects){
        if (!Utils.isDefined(preparedRequest)) {
            throw new Error("Missing mandatory parameter 'preparedRequest'.");
        }
        if (!Utils.isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxSchemaObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        
        //1. Check SimpleTypes with facets
        let simpleTypesWithFacets = sdmxObjects.getSimpleTypesWithFacets();

        let resource;
        let template = {}
        //TODO: Add all the resources (MSD,MDF)
        if(preparedRequest.request.context === SDMX_STRUCTURE_TYPE.DSD.getClass().toLowerCase()){
            resource = SDMX_STRUCTURE_TYPE.DSD.getClass().toLowerCase();
            template.references = STRUCTURE_REFERENCE_DETAIL.NONE;
        }else if(preparedRequest.request.context === SDMX_STRUCTURE_TYPE.DATAFLOW.getClass().toLowerCase()){
            resource = SDMX_STRUCTURE_TYPE.DATAFLOW.getClass().toLowerCase();
            template.references = STRUCTURE_REFERENCE_DETAIL.CHILDREN;
        }else if(preparedRequest.request.context === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.getClass().toLowerCase()){
            resource = SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.getClass().toLowerCase();;
            template.references = STRUCTURE_REFERENCE_DETAIL.DESCENDANTS;
        }

        let helpTestParams = {
            testId: "/"+resource+"/agency/id/version?references="+template.references,
            index: TEST_INDEX.Structure,
            apiVersion: preparedRequest.service.api,
            resource: resource,
            reqTemplate: template,
            identifiers: {structureType:SDMX_STRUCTURE_TYPE.fromRestResource(resource),agency:preparedRequest.request.agency,id:preparedRequest.request.id,version:preparedRequest.request.version},
            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
            subTests: []
        }
        let helpTest = TestObjectBuilder.getTestObject(helpTestParams);
        console.log(helpTest)
        let helpTestWorkspace = await HelperManager.getWorkspace(helpTest,preparedRequest.service.api,preparedRequest.service.url)
        console.log(helpTestWorkspace)
        //2. Check SimpleTypes with enums
    }
}
module.exports = SchemasSemanticChecker;