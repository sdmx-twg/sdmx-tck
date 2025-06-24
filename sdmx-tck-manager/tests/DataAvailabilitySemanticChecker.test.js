var SdmxXmlParser = require('sdmx-tck-parsers/src/parsers/SdmxXmlParser.js');
const DataSemanticChecker = require('../src/checker/DataSemanticChecker.js');
const fs = require("fs");
const assert = require("assert");

describe('Tests data availability tests', function () {
    context('With api version v1.4.0', function () {
        let apiVersion = "v1.4.0";
        describe('Tests parent test', function () {
            it('It should assert semantic validation result', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityAll.xml', 'utf8')
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    resource: "dataflow",
                    reqTemplate: {},
                    isParent: true
                };
                let query = {
                    flow: "ECB,EXR,1.0"
                };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1);
            });
        });

        describe('Tests mode parameter (exact, available)', async function () {
            let dsdObj;
            before(async () => {
                let dsdXml = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/ECB_ECB_EXR1_1.0.xml', 'utf8');
                let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml, apiVersion);
                dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0];
            });

            it('Tests single key (mode=exact)', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilitySingleKeyExact.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: { mode: "exact", keyInPath: true },
                    dsdObj: dsdObj
                };
                let query = { key: "Q.H42.HKD.NRC0.T", flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests single key (mode=available)', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilitySingleKeyAvailable.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: { mode: "available", keyInPath: true },
                    dsdObj: dsdObj
                };
                let query = { key: "Q.H42.HKD.NRC0.T", flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests complex key (mode=exact)', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityComplexKeyExact.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: { mode: "exact", keyInPath: true },
                    dsdObj: dsdObj
                };
                let query = { key: "Q+M.H42+H7.HKD+DEM.NRC0.T+A", flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests complex key (mode=available)', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityComplexKeyAvailable.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: { mode: "available", keyInPath: true },
                    dsdObj: dsdObj
                };
                let query = { key: "Q+M.H42+H7.HKD+DEM.NRC0.T+A", flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });
        });

        describe('Tests temporal coverage (start, end period)', function () {
            it('Tests startPeriod & without endPeriod parameter', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        startPeriod: "2010-01"
                    }
                };
                let query = { flow: "ECB,EXR,1.0" }
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects)
                assert.equal(result.status, 1, result.error);
            });

            it('Tests endPeriod without startPeriod parameter', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        endPeriod: "2020-01"
                    }
                };
                let query = { flow: "ECB,EXR,1.0" }
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects)
                assert.equal(result.status, 1, result.error);
            });

            it('Tests startPeriod & endPeriod parameter', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        startPeriod: "2010-01",
                        endPeriod: "2020-01"
                    }
                };
                let query = { flow: "ECB,EXR,1.0" }
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects)
                assert.equal(result.status, 1, result.error);
            });
        });

        describe('Tests single dimension', function () {
            it('Tests component=FREQ parameter', async () => {
                let parentXmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityAll.xml', 'utf8');
                let parentObjects = await new SdmxXmlParser().getIMObjects(parentXmlMessage, apiVersion);

                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilitySingleDimension.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        component: true
                    },
                    parentWorkspace: JSON.parse(JSON.stringify(parentObjects))
                };
                let query = { component: "FREQ", flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });
        });

        describe('Tests metrics', function () {
            it('Tests metrics', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        metrics: true
                    }
                };
                let query = { flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });
        });

        describe('Tests references', function () {
            let dsdObj;
            before(async () => {
                let dsdXml = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/ECB_ECB_EXR1_1.0.xml', 'utf8');
                let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml, apiVersion);
                dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0];
            });

            it('Tests referencing datastructure', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityRefDatastructure.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: {
                        references: "datastructure"
                    }
                };
                let query = { flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing dataflow', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityRefDataflow.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "dataflow" }
                };
                let query = { flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing codelist', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityRefCodelist.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "codelist" }
                };
                let query = { flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing concept schemes', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityRefConceptScheme.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "conceptscheme" }
                };
                let query = { flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing data provider schemes', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityRefDataProviderScheme.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "dataproviderscheme" }
                };
                let query = { flow: "ECB,EXR,1.0", provider: "ECB" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing all', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 2.1/DataAvailabilityRefAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "all" },
                    providerRefs: [
                        { identifiableIds: ['ECB'] },
                        { identifiableIds: ['ECB1'] }
                    ]
                };
                let query = { flow: "ECB,EXR,1.0" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });
        });
    });

    context('With api version v2.0.0', function () {
        let apiVersion = "v2.0.0";
        describe('Tests parent test', function () {
            it('It should assert semantic validation result', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityAll.xml', 'utf8')
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    resource: "dataflow",
                    reqTemplate: {},
                    isParent: true
                };
                let query = {
                    context: "dataflow:ECB=EXR(1.0)"
                };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1);
            });
        });

        describe('Tests mode parameter (exact, available)', async function () {
            let dsdObj;
            before(async () => {
                let dsdXml = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/ECB_ECB_EXR1_1.0.xml', 'utf8');
                let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml, apiVersion);
                dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0];
            });

            it('Tests single key (mode=exact)', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilitySingleKeyExact.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: { mode: "exact", keyInPath: true },
                    dsdObj: dsdObj
                };
                let query = { key: "Q.H42.HKD.NRC0.T", context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests single key (mode=available)', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilitySingleKeyAvailable.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: { mode: "available", keyInPath: true },
                    dsdObj: dsdObj
                };
                let query = { key: "Q.H42.HKD.NRC0.T", context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests complex key (mode=exact)', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityComplexKeyExact.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: { mode: "exact", keyInPath: false },
                    dsdObj: dsdObj
                };
                let filters = [];
                filters.push("FREQ=Q,M");
                filters.push("CURRENCY=H42,H7");
                filters.push("CURRENCY_DENOM=HKD,DEM");
                filters.push("EXR_TYPE=NRC0");
                filters.push("EXR_SUFFIX=T,A");
                let query = { filters: filters, context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests complex key (mode=available)', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityComplexKeyAvailable.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: { mode: "available", keyInPath: false },
                    dsdObj: dsdObj
                };
                let filters = [];
                filters.push("FREQ=Q,M");
                filters.push("CURRENCY=H42,H7");
                filters.push("CURRENCY_DENOM=HKD,DEM");
                filters.push("EXR_TYPE=NRC0");
                filters.push("EXR_SUFFIX=T,A");
                let query = { filters: filters, context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });
        });

        describe('Tests temporal coverage (start, end period)', function () {
            it('Tests startPeriod without endPeriod parameter', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        startPeriod: "2010-01"
                    }
                };
                let query = { context: "dataflow:ECB=EXR(1.0)" }
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects)
                assert.equal(result.status, 1, result.error);
            });
            
            it('Tests endPeriod without startPeriod parameter', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        endPeriod: "2020-01"
                    }
                };
                let query = { context: "dataflow:ECB=EXR(1.0)" }
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects)
                assert.equal(result.status, 1, result.error);
            });

            it('Tests startPeriod & endPeriod parameter', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        startPeriod: "2010-01",
                        endPeriod: "2020-01"
                    }
                };
                let query = { context: "dataflow:ECB=EXR(1.0)" }
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects)
                assert.equal(result.status, 1, result.error);
            });
        });

        describe('Tests single dimension', function () {
            it('Tests component=FREQ parameter', async () => {
                let parentXmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityAll.xml', 'utf8');
                let parentObjects = await new SdmxXmlParser().getIMObjects(parentXmlMessage, apiVersion);

                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilitySingleDimension.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        component: true
                    },
                    parentWorkspace: JSON.parse(JSON.stringify(parentObjects))
                };
                let query = { component: "FREQ", context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });
        });

        describe('Tests metrics', function () {
            it('Tests metrics', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    reqTemplate: {
                        metrics: true
                    }
                };
                let query = { context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });
        });

        describe('Tests references', function () {
            let dsdObj;
            before(async () => {
                let dsdXml = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/ECB_ECB_EXR1_1.0.xml', 'utf8');
                let dsdWorkspace = await new SdmxXmlParser().getIMObjects(dsdXml, apiVersion);
                dsdObj = dsdWorkspace.sdmxObjects.get('DSD')[0];
            });

            it('Tests referencing datastructure', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityRefDatastructure.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "datastructure" }
                };
                let query = { context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing dataflow', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityRefDataflow.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "dataflow" }
                };
                let query = { context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing codelist', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityRefCodelist.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "codelist" }
                };
                let query = { context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing concept schemes', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityRefConceptScheme.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "conceptscheme" }
                };
                let query = { context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing data provider schemes', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityRefDataProviderScheme.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "dataproviderscheme" }
                };
                let query = { context: "dataflow:ECB=EXR(1.0)", provider: "ECB" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });

            it('Tests referencing all', async () => {
                let xmlMessage = fs.readFileSync('./tests/resources/Data Availability/ECB_EXR_1.0/SDMX 3.0/DataAvailabilityRefAll.xml', 'utf8');
                let sdmxObjects = await new SdmxXmlParser().getIMObjects(xmlMessage, apiVersion);
                let test = {
                    apiVersion: apiVersion,
                    dsdObj: dsdObj,
                    reqTemplate: { references: "all" },
                    providerRefs: [
                        { identifiableIds: ['ECB'] },
                        { identifiableIds: ['ECB1'] }
                    ]
                };
                let query = { context: "dataflow:ECB=EXR(1.0)" };
                let result = DataSemanticChecker._checkDataAvailability(test, query, sdmxObjects);
                assert.equal(result.status, 1, result.error);
            });
        });
    });
});