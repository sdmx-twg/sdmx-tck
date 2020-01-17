
var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;

var SemanticError = require('sdmx-tck-api').errors.SemanticError;


const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const STRUCTURE_QUERY_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_QUERY_DETAIL;

var SdmxObjects = require('sdmx-tck-api').model.SdmxObjects;
var StructureReference = require('sdmx-tck-api').model.StructureReference;

var Utils = require('sdmx-tck-api').utils.Utils;

var TckError = require('sdmx-tck-api').errors.TckError;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
var SpecialManager = require("../manager/SpecialManager.js");


class SpecialReferencePartialChecker {
    static checkWorkspace(test, workspace) {
        return new Promise((resolve, reject) => {
            try {
                let validation = SpecialReferencePartialChecker.referencePartialTestingProcedure(test,workspace);
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    };

    static referencePartialTestingProcedure(test,sdmxObjects){
        if(test.parentData && test.parentData.child){
           
            let t = SpecialReferencePartialChecker.createTestForChild(test,sdmxObjects);
            // SpecialManager.executeTest(t, test.apiVersion, "https://registry.sdmx.org/ws/public/sdmxapi/rest/").then(
            //         (result) => { console.log(result)},
            //         (error) => { console.log(error)});
            
        }
        
    }
    //Pick a random keyValue from a cubeRegion of the constraint
    static getRandomKeyValue(test){
        let randomKeyValue = {};
        let cubeRegionIndex =0;
        let keyValueIndex =0; 
        if(test.parentData.cubeRegion.length !== 0){
            cubeRegionIndex = Math.floor(Math.random() * test.parentData.cubeRegion.length);
        }
        if(test.parentData.cubeRegion[cubeRegionIndex].KeyValue.length !==0){
            keyValueIndex = Math.floor(Math.random() * test.parentData.cubeRegion[cubeRegionIndex].KeyValue.length);
        }
        
        randomKeyValue = test.parentData.cubeRegion[cubeRegionIndex].KeyValue[keyValueIndex];
        return randomKeyValue;
    }
    static createTestForChild(test,sdmxObjects){
        let resource = "";
        let references = "";
        if(test.parentData.child.structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key){
            let structureList = sdmxObjects.getSdmxObjectsWithCriteria(test.parentData.child.structureType,test.parentData.child.agency,test.parentData.child.id,test.parentData.child.version)
            let structureRef = new StructureReference(test.parentData.child.structureType, structureList[0].agencyId, structureList[0].id, structureList[0].version);
            let dsdList = sdmxObjects.getChildren(structureRef)

            let selectedkeyValue = SpecialReferencePartialChecker.getRandomKeyValue(test)
            console.log(selectedkeyValue)
            // console.log(test)
        }else if(test.parentData.child.structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key){
             resource = "provisionagreement";
             references = {references:"descendants"}

        }else if(test.parentData.child.structureType === SDMX_STRUCTURE_TYPE.DSD.key){
            let dsdList = sdmxObjects.getSdmxObjectsWithCriteria(test.parentData.child.structureType,test.parentData.child.agency,test.parentData.child.id,test.parentData.child.version)

        }
        
        let findDSD = {
            testId: "/"+resource+"/agency/id/version?references="+references.references,
            index: test.index,
            run: false,
            apiVersion: test.apiVersion,
            resource: resource,
            requireRandomSdmxObject: true,
            reqTemplate: references,
            identifiers: {structureType:test.parentData.child.structureType,agency:test.parentData.child.agency,id:test.parentData.child.id,version:test.parentData.child.version},
            state: TEST_STATE.WAITING,
            failReason: "",
            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
            subTests: []
        }

        return findDSD;
    }
};


module.exports = SpecialReferencePartialChecker;