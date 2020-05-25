var express = require('express');
const app = express();

var TestObjectBuilder = require('./src/builders/TestObjectBuilder.js');
var TestsModelBuilder = require('./src/builders/TestsModelBuilder.js');
var TestExecutionManagerFactory = require('./src/manager/TestExecutionManagerFactory.js')
var HelperManager = require('./src/manager/HelperManager.js')
var ConstraintDataForXSDTestsBuilder = require('./src/builders/ConstraintDataForXSDTestsBuilder.js')
var TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
const MetadataReferences = require('sdmx-rest').metadata.MetadataReferences
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;


const server = app.listen(5000, () => {
    console.log("Server is listening on port: 5000");
});

var configuredTimeout = 120 * 60 * 1000; // 2 hours

server.setTimeout(configuredTimeout);

app.use(express.json({ limit: '50mb' }))

app.post("/tck-api/prepare-tests", (req, res) => {
    let payload = req.body;
    
    let apiVersion = payload.apiVersion;
    let testIndices = payload.testIndices;

    let tests = TestsModelBuilder.createTestsModel(apiVersion, testIndices);
    res.send(JSON.stringify(tests));
});

app.post("/tck-api/configure-schema-tests", (req, res) => {
    let payload = req.body;
    let endpoint = payload.endpoint;
    let apiVersion = payload.apiVersion;
    
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

    //gets workspace of all content constraints
    HelperManager.getWorkspace(configObj, apiVersion, endpoint).then(
        (result) => { 
            //sends identifiers from constraint DSD,DF,PRA,MSD,MDF (if found)
            res.send(JSON.stringify(ConstraintDataForXSDTestsBuilder.getConstraintDataForXSDTests(configObj,result))) 
        },
        (error) => { 
            res.send(error) 
        });
});

app.post("/tck-api/execute-test", (req, res) => {
        let payload = req.body;
        let test = payload.test;
        let apiVersion = test.apiVersion;
        //let apiVersion = payload.apiVersion;
        let endpoint = payload.endpoint;

        TestExecutionManagerFactory.getTestsManager(test.index).executeTest(test, apiVersion, endpoint).then(
            (result) => { 
                console.log("Test: " + test.testId + " completed.");
                res.send(JSON.stringify(result)) 
            },
            (error) => { 
                console.log("Test: " + test.testId + " failed. Cause: " + error);
                res.send(error) 
            });
});

app.post("/tck-api/export-report", (req, res) => {
    let payload = req.body;
    let tests = payload.tests;
    
    res.set('Content-Disposition', 'attachment; filename="SDMX-TCK-report.csv"');
    res.set('Content-Type', 'application/csv');

    res.write("Index" + "\t" + "Test Name" + "\t" + "Test Type" + "\t" + "State" + "\t" + "Start Time" + "\t" + "End Time" + "\t" + "URL" + "\t" + "Errors" + "\r\n");
    for (var t in tests) {
        let test = tests[t];
        writeTest(test, res);
        for (var s in test.subTests) {
            let subTest = test.subTests[s];
            writeTest(subTest, res);
        }
    }

    function writeTest(test, res) {
        let url = (test.httpResponseValidation && test.httpResponseValidation.url) ? test.httpResponseValidation.url : "";
        let line = test.index + "\t" + test.testId + "\t" + test.testType + "\t" + test.state + "\t" + test.startTime + "\t" + test.endTime + "\t" + url + "\t" + test.failReason;
        res.write(line + "\r\n");
    }
    res.end();
});