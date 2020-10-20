var TestObjectBuilder = require('./TestObjectBuilder.js');
var TestsModelBuilder = require('./TestsModelBuilder.js');
var TestExecutionManagerFactory = require('../manager/TestExecutionManagerFactory.js')
var HelperManager = require('../manager/HelperManager.js')
var TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
const MetadataReferences = require('sdmx-rest').metadata.MetadataReferences
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
class DataQueriesDataBuilder {

    /**
     * Returns data for identifiers for each resource in XSD tests as well as the constraint obj from which the data was taken.
     * @param {*} endpoint 
     * @param {*} apiVersion 
     */
    static async buildDataQueriesData (endpoint,apiVersion){
        try{
            //Test obj creation to get all the content constraints 
            let configParams = {
                testId: "/" + STRUCTURES_REST_RESOURCE.provisionagreement + "/all/all/all?detail=full",
                index: TEST_INDEX.Structure,
                apiVersion: apiVersion,
                resource: STRUCTURES_REST_RESOURCE.provisionagreement,
                reqTemplate: { agency: 'all', id: 'all', version: 'all', detail: MetadataDetail.FULL},
                identifiers: { structureType: "", agency: "all", id: "all", version: "all" },
                testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS
            }
            let configObj = TestObjectBuilder.getTestObject(configParams)
            let workspace = await HelperManager.getWorkspace(configObj, apiVersion, endpoint)
            return workspace.getDataForDataQueries()
        }catch(err){
            return;
        }
   
    }
}
module.exports = DataQueriesDataBuilder;