var express = require('express');
const app = express();

var TestsModelBuilder = require('./src/builders/TestsModelBuilder.js');
var TestExecutionManager = require('./src/manager/TestExecutionManager.js');

app.use(express.json())

app.post("/prepare-tests", (req, res) => {
    let payload = req.body;
    
    let apiVersion = payload.apiVersion;
    let testIndices = payload.testIndices;

    let tests = TestsModelBuilder.createTestsModel(apiVersion, testIndices);
    res.send(JSON.stringify(tests));
});

app.post("/execute-test", (req, res) => {
    let payload = req.body;

    let test = payload.test;
    let apiVersion = payload.apiVersion;
    let endpoint = payload.endpoint;

    TestExecutionManager.executeTest(test, apiVersion, endpoint).then(
        (result) => { res.send(JSON.stringify(result)) },
        (error) => { res.send(error) });
});

app.listen(5000, () => {
    console.log("Server is listening on port: 5000");
});