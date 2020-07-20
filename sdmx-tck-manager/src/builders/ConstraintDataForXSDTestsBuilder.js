const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE
var getResources = require('sdmx-tck-api').constants.getResources
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

class ConstraintDataForXSDTestsBuilder{

    /**
     * Returns data (constraint, identifiers) for all resources needed for XSD tests (DSDs,DFs,PRAs)
     * @param {*} toRun the test object.
     * @param {*} workspace the workspace of content constraints
     */
   static getConstraintDataForXSDTests(toRun,workspace) {
        let dataForXSDTests = {}
        if(toRun.testType === TEST_TYPE.PREPARE_SCHEMA_TESTS && toRun.resource === STRUCTURES_REST_RESOURCE.contentconstraint){
            let schemaTestsResources = getResources(TEST_INDEX.Schema)
            let contentconstraints = workspace.getSdmxObjects().get(SDMX_STRUCTURE_TYPE.fromRestResource(STRUCTURES_REST_RESOURCE.contentconstraint))
            if(contentconstraints){
                let validContentconstraints = contentconstraints.filter(constraint => 
                                                                (constraint.getType())
                                                                && constraint.getType() ==="Allowed" 
                                                                && constraint.getChildren().length>0);
                for(var i in schemaTestsResources){
                    let constraintData = this.getConstraintDataForResource(schemaTestsResources[i],validContentconstraints)
                    if(constraintData){
                        dataForXSDTests[schemaTestsResources[i]] = constraintData
                    }
                }
            }
        }
        return dataForXSDTests
    }

    /**
     * Returns data (constraint, identifiers) for eached requested resources needed for XSD tests (DSDs,DFs,PRAs)
     * @param {*} toRun the test object.
     * @param {*} workspace the workspace of content constraints
     */
    static getConstraintDataForResource(schemaTestsResource,validContentconstraints){
        for(let j=0;j<validContentconstraints.length;j++){
            let requestedRef = validContentconstraints[j].getRandomRefOfSpecificStructureType(SDMX_STRUCTURE_TYPE.fromRestResource(schemaTestsResource))
            if(requestedRef){
                return {identifiers:requestedRef,constraintParent:validContentconstraints[j]}
            }
        }
        return null;
    }
}

module.exports = ConstraintDataForXSDTestsBuilder