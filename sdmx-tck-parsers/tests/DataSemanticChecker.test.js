var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const DataSemanticChecker = require('../../sdmx-tck-manager/src/checker/DataSemanticChecker.js');
var DataRequestPropsBuilder = require('../../sdmx-tck-manager/src/builders/DataRequestPropsBuilder.js')
describe('Tests DataQuery semantic validation in Resource Identification Test', function () {
    it('It should print semantic validation result', async () => {
        
        let test = {} 
        let query = {provider:"ECB+ECB1"}
        let xmlMessage = fs.readFileSync('./tests/resources/DFXmlForDataIdentification.xml','utf8')
        let helperWorkpsace;
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
           test.structureWorkspace = structureWorkspace;
        }).catch(function (err) {
            console.log(err);
        });

        xmlMessage = fs.readFileSync('./tests/resources/dataIdentification.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            DataSemanticChecker.checkResourceIdentification(test,query,sdmxObjects).then(function(result){
                console.log(result)
            })
        }).catch(function (err) {
            console.log(err);
        });
    });
});

describe('Tests DataQuery semantic validation in Extended Resource Identification Test', function () {
    it('It should print semantic validation result', async () => {
       let preparedRequest = { request:
                                { flow: 'ECB,ECB_EXR_SG,1.0',
                                key: 'M.GBP+CHF.EUR',
                                provider: 'all',
                                start: undefined,
                                end: undefined,
                                updatedAfter: undefined,
                                firstNObs: undefined,
                                lastNObs: undefined,
                                obsDimension: undefined,
                                detail: 'serieskeysonly',
                                history: false },
                            service:
                                { id: undefined,
                                name: undefined,
                                url:
                                'https://demo.metadatatechnology.com/FusionRegistry/ws/public/sdmxapi/rest/',
                                api: 'v1.0.0',
                                format: undefined },
                            headers:
                                { headers:
                                { accept: 'application/vnd.sdmx.structurespecificdata+xml;version=2.1',
                                    'user-agent': 'sdmx-rest4js (https://github.com/sosna/sdmx-rest4js)' } } }
        
        let test = { testId: '/data/agency,id,version/DIM1.DIM2..DIMn',
        index: 'Data',
        run: false,
        apiVersion: 'v1.0.0',
        resource: 'dataflow',
        reqTemplate:
         { key: 'Partial Key',
           detail: 'serieskeysonly',
           representation: 'application/vnd.sdmx.structurespecificdata+xml;version=2.1' },
        identifiers:
         { structureType: 'DATAFLOW',
           agency: 'ECB',
           id: 'ECB_EXR_SG',
           version: '1.0' },
        state: 'Waiting',
        failReason: '',
        testType: 'Data Extended Resource Identification Parameters',
        subTests: [],
        requireRandomKey: true,
        providerInfo:
         { structureType: 'DATA_PROVIDER_SCHEME',
           agencyId: 'ECB',
           id: 'DATA_PROVIDERS',
           version: '1.0',
           identifiableIds: [ 'ECB' ] },
        randomKey:
            {FREQ:"M",
            CURRENCY:"GBP",
            CURRENCY_DENOM:"EUR", 
            EXR_TYPE:"SP00",
            EXR_VAR:"E",
            DECIMALS:"5",
            UNIT_MEASURE:"GBP",
            UNIT_MULT:"0",
            COLL_METHOD:"Average of observations through period"},
         
        startTime: '2020-11-19T09:53:39.725Z',
        httpResponseValidation:
         { status: 1,
           url:
            'https://demo.metadatatechnology.com/FusionRegistry/ws/public/sdmxapi/rest/data/ECB,EXR,1.0/A.H7..NRC0.A?detail=serieskeysonly',
           httpStatus: 200 }}
        
        
        let xmlMessage = fs.readFileSync('./tests/resources/dataExtendedIdentificationTest.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            DataSemanticChecker.checkWorkspace(test,preparedRequest,sdmxObjects).then(function(result){
                console.log(result)
            })
        }).catch(function (err) {
            console.log(err);
        });
    });
});

describe('Tests DataQuery semantic validation in Further Describing Results Test', function () {
    it('It should print semantic validation result', async () => {
        
        let query = {detail:"serieskeysonly"} 
        let test = {identifiers:
            { structureType: 'DATAFLOW',
              agency: 'ECB',
              id: 'EXR',
              version: '1.0' }}
        let xmlMessage = fs.readFileSync('./tests/resources/DFXmlForDataFurtherDescribingResults.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
           test.structureWorkspace = structureWorkspace;
        }).catch(function (err) {
            console.log(err);
        });

        xmlMessage = fs.readFileSync('./tests/resources/DataXMLSeriesKeysOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            let result = DataSemanticChecker.checkFurtherDescribingResults(test,query,sdmxObjects)
            console.log(result)
        }).catch(function (err) {
            console.log(err);
        });
    });
});