var express = require('express');
const app = express();

var TestsModelBuilder = require('./src/builders/TestsModelBuilder.js');
var TestExecutionManager = require('./src/manager/TestExecutionManager.js');

app.get("/prepare-tests", (req, res) => {
    let apiVersion = req.query.apiVersion;

    let tests = TestsModelBuilder.createTestsModel(apiVersion);
    res.send(JSON.stringify(tests));
});

app.get("/execute-test", (req, res) => {
    let test = JSON.parse(req.query.test);
    let apiVersion = req.query.apiVersion;
    let endpoint = req.query.endpoint;

    let result = TestExecutionManager.executeTest(test, apiVersion, endpoint);
    console.log(result);
    res.send(result);
});

app.listen(5000, () => {
    console.log("Server is listening on port: 5000");
});