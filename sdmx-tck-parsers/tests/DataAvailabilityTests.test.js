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

//SINGLE KEY TEST 'mode=exact'
describe('Tests Data Availability single key (exact) test', function () {
    it('It should print semantic validation result', async () => {
                
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilitySimpleKeyExact.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {reqTemplate:{mode:"exact"},randomKeys:[ { CURRENCY: 'RON',
            EXR_SUFFIX: 'E',
            CURRENCY_DENOM: 'RON',
            FREQ: 'D',
            EXR_TYPE: 'NRU1' },
          { CURRENCY: 'EGP',
            EXR_SUFFIX: 'A',
            CURRENCY_DENOM: 'HUF',
            FREQ: 'H',
            EXR_TYPE: 'SP00' } ] }
            let query={key:"RON.E.RON.D.NRU1"}
            //let contentconstraint = sdmxObjects.sdmxObjects.get("CONTENT_CONSTRAINT")
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

//SINGLE KEY TEST 'mode=available'
describe('Tests Data Availability single key (available) test', function () {
    it('It should print semantic validation result', async () => {
        
        parentXmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityAll.xml','utf8')
        let parentObjects = await new SdmxXmlParser().getIMObjects(parentXmlMessage)

        
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilitySimpleKeyAvailable.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {reqTemplate:{mode:"available"},parentWorkspace:JSON.parse(JSON.stringify(parentObjects))}
            
            let query={}
            //let contentconstraint = sdmxObjects.sdmxObjects.get("CONTENT_CONSTRAINT")
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

//SINGLE DIMENSION TEST
describe('Tests Data Availability single dimension test', function () {
    it('It should print semantic validation result', async () => {
        
        parentXmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityAll.xml','utf8')
        let parentObjects = await new SdmxXmlParser().getIMObjects(parentXmlMessage)


        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilitySingleDimension.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {reqTemplate:{component:true},parentWorkspace:JSON.parse(JSON.stringify(parentObjects))}
            
            let query={component:"EXR_TYPE"}

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

