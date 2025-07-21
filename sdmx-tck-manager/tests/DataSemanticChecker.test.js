var SdmxXmlParser = require('../../sdmx-tck-parsers/src/parsers/SdmxXmlParser.js');
const DataSemanticChecker = require('../../sdmx-tck-manager/src/checker/DataSemanticChecker.js');
const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;
const SDMX_MESSAGE_FORMAT = require('sdmx-tck-api').constants.SDMX_MESSAGE_FORMAT;
var SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;
var SeriesObject = require('sdmx-tck-api').model.SeriesObject;
const fs = require('fs');
const assert = require('assert');

describe('Tests DataQuery semantic validation in Resource Identification Test', function () {
    it('It should assert semantic validation result', async () => {
        let format = SDMX_MESSAGE_FORMAT.XML_V21.key;
        let test = {}
        let query = { provider: "all", flow: "EXR" }
        xmlMessage = fs.readFileSync('./tests/resources/dataIdentification.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkResourceIdentification(test, query, sdmxObjects);
            console.assert(result.status === 1)
        })
    });
});

describe('Tests SDMX3 DataQuery semantic validation in Resource Identification Test', function () {
    it('It should assert semantic validation result', async () => {
        let format = SDMX_MESSAGE_FORMAT.XML_V300.key;
        let test = {};
        //let query = {context: "dataflow=ECB:EXR(*)"} // this requires DataQuery2
        let query = { flow: "EXR" };
        xmlMessage = fs.readFileSync('./tests/resources/dataIdentification_sdmx30.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (sdmxObjects) {
        let result = DataSemanticChecker._checkResourceIdentification(test, query, sdmxObjects);
        console.assert(result.status === 1)
        })
    });
});

describe('Tests DataQuery semantic validation in Resource Provider Identification Test', function () {
    it('It should assert semantic validation result', async () => {
        let format = SDMX_MESSAGE_FORMAT.XML_V21.key;
        let test = {}
        let query = { flow: "ECB,EXR,1.0", provider: "ECB+ECB1" }
        let xmlMessage = fs.readFileSync('./tests/resources/DFXmlForDataIdentification.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (structureWorkspace) {
            test.structureWorkspace = structureWorkspace;
            console.assert(test.structureWorkspace instanceof SdmxStructureObjects)
        })

        xmlMessage = fs.readFileSync('./tests/resources/dataIdentification.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkResourceIdentification(test, query, sdmxObjects)
            console.assert(result.status === 1)
        })
    });
});

//////////////////////////////////////////////////////////////////////////
// Extended Resource Identification Tests
//////////////////////////////////////////////////////////////////////////
describe('Tests Extended Resource Identification Test', function () {
    context('With api version v1.4.0', function () {
        let apiVersion = "v1.4.0";
        let format = SDMX_MESSAGE_FORMAT.XML_V21.key;
        let dsdObj;
        before(async () => {
            let dsdXml = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/ECB_ECB_EXR1_1.0.xml', 'utf8');
            let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml, format);
            dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0];
        });

        it('Tests partial key', async () => {
            let test = {
                apiVersion: apiVersion,
                reqTemplate: {
                    key: DATA_QUERY_KEY.PARTIAL_KEY,
                    keyInPath: true
                },
                dsdObj: dsdObj
            };
            let query = { key: 'Q.H7+H8..NRD0.A' }
            let xmlMessage = fs.readFileSync('./tests/resources/Data Identification/Dataflow ECB_EXR_1.0/SDMX 2.1/DataPartialKey.xml', 'utf8')
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            let result = DataSemanticChecker._checkExtendedResourceIdentification(test, query, sdmxObjects);
            assert.equal(result.status, 1, result.error);
        });
    });

    context('With api version v2.0.0', function () {
        let apiVersion = "v2.0.0";
        let format = SDMX_MESSAGE_FORMAT.XML_V300.key;
        let dsdObj;
        before(async () => {
            let dsdXml = fs.readFileSync('./tests/resources/Data Identification/Dataflow ECB_EXR_1.0/SDMX 3.0/ECB_ECB_EXR1_1.0.xml', 'utf8');
            let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml, format);
            dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0];
        });

        it('Tests partial key', async () => {
            let test = {
                apiVersion: apiVersion,
                reqTemplate: {
                    key: DATA_QUERY_KEY.PARTIAL_KEY,
                    keyInPath: false
                },
                dsdObj: dsdObj
            };
            let filters = [];
            filters.push("FREQ=Q");
            filters.push("CURRENCY=H7,H8");
            //filters.push("CURRENCY_DENOM=HKD,DEM");
            filters.push("EXR_TYPE=NRD0");
            filters.push("EXR_SUFFIX=A");

            let query = { filters: filters, context: "dataflow:ECB=EXR(1.0)" };
            let xmlMessage = fs.readFileSync('./tests/resources/Data Identification/Dataflow ECB_EXR_1.0/SDMX 3.0/DataPartialKey.xml', 'utf8')
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            let result = DataSemanticChecker._checkExtendedResourceIdentification(test, query, sdmxObjects);
            assert.equal(result.status, 1, result.error);
        });
    });

    context('With api version v2.0.0', function () {
        let apiVersion = "v2.0.0";
        let format = SDMX_MESSAGE_FORMAT.XML_V300.key;
        let dsdObj;
        before(async () => {
            let dsdXml = fs.readFileSync('./tests/resources/DataStructure EXAMPLE+DSD_NEW_FEATURE+1.0.3.xml', 'utf8');
            let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml, format);
            dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0];
        });

        it('Tests measures=none', async () => {
            let test = {
                apiVersion: apiVersion,
                reqTemplate: {
                    measures: "all"
                },
                dsdObj: dsdObj
            };
           
            let query = {  context: "dataflow:EXAMPLE=DF_NEW_FEATURE(1.0)" };
            let xmlMessage = fs.readFileSync('./tests/resources/Dataset TC measures=all.xml', 'utf8')
            let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, format);
            let result = DataSemanticChecker._checkFurtherDescribingResults(test, query, sdmxObjects);
            assert.equal(result.status, 1, result.error);
        });
    });
});

