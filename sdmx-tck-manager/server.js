var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
const path = require('path');

var TestsModelBuilder = require('./src/builders/TestsModelBuilder.js');
var TestExecutionManagerFactory = require('./src/manager/TestExecutionManagerFactory.js')
var STRUCTURES_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var XSDTestsDataBuilder = require('./src/builders/schema-queries-builders/XSDTestsDataBuilder.js')
var DataQueriesDataBuilder = require('./src/builders/data-queries-builders/DataQueriesDataBuilder.js')
var RegistrationTestsDataBuilder = require('./src/builders/registry-queries-builders/RegistrationTestsDataBuilder.js')
var SdmxReporter = require('sdmx-tck-reporter').reporter.SdmxReporter
var TestInfo = require('../sdmx-tck-reporter/src/TestInfo.js')
const EXPORT_FORMATS = require('sdmx-tck-api').constants.EXPORT_FORMATS;

var privateKey = fs.readFileSync('self-signed-certificate.key', 'utf8');
var certificate = fs.readFileSync('self-signed-certificate.cert', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var app = express();
app.use(express.json({ limit: '50mb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../sdmx-tck-client/build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../sdmx-tck-client/build', 'index.html'));
});

const configuredTimeout = 120 * 60 * 1000; // 2 hours

var httpServer = http.createServer(app);
httpServer.setTimeout(configuredTimeout);
httpServer.listen(5002, () => {
    console.log("HTTP Server is listening on port: 5002");
});

var httpsServer = https.createServer(credentials, app);
httpsServer.setTimeout(configuredTimeout);
httpsServer.listen(8443, () => {
    console.log("HTTPS Server is listening on port: 8443");
});

app.post("/tck-api/prepare-tests", (req, res) => {
    let payload = req.body;

    let apiVersion = payload.apiVersion;
    let testIndices = payload.testIndices;
    let requestMode = payload.requestMode;

    let tests = TestsModelBuilder.createTestsModel(apiVersion, testIndices, requestMode);
    res.send(JSON.stringify(tests));
});

app.post("/tck-api/configure-schema-tests", async(req, res) => {
    try {
        let configData = {constraintData:undefined,
                        randomData:{
                            datastructure:undefined,
                            dataflow:undefined,
                            provisionagreement:undefined}
        }
        let payload = req.body;
        let endpoint = payload.endpoint;
        let apiVersion = payload.apiVersion;
        let format = payload.format;

        //PREPARE SCHEMA TESTS THAT RELY ON DSDs,DFs,PRAs FOUND AS CONTRAINT CONSTRAINABLES
        configData.constraintData =  await XSDTestsDataBuilder.buildXSDDataFromConstraint(endpoint, apiVersion, format);

        //PREPARE SCHEMA TESTS THAT RELY ON RANDOM DSDs,DFs,PRAs

        //DSD DATA
        configData.randomData.datastructure = await XSDTestsDataBuilder.buildXSDDataWithoutConstraint(STRUCTURES_REST_RESOURCE.datastructure, endpoint, apiVersion, format);

        //DF DATA
        configData.randomData.dataflow = await XSDTestsDataBuilder.buildXSDDataWithoutConstraint(STRUCTURES_REST_RESOURCE.dataflow, endpoint, apiVersion, format);

        //PRA DATA
        configData.randomData.provisionagreement = await XSDTestsDataBuilder.buildXSDDataWithoutConstraint(STRUCTURES_REST_RESOURCE.provisionagreement, endpoint, apiVersion, format);

        res.status(200).json(configData);
    } catch (e) {
        res.status(500).json({ error: `Failed to build prerequisites for schema tests. Cause: ${e}` }); 
    }
});

app.post("/tck-api/configure-data-tests", async(req, res) => {
    try {
        let payload = req.body;
        let endpoint = payload.endpoint;
        let apiVersion = payload.apiVersion;
        let format = payload.format;

        let configData =  await DataQueriesDataBuilder.buildDataQueriesData(endpoint, apiVersion, format);
        res.status(200).json(configData);
    } catch (e) {
        res.status(500).json({ error: `Failed to build prerequisites for data tests. Cause: ${e}` }); 
    }
});

app.post("/tck-api/configure-registration-tests", async (req, res) => {
    try {
        let payload = req.body;
        let endpoint = payload.endpoint;
        let apiVersion = payload.apiVersion;
        let format = payload.format;
    
        let configData = await RegistrationTestsDataBuilder.buildData(endpoint, apiVersion, format);
        res.status(200).json(configData);
    } catch (e) {
        res.status(500).json({ error: `Failed to build prerequisites for registration tests. Cause: ${e}` }); 
    }
});

app.post("/tck-api/execute-test", (req, res) => {
    let payload = req.body;
    let test = payload.test;
    let format = payload.format;
    let endpoint = payload.endpoint;

    TestExecutionManagerFactory.getTestsManager(test.index).executeTest(test, format, endpoint).then(
        (result) => {
            console.log("Test: " + test.testId + " completed.");
            res.send(JSON.stringify(result))
        },
        (error) => {
            console.log("Test: " + test.testId + " failed. Cause: " + error);
            res.send(error)
        });
});

app.post("/tck-api/export-report", async (req, res) => {
    try{
        let payload = req.body;
        let tests = payload.tests;
        let swVersion  = payload.swVersion;
        let apiVersion = payload.apiVersion;
        let wsInfo = payload.wsInfo;
        let format =  payload.format;
        let requestMode = payload.requestMode;
        let reportFormat = payload.reportFormat;
        let scores = payload.scores;

        let contenType ="";
        let filename = ""

        if(EXPORT_FORMATS.XML === reportFormat){
            filename = "SDMX-TCK-Report.xml"
            contenType = 'application/xml'
        }else if(EXPORT_FORMATS.EXCEL === reportFormat){
            filename = "SDMX-TCK-Report.xlsx"
            contenType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }else if(EXPORT_FORMATS.JSON === reportFormat){
            filename = "SDMX-TCK-Report.json"
            contenType = 'application/json'
        }
        res.set('Content-Disposition', 'attachment; filename='+filename);
        res.set('Content-Type', contenType);


        //Init Reporter
        SdmxReporter.init(wsInfo, apiVersion, format, requestMode, swVersion, scores);

        //Record tests
        tests.forEach(t => SdmxReporter.record(TestInfo.fromJSON(t)));

        //Write buffer to res
        res.write(await SdmxReporter.publishReport(reportFormat))
        res.end()
    }catch(error){
        res.status(500).send(error);
    }
 
});