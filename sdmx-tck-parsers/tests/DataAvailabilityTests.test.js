var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const DataSemanticChecker = require('../../sdmx-tck-manager/src/checker/DataSemanticChecker.js');
var DataRequestPropsBuilder = require('../../sdmx-tck-manager/src/builders/DataRequestPropsBuilder.js')

//PARENT TEST 'ALL'
describe('Tests Data Availability parent test', function () {
    it('It should print semantic validation result', async () => {
                
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityAll.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {reqTemplate:{}}
            let query={}
            //let contentconstraint = sdmxObjects.sdmxObjects.get("CONTENT_CONSTRAINT")
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

describe('Tests Data Availability Temporal coverage tests', function () {
    it('It should print semantic validation result', async () => {
                
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityAll.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {reqTemplate:{}}
            let query={start:"2010-01",end:"2020-01"}
            //let contentconstraint = sdmxObjects.sdmxObjects.get("CONTENT_CONSTRAINT")
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

describe('Tests Data Availability Metric test', function () {
    it('It should print semantic validation result', async () => {
                
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityAll.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {reqTemplate:{}}
            let query={metrics:true}
            //let contentconstraint = sdmxObjects.sdmxObjects.get("CONTENT_CONSTRAINT")
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

