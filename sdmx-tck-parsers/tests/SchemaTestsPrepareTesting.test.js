var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE
var getResources = require('sdmx-tck-api').constants.getResources
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

const fs = require('fs');
describe('Tests if reference partial testing works with different xml inputs', function () {
    it('It should return the validation result', async () => {
        let xmlMessage = fs.readFileSync('./tests/resources/contentconstraint.xml', 'utf8');
        // let test={};
        // let preparedRequest = 
        // {   service:
        //     { id: undefined,
        //       name: undefined,
        //       url: 'https://registry.sdmx.org/ws/public/sdmxapi/rest/',
        //       api: 'v1.4.0',
        //       format: undefined }
        //   }
        //var test = {testType:"Structure Target Category",preparedRequest:{request:{resource:"categoryscheme",agency:"SDMX",id:"STAT_SUBJECT_MATTER",version:"1.0",detail:"full",references:"parentsandsiblings",item:"DEMO_SOCIAL_STAT"}}}
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (workspace) {
            let identifiersForSchemaTestsResources = {}
            let schemaTestsResources = getResources(TEST_INDEX.Schema)
            let requestedStructureType = workspace.getSdmxObjectType(SDMX_STRUCTURE_TYPE.fromRestResource("contentconstraint"))
            if(requestedStructureType){
                requestedStructureType = requestedStructureType.filter(obj => (obj.type)&& obj.type ==="Allowed" && Array.isArray(obj.getChildren())&& obj.getChildren().length>0);
                let found = false;
                var j=0;
                for(var i in schemaTestsResources){
                    console.log("search for new resource")
                    found = false;
                    j=0; 
                    while(j<requestedStructureType.length && !found){
                        let requestedArtefact = requestedStructureType[j].getRandomChildOfSpecificStructureType(SDMX_STRUCTURE_TYPE.fromRestResource(schemaTestsResources[i]))
                        console.log(requestedArtefact)
                        if(Object.keys(requestedArtefact).length > 0){
                            console.log("Enter object full")
                            identifiersForSchemaTestsResources[schemaTestsResources[i]] = requestedArtefact
                            console.log("obj now"+identifiersForSchemaTestsResources.datastructure)
                            found = true;
                        }
                        j++;
                    }
    
                }
            }
           
            console.log(identifiersForSchemaTestsResources)
        })
    });
});