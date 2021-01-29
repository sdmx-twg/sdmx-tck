var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const fs = require('fs');
const DataSemanticChecker = require('../../sdmx-tck-manager/src/checker/DataSemanticChecker.js');
var DataRequestPropsBuilder = require('../../sdmx-tck-manager/src/builders/DataRequestPropsBuilder.js')
var UrnUtil = require('sdmx-tck-api').utils.UrnUtil

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
        let query = {end:"2017",start:"2003"}
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
        query = {lastNObs:3,start:"2009",end:"2010-Q4"}
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
    });
});