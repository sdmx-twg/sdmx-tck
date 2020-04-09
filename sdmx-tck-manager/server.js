var express = require('express');
const app = express();

var TestsModelBuilder = require('./src/builders/TestsModelBuilder.js');
var TestExecutionManagerFactory = require('./src/manager/TestExecutionManagerFactory.js')
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

app.post("/tck-api/execute-test", (req, res) => {
        let payload = req.body;

        let test = payload.test;
        let apiVersion = payload.apiVersion;
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