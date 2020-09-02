var TestObjectBuilder = require('./TestObjectBuilder.js');
var TestsModelBuilder = require('./TestsModelBuilder.js');
var TestExecutionManagerFactory = require('../manager/TestExecutionManagerFactory.js')
var HelperManager = require('../manager/HelperManager.js')
var TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
const MetadataReferences = require('sdmx-rest').metadata.MetadataReferences
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
class XSDTestsDataBuilder {

    /**
     * Returns data for identifiers for each resource in XSD tests as well as the constraint obj from which the data was taken.
     * @param {*} endpoint 
     * @param {*} apiVersion 
     */
    static async buildXSDDataFromConstraint (endpoint,apiVersion){
        try{
            //Test obj creation to get all the content constraints 
            let configParams = {
                testId: "/" + STRUCTURES_REST_RESOURCE.contentconstraint + "/all/all/all?detail=full",
                index: TEST_INDEX.Structure,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.contentconstraint,
                reqTemplate: { agency: 'all', id: 'all', version: 'all', detail: MetadataDetail.FULL},
                identifiers: { structureType: "", agency: "all", id: "all", version: "all" },
                testType: TEST_TYPE.PREPARE_SCHEMA_TESTS
            }
            let configObj = TestObjectBuilder.getTestObject(configParams)
            let workspace = await HelperManager.getWorkspace(configObj, apiVersion, endpoint)
            return workspace.getConstraintDataForXSDTests()
        }catch(err){
            return;
        }
   
    }
    
    /**
     * Returns a refernece from the resource requested (dsd,df,pra).If the resource references a dsd with a measure dimension then its ref is returned
     * ,in any other case the ref returned is random.
     * @param {*} resource 
     * @param {*} endpoint 
     * @param {*} apiVersion 
     */
    static async buildXSDDataWithoutConstraint (resource,endpoint,apiVersion){
        try{
            let references = MetadataReferences.NONE;
            if(resource === STRUCTURES_REST_RESOURCE.dataflow){
                references = MetadataReferences.CHILDREN
            }else if (resource === STRUCTURES_REST_RESOURCE.provisionagreement){
                references = MetadataReferences.DESCENDANTS;
            }
            //Test obj creation to get all the content constraints 
            let configParams = {
                testId: "/" + resource + "/all/all/all?detail=full",
                index: TEST_INDEX.Structure,
                apiVersion: apiVersion,
                resource: resource,
                reqTemplate: { agency: 'all', id: 'all', version: 'all', references:references,detail: MetadataDetail.FULL},
                identifiers: { structureType: "", agency: "all", id: "all", version: "all" },
                testType: TEST_TYPE.PREPARE_SCHEMA_TESTS
            }
            let configObj = TestObjectBuilder.getTestObject(configParams)
            let workspace = await HelperManager.getWorkspace(configObj, apiVersion, endpoint)
            return workspace.getNonConstraintDataForXSDTests(resource)
        }catch(err){
            return;
        }
   
    }
}
module.exports = XSDTestsDataBuilder;