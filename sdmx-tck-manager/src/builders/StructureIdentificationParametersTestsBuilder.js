const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;
const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const ITEM_SCHEME_TYPES = require('sdmx-tck-api').constants.ITEM_SCHEME_TYPES;
const STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
var STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT = require('../constants/TestConstants.js').STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT;
var STRUCTURE_IDENTIFICATION_PARAMETERS = require('sdmx-tck-api').constants.STRUCTURE_IDENTIFICATION_PARAMETERS;
var STRUCTURE_ITEM_QUERIES = require('sdmx-tck-api').constants.STRUCTURE_ITEM_QUERIES;

class StructureIdentificationParametersTestsBuilder{

    static getStructureIdentificationParametersTests(index,x,apiVersion,currentRestResource){
        let structureIdentificationParametersTests = [];
        let testObjParams = {};
        var itemReq = [];

        for (let i in STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT()) {
            let test = STRUCTURES_RESOURCE_IDENTIFICATION_PARAMETERES_SUPPORT()[i]
            x.numOfTests = x.numOfTests + 1;
            
            if (API_VERSIONS[apiVersion] >= API_VERSIONS["v1.3.0"]
                && ITEM_SCHEME_TYPES.hasOwnProperty(SDMX_STRUCTURE_TYPE.fromRestResource(currentRestResource))
                && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url) {
                
                testObjParams = {
                    testId: "/" + currentRestResource + STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.url,
                    index: index,
                    apiVersion: apiVersion,
                    resource: currentRestResource,
                    reqTemplate: STRUCTURE_ITEM_QUERIES.AGENCY_ID_VERSION_ITEM.template,
                    testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                    needsItem:true,
                    requireRandomSdmxObject :true
                }
                itemReq.push(TestObjectBuilder.getTestObject(testObjParams))
                x.numOfTests = x.numOfTests + 1;
                if (currentRestResource === STRUCTURES_REST_RESOURCE.categoryscheme
                && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url) {
                    testObjParams = {
                        testId: "/" + currentRestResource + STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.url,
                        index: index,
                        apiVersion: apiVersion,
                        resource: currentRestResource,
                        reqTemplate: STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.template,
                        testType: TEST_TYPE.STRUCTURE_TARGET_CATEGORY,
                        needsItem:true,
                        requireRandomSdmxObject :true
                    }
                    itemReq.push(TestObjectBuilder.getTestObject(testObjParams))
                    x.numOfTests = x.numOfTests + 1;
                }      
                testObjParams = {
                    testId: "/" + currentRestResource + test.url,
                    index: index,
                    apiVersion: apiVersion,
                    resource: currentRestResource,
                    reqTemplate: test.reqTemplate,
                    testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                    subTests: itemReq,
                    requireRandomSdmxObject : true
                }
                structureIdentificationParametersTests.push(TestObjectBuilder.getTestObject(testObjParams))
                itemReq = [];
            }else if(API_VERSIONS[apiVersion] >= API_VERSIONS["v1.1.0"]
            && currentRestResource === STRUCTURES_REST_RESOURCE.categoryscheme
            && test.url === STRUCTURE_IDENTIFICATION_PARAMETERS.AGENCY_ID_VERSION.url){
                testObjParams = {
                    testId: "/" + currentRestResource + STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.url,
                    index: index,
                    apiVersion: apiVersion,
                    resource: currentRestResource,
                    reqTemplate: STRUCTURE_ITEM_QUERIES.TARGET_CATEGORY.template,
                    testType: TEST_TYPE.STRUCTURE_TARGET_CATEGORY,
                    needsItem:true,
                    requireRandomSdmxObject : true
                }
                itemReq.push(TestObjectBuilder.getTestObject(testObjParams))
                x.numOfTests = x.numOfTests + 1;
                testObjParams = {
                    testId: "/" + currentRestResource + test.url,
                    index: index,
                    apiVersion: apiVersion,
                    resource: currentRestResource,
                    reqTemplate: test.reqTemplate,
                    testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                    subTests: itemReq,
                    requireRandomSdmxObject : true
                }
                structureIdentificationParametersTests.push(TestObjectBuilder.getTestObject(testObjParams))

                itemReq = [];
            
            } else {
                testObjParams = {
                    testId: "/" + currentRestResource + test.url,
                    index: index,
                    apiVersion: apiVersion,
                    resource: currentRestResource,
                    reqTemplate: test.reqTemplate,
                    testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS,
                    requireRandomSdmxObject : true
                }
                structureIdentificationParametersTests.push(TestObjectBuilder.getTestObject(testObjParams))
            }
        };
            return structureIdentificationParametersTests;

        }
}

module.exports = StructureIdentificationParametersTestsBuilder;