describe('Tests DataQuery semantic validation in Further Describing Results Test', function () {
    it.only('It should assert semantic validation result', async () => {
        let format = SDMX_MESSAGE_FORMAT.XML_V21.key;
        //START_PERIOD-END_PERIOD
        let query = { end: "2017-Q3", start: "2003" }
        let test = {}
        let xmlMessage = fs.readFileSync('./tests/resources/DataXML.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (structureWorkspace) {
            let result = DataSemanticChecker._checkFurtherDescribingResults(test, query, structureWorkspace)
            console.assert(result.status === 1)
        })

        //FIRST_N_OBSERVATIONS/LAST_N_OBSERVATIONS
        query = { lastNObs: 3, start: "2009", end: "2010-10" }
        test = {}

        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (structureWorkspace) {

            test.indicativeSeries = structureWorkspace.sdmxObjects.get("DATASETS")[0].series[0]
            console.assert(test.indicativeSeries instanceof SeriesObject)
        })

        xmlMessage = fs.readFileSync('./tests/resources/DataXMLNObservations.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (structureWorkspace) {

            let result = DataSemanticChecker._checkFurtherDescribingResults(test, query, structureWorkspace)
            console.assert(result.status === 1)
        })

        //DETAIL TESTS
        query = { detail: "nodata" }
        test = {
            identifiers:
            {
                structureType: 'DATAFLOW',
                agency: 'ECB',
                id: 'EXR',
                version: '1.0'
            }
        }
        xmlMessage = fs.readFileSync('./tests/resources/DFXmlForDataFurtherDescribingResults.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (structureWorkspace) {
            test.structureWorkspace = structureWorkspace;
            console.assert(test.structureWorkspace instanceof SdmxStructureObjects)
        })

        xmlMessage = fs.readFileSync('./tests/resources/DataXMLNoData.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkFurtherDescribingResults(test, query, sdmxObjects)
            console.assert(result.status === 1)
        })

        //DIMENSION AT OBSERVATION TESTS WITH TIME PERIOD
        query = { obsDimension: "TIME_PERIOD" }
        test = { reqTemplate: { dimensionAtObservation: "TIME_PERIOD" } }

        xmlMessage = fs.readFileSync('./tests/resources/ECB_TRD_1_Data.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkFurtherDescribingResults(test, query, sdmxObjects)
            console.assert(result.status === 1)
        })

        //DIMENSION AT OBSERVATION TESTS WITH DIM
        query = { obsDimension: "FREQ" }
        test = { reqTemplate: { dimensionAtObservation: "Dimension" } }

        xmlMessage = fs.readFileSync('./tests/resources/DataDimenstionAtObservationDimension.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkFurtherDescribingResults(test, query, sdmxObjects)
            console.assert(result.status === 1)
        })

        //DIMENSION AT OBSERVATION TESTS WITH ALL DIMENSIONS
        query = { obsDimension: "AllDimensions" }
        test = { reqTemplate: { dimensionAtObservation: "AllDimensions" } }

        xmlMessage = fs.readFileSync('./tests/resources/DataDimensionAtObservationAllDimensions.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage, format).then(function (sdmxObjects) {
            let result = DataSemanticChecker._checkFurtherDescribingResults(test, query, sdmxObjects)
            console.assert(result.status === 1)
        })
    });
});