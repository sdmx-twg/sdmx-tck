var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const DataSemanticChecker = require('../../sdmx-tck-manager/src/checker/DataSemanticChecker.js');
var DataRequestPropsBuilder = require('../../sdmx-tck-manager/src/builders/DataRequestPropsBuilder.js')
var UrnUtil = require('sdmx-tck-api').utils.UrnUtil
const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;

describe('Tests DataQuery semantic validation in Resource Identification Test', function () {
    it('It should print semantic validation result', async () => {
        let test = {} 
        let query = {provider:"all",flow:"EXR"}
        xmlMessage = fs.readFileSync('./tests/resources/dataIdentification.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkResourceIdentification(test,query,sdmxObjects);
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});
describe('Tests DataQuery semantic validation in Resource Provider Identification Test', function () {
    it('It should print semantic validation result', async () => {
        
        let test = {} 
        let query = {provider:"ECB+ECB1"}
        let xmlMessage = fs.readFileSync('./tests/resources/DFXmlForDataIdentification.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
           test.structureWorkspace = structureWorkspace;
        }).catch(function (err) {
            console.log(err);
        });

        xmlMessage = fs.readFileSync('./tests/resources/dataIdentification.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkResourceIdentification(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

describe('Tests DataQuery semantic validation in Extended Resource Identification Test', function () {
    it('It should print semantic validation result', async () => {        
        let test = {}
        let query = {key: 'ARS..A.SP00.A'}
        let xmlMessage = fs.readFileSync('./tests/resources/dataExtendedIdentificationTest.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
           let result =  DataSemanticChecker._checkExtendedResourceIdentification(test,query,sdmxObjects);
           console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});

describe('Tests DataQuery semantic validation in Further Describing Results Test', function () {
    it('It should print semantic validation result', async () => {
        //START_PERIOD-END_PERIOD
        let query = {end:"2017-Q3",start:"2003"}
        let test = {}
        let xmlMessage = fs.readFileSync('./tests/resources/DataXML.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
            
            let result = DataSemanticChecker._checkFurtherDescribingResults(test,query,structureWorkspace)
            console.log("PERIODS TESTS")
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });

        //FIRST_N_OBSERVATIONS/LAST_N_OBSERVATIONS
        query = {lastNObs:3,start:"2009",end:"2010-10"}
        test = {}

        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
            
            test.indicativeSeries = structureWorkspace.sdmxObjects.get("DATASETS")[0].series[0]
        }).catch(function (err) {
            console.log(err);
        });

        xmlMessage = fs.readFileSync('./tests/resources/DataXMLNObservations.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
            
            let result = DataSemanticChecker._checkFurtherDescribingResults(test,query,structureWorkspace)
            console.log("OBSERVATIONS NUM TESTS")
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });

        //DETAIL TESTS
        query = {detail:"nodata"} 
        test = {identifiers:
            { structureType: 'DATAFLOW',
              agency: 'ECB',
              id: 'EXR',
              version: '1.0' }}
        xmlMessage = fs.readFileSync('./tests/resources/DFXmlForDataFurtherDescribingResults.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
           test.structureWorkspace = structureWorkspace;
        }).catch(function (err) {
            console.log(err);
        });

        xmlMessage = fs.readFileSync('./tests/resources/DataXMLNoData.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkFurtherDescribingResults(test,query,sdmxObjects)
            console.log("DETAIL TESTS")
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });

        //DIMENSION AT OBSERVATION TESTS
        query = {obsDimension:"TIME_PERIOD"} 
        test = {reqTemplate:{dimensionAtObservation:"TIME_PERIOD"}}
        xmlMessage = fs.readFileSync('./tests/resources/ECB_ECB_TRED1_1.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
           test.dsdObj = structureWorkspace.sdmxObjects.get("DSD")[0];
        }).catch(function (err) {
            console.log(err);
        });

        xmlMessage = fs.readFileSync('./tests/resources/ECB_TRD_1_Data.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkFurtherDescribingResults(test,query,sdmxObjects)
            console.log("DIMENSION AT OBSERVATION TESTS")
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });

   
});

 //DATA AVAILABILITY TESTS
    //PARENT TEST 'ALL'
    describe('Tests Data Availability parent test', function () {
        it('It should print semantic validation result', async () => {
                    
            xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilityAll.xml','utf8')
            await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
                let test = {reqTemplate:{}}
                let query={flow:"ECB,EXR,1.0"}
                //let contentconstraint = sdmxObjects.sdmxObjects.get("CONTENT_CONSTRAINT")
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
                console.log(result)
            }).catch(function (err) {
                console.log(err);
            });
        });
    });
    
    //SINGLE KEY TEST 'mode=available'
    describe('Tests Data Availability single key (available) test', function () {
        it('It should print semantic validation result', async () => {
            
            xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilitySimpleKeyAvailable.xml','utf8')
            await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
                let test = {reqTemplate:{mode:"available"},randomKeys:[ { CURRENCY: 'RON',
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
    
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
                console.log(result)
            }).catch(function (err) {
                console.log(err);
            });
        });
    });
    
    //SINGLE KEY TEST 'mode=available'
    describe('Tests Data Availability complex key (available) test', function () {
        it('It should print semantic validation result', async () => {
                    
            xmlMessage = fs.readFileSync('./tests/resources/DataAvailabilitySimpleKeyAvailable.xml','utf8')
            await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
                let test = {reqTemplate:{mode:"available",key:DATA_QUERY_KEY.MANY_KEYS},randomKeys:[ { CURRENCY: 'RON',
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
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
                let result = DataSemanticChecker._checkDataAvailability(test,query,sdmxObjects)
                console.log(result)
            }).catch(function (err) {
                console.log(err);
            });
        });
    });