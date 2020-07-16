const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE
var getResources = require('sdmx-tck-api').constants.getResources
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

class ConstraintDataForXSDTestsBuilder{

   
   static getConstraintDataForXSDTests(toRun,workspace) {
        let dataForXSDTests = {}
        let found = false;
        var j=0;
        if(toRun.testType === TEST_TYPE.PREPARE_SCHEMA_TESTS && toRun.resource === STRUCTURES_REST_RESOURCE.contentconstraint){
            let schemaTestsResources = getResources(TEST_INDEX.Schema)
            let requestedStructureType = workspace.getSdmxObjects().get(SDMX_STRUCTURE_TYPE.fromRestResource(toRun.resource))
            if(requestedStructureType){
                requestedStructureType = requestedStructureType.filter(obj => 
                                                                (obj.type)
                                                                && obj.type ==="Allowed" 
                                                                && Array.isArray(obj.getChildren())
                                                                && obj.getChildren().length>0);
                for(var i in schemaTestsResources){
                    let constraintData = this.getConstraintDataForResource(schemaTestsResources[i],requestedStructureType)
                    if(constraintData){
                        dataForXSDTests[schemaTestsResources[i]] = constraintData
                    }
                }
            }
        }
        return dataForXSDTests
    }

    static getConstraintDataForResource(schemaTestsResource,requestedStructureType){
        for(let j=0;j<requestedStructureType.length;j++){
            let requestedRef = requestedStructureType[j].getRandomRefOfSpecificStructureType(SDMX_STRUCTURE_TYPE.fromRestResource(schemaTestsResource))
            if(requestedRef){
                return {identifiers:requestedRef,constraintParent:requestedStructureType[j]}
            }
        }
        return null;
    }
}

module.exports = ConstraintDataForXSDTestsBuilder