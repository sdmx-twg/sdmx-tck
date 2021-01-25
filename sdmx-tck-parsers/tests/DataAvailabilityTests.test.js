var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const DataSemanticChecker = require('../../sdmx-tck-manager/src/checker/DataSemanticChecker.js');
const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;

//PARENT TEST 'ALL'
describe('Tests Data Availability parent test', function () {
    it('It should print semantic validation result', async () => {
                
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityAll.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {reqTemplate:{}}
            let query={flow:"ECB,EXR,1.0"}
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
            let query={key:"RON.E.RON.D.NRU1",flow:"ECB,EXR,1.0"}
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
            
            let query={flow:"ECB,EXR,1.0"}
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
            
            let query={component:"EXR_TYPE",flow:"ECB,EXR,1.0"}

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
            let query={start:"2010-01",end:"2020-01",flow:"ECB,EXR,1.0"}
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
            let query={metrics:true,flow:"ECB,EXR,1.0"}
            //let contentconstraint = sdmxObjects.sdmxObjects.get("CONTENT_CONSTRAINT")
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

//COMPLEX KEY TEST 'mode=exact'
describe('Tests Data Availability complex key (exact) test', function () {
    it('It should print semantic validation result', async () => {
                
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityComplexKeyExact.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {reqTemplate:{mode:"exact",key:DATA_QUERY_KEY.MANY_KEYS},randomKeys:[ { CURRENCY: 'RON',
            EXR_SUFFIX: 'E',
            CURRENCY_DENOM: 'RON',
            FREQ: 'D',
            EXR_TYPE: 'NRU1' },
          { CURRENCY: 'EGP',
            EXR_SUFFIX: 'A',
            CURRENCY_DENOM: 'HUF',
            FREQ: 'H',
            EXR_TYPE: 'SP00' } ] }
            let query={key:"RON+EGP.E.RON.D.NRU1",flow:"ECB,EXR,1.0"}
            //let contentconstraint = sdmxObjects.sdmxObjects.get("CONTENT_CONSTRAINT")
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

//SINGLE KEY TEST 'mode=available'
describe('Tests Data Availability complex key (available) test', function () {
    it('It should print semantic validation result', async () => {
        
        parentXmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityAll.xml','utf8')
        let parentObjects = await new SdmxXmlParser().getIMObjects(parentXmlMessage)

        
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilitySimpleKeyAvailable.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {reqTemplate:{mode:"available",key:DATA_QUERY_KEY.MANY_KEYS},parentWorkspace:JSON.parse(JSON.stringify(parentObjects))}
            
            let query={flow:"ECB,EXR,1.0"}
            //let contentconstraint = sdmxObjects.sdmxObjects.get("CONTENT_CONSTRAINT")
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});


//DATA AVAILABILITY REFERENCES DSD TEST
describe('Tests Data Availability referencing DSD', function () {
    it('It should print semantic validation result', async () => {

        dsdXml = fs.readFileSync('./tests/resources/ECB+ECB_EXR1+1.0.xml','utf8')
        let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml)
        let dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0]

        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityRefDSD.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {dsdObj:dsdObj,reqTemplate:{references:"datastructure"}}
            let query={references:"datastructure",flow:"ECB,EXR,1.0"}
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

//DATA AVAILABILITY REFERENCES DF TEST
describe('Tests Data Availability referencing DF', function () {
    it('It should print semantic validation result', async () => {

        dsdXml = fs.readFileSync('./tests/resources/ECB+ECB_EXR1+1.0.xml','utf8')
        let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml)
        let dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0]
        
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityRefDF.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {dsdObj:dsdObj,reqTemplate:{references:"dataflow"}}
            let query={references:"dataflow",flow:"ECB,EXR,1.0"}
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

//DATA AVAILABILITY REFERENCES CODELIST TEST
describe('Tests Data Availability referencing CODELIST', function () {
    it('It should print semantic validation result', async () => {

        dsdXml = fs.readFileSync('./tests/resources/ECB+ECB_EXR1+1.0.xml','utf8')
        let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml)
        let dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0]
        
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityRefCodelist.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {dsdObj:dsdObj,reqTemplate:{references:"codelist"}}
            let query={references:"codelist",flow:"ECB,EXR,1.0"}
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

//DATA AVAILABILITY REFERENCES CONCEPT SCHEME TEST
describe('Tests Data Availability referencing CONCEPT SCHEMES', function () {
    it('It should print semantic validation result', async () => {

        dsdXml = fs.readFileSync('./tests/resources/ECB+ECB_EXR1+1.0.xml','utf8')
        let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml)
        let dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0]
        
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityRefConceptScheme.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {dsdObj:dsdObj,reqTemplate:{references:"conceptscheme"}}
            let query={references:"conceptscheme",flow:"ECB,EXR,1.0"}
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

//DATA AVAILABILITY REFERENCES PROVIDER SCHEME TEST
describe('Tests Data Availability referencing PROVIDER SCHEMES', function () {
    it('It should print semantic validation result', async () => {

        dsdXml = fs.readFileSync('./tests/resources/ECB+ECB_EXR1+1.0.xml','utf8')
        let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml)
        let dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0]
        
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityRefProvScheme.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {dsdObj:dsdObj,reqTemplate:{references:"dataproviderscheme"}}
            let query={references:"dataproviderscheme",flow:"ECB,EXR,1.0",provider:"ECB"}
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

//DATA AVAILABILITY REFERENCES ALL TEST
describe('Tests Data Availability referencing PROVIDER SCHEMES', function () {
    it('It should print semantic validation result', async () => {

        dsdXml = fs.readFileSync('./tests/resources/ECB+ECB_EXR1+1.0.xml','utf8')
        let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml)
        let dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0]
        let providersArr = [{identifiableIds:['ECB']},{identifiableIds:['ECB1']}]
        xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityRefAll.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let test = {dsdObj:dsdObj,reqTemplate:{references:"all"},providerRefs:providersArr}
            let query={references:"all",flow:"ECB,EXR,1.0"}
            let result = DataSemanticChecker.checkDataAvailability(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});