var DataRequestPropsBuilder = require('../../sdmx-tck-manager/src/builders/data-queries-builders/DataRequestPropsBuilder.js')
const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;
const fs = require('fs');
var SdmxXmlParser = require('../../sdmx-tck-parsers/src/parsers/SdmxXmlParser.js');
var DataStructureObject = require('sdmx-tck-api').model.DataStructureObject;
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var SeriesObject = require('sdmx-tck-api').model.SeriesObject;
const DIMENSION_AT_OBSERVATION_CONSTANTS = require('sdmx-tck-api').constants.DIMENSION_AT_OBSERVATION_CONSTANTS;
<<<<<<< HEAD
=======
const assert = require('assert');
>>>>>>> v4.8.0

describe('Tests Flow of Data requests from identifiers', function () {
    it('It should assert the flow', async () => {
        let template = {}
        let identifiers = {agency:"SARB",id:"LBS_DISS",version:"1.0"}
       console.assert(DataRequestPropsBuilder.getFlow(identifiers,template) === 'SARB,LBS_DISS,1.0')
    });
    it('It should assert the flow', async () => {
        let template = {agency:"all",version:"latest"}
        let identifiers = {agency:"SARB",id:"LBS_DISS",version:"1.0"}
       console.assert(DataRequestPropsBuilder.getFlow(identifiers,template) === 'LBS_DISS')
    });
    it('It should assert the flow', async () => {
        let template = {version:"latest"}
        let identifiers = {agency:"SARB",id:"LBS_DISS",version:"1.0"}
       console.assert(DataRequestPropsBuilder.getFlow(identifiers,template) === 'SARB,LBS_DISS')
    });
});

describe('Tests Component of Data requests from randomKey', function () {
    it('It should assert the component', async () => {
        let template = {component:true}
        let randomKeys = [{FREQ:"A",CURRENCY:"EUR",EXR_SUFFIX:"B"},{FREQ:"Q",CURRENCY:"DOL",EXR_SUFFIX:"C"}]
        let component = DataRequestPropsBuilder.getComponent(randomKeys,template)
        console.assert(component !== null)
        console.assert(component !== "A" || component === "EUR" || component === "B")
    });
   
});

describe('Tests Key of Data requests from randomKey', function () {
<<<<<<< HEAD
    it('It should assert the key', async () => {
        let dsdObj;
        let template = {key:DATA_QUERY_KEY.FULL_KEY}
        let randomKeys = [{FREQ:"A",REF_AREA:"B",ADJUSTMENT:"C",TRD_FLOW:"D",TRD_PRODUCT:"E",COUNT_AREA:"F",STS_INSTITUTION:"G",TRD_SUFFIX:"H"},
        {FREQ:"A",REF_AREA:"B",ADJUSTMENT:"C",TRD_FLOW:"D",TRD_PRODUCT:"E",COUNT_AREA:"F",STS_INSTITUTION:"G",TRD_SUFFIX:"H"}]

        xmlMessage = fs.readFileSync('./tests/resources/ECB_ECB_TRED1_1.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
           dsdObj = structureWorkspace.sdmxObjects.get("DSD")[0];
           console.assert(dsdObj instanceof DataStructureObject)
        })

        let key = DataRequestPropsBuilder.getKey(randomKeys,dsdObj,template)
        console.assert(key === "A.B.C.D.E.F.G.H")
    });
    it('It should assert the key', async () => {
        let dsdObj;
        let template = {key:DATA_QUERY_KEY.PARTIAL_KEY}
        let randomKeys = [{FREQ:"A",REF_AREA:"B",ADJUSTMENT:"C",TRD_FLOW:"D",TRD_PRODUCT:"E",COUNT_AREA:"F",STS_INSTITUTION:"G",TRD_SUFFIX:"H"},
        {FREQ:"A",REF_AREA:"B",ADJUSTMENT:"C",TRD_FLOW:"D",TRD_PRODUCT:"E",COUNT_AREA:"F",STS_INSTITUTION:"G",TRD_SUFFIX:"H"}]

        xmlMessage = fs.readFileSync('./tests/resources/ECB_ECB_TRED1_1.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
           dsdObj = structureWorkspace.sdmxObjects.get("DSD")[0];
           console.assert(dsdObj instanceof DataStructureObject)
        })

        let key = DataRequestPropsBuilder.getKey(randomKeys,dsdObj,template)
        console.assert(key === "A.B..D.E.F.G.H")
    });
    it('It should assert the key', async () => {
        let dsdObj;
        let template = {key:DATA_QUERY_KEY.MANY_KEYS}
        let randomKeys = [{FREQ:"A",REF_AREA:"B",ADJUSTMENT:"C",TRD_FLOW:"D",TRD_PRODUCT:"E",COUNT_AREA:"F",STS_INSTITUTION:"G",TRD_SUFFIX:"H"},
        {FREQ:"A",REF_AREA:"B",ADJUSTMENT:"I",TRD_FLOW:"D",TRD_PRODUCT:"E",COUNT_AREA:"F",STS_INSTITUTION:"G",TRD_SUFFIX:"H"}]

        xmlMessage = fs.readFileSync('./tests/resources/ECB_ECB_TRED1_1.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
           dsdObj = structureWorkspace.sdmxObjects.get("DSD")[0];
           console.assert(dsdObj instanceof DataStructureObject)
        })

        let key = DataRequestPropsBuilder.getKey(randomKeys,dsdObj,template)
        console.assert(key === "A.B.C+I.D.E.F.G.H")
    });
   
=======
    it('It should assert the full key', async () => {
        let dsdObj;
        let template = { key: DATA_QUERY_KEY.FULL_KEY, keyInPath: true };
        let randomKeys = [
            { FREQ: "A1", REF_AREA: "B1", ADJUSTMENT: "C1", TRD_FLOW: "D1", TRD_PRODUCT: "E1", COUNT_AREA: "F1", STS_INSTITUTION: "G1", TRD_SUFFIX: "H1" },
            { FREQ: "A2", REF_AREA: "B2", ADJUSTMENT: "C2", TRD_FLOW: "D2", TRD_PRODUCT: "E2", COUNT_AREA: "F2", STS_INSTITUTION: "G2", TRD_SUFFIX: "H2" }
        ];

        let xmlMessage = fs.readFileSync('./tests/resources/ECB_ECB_TRED1_1.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
            dsdObj = structureWorkspace.sdmxObjects.get("DSD")[0];
            console.assert(dsdObj instanceof DataStructureObject);
        });

        let keyV14 = DataRequestPropsBuilder.getKey("v1.4.0", randomKeys, dsdObj, template);
        let keyV20 = DataRequestPropsBuilder.getKey("v2.0.0", randomKeys, dsdObj, template);
        assert.equal(keyV14, "A1.B1.C1.D1.E1.F1.G1.H1");
        assert.equal(keyV20, "A1.B1.C1.D1.E1.F1.G1.H1");
    });

    it('It should assert the partial key', async () => {
        let dsdObj;
        let template = { key: DATA_QUERY_KEY.PARTIAL_KEY, keyInPath: true };
        let randomKeys = [
            { FREQ: "A", REF_AREA: "B", ADJUSTMENT: "C", TRD_FLOW: "D", TRD_PRODUCT: "E", COUNT_AREA: "F", STS_INSTITUTION: "G", TRD_SUFFIX: "H" },
            { FREQ: "A", REF_AREA: "B", ADJUSTMENT: "C", TRD_FLOW: "D", TRD_PRODUCT: "E", COUNT_AREA: "F", STS_INSTITUTION: "G", TRD_SUFFIX: "H" }
        ];

        let xmlMessage = fs.readFileSync('./tests/resources/ECB_ECB_TRED1_1.xml', 'utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
            dsdObj = structureWorkspace.sdmxObjects.get("DSD")[0];
            console.assert(dsdObj instanceof DataStructureObject);
        });

        let keyV14 = DataRequestPropsBuilder.getKey("v1.4.0", randomKeys, dsdObj, template);
        let keyV20 = DataRequestPropsBuilder.getKey("v2.0.0", randomKeys, dsdObj, template);

        const isKeyV14Valid = keyV14.match(/^(?:\s{0}|A)\.(?:\s{0}|B)\.(?:\s{0}|C)\.(?:\s{0}|D)\.(?:\s{0}|E)\.(?:\s{0}|F)\.(?:\s{0}|G)\.(?:\s{0}|H)$/);
        const isKeyV20Valid = keyV20.match(/^(?:\*|A)\.(?:\*|B)\.(?:\*|C)\.(?:\*|D)\.(?:\*|E)\.(?:\*|F)\.(?:\*|G)\.(?:\*|H)$/);

        console.log(keyV14, ", isValid=", !!isKeyV14Valid);
        console.log(keyV20, ", isValid=", !!isKeyV20Valid);

        assert.equal(!!isKeyV14Valid, true);
        assert.equal(!!isKeyV20Valid, true);
    });

    it('It should assert the complex key', async () => {
        let dsdObj;
        let template = { key: DATA_QUERY_KEY.MANY_KEYS, keyInPath: true };
        let randomKeys = [
            { FREQ: "A", REF_AREA: "B", ADJUSTMENT: "C", TRD_FLOW: "D", TRD_PRODUCT: "E", COUNT_AREA: "F", STS_INSTITUTION: "G", TRD_SUFFIX: "H" },
            { FREQ: "A", REF_AREA: "B", ADJUSTMENT: "I", TRD_FLOW: "D", TRD_PRODUCT: "E", COUNT_AREA: "F", STS_INSTITUTION: "G", TRD_SUFFIX: "H" }
        ];

        let xmlMessage = fs.readFileSync('./tests/resources/ECB_ECB_TRED1_1.xml', 'utf8');
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
            dsdObj = structureWorkspace.sdmxObjects.get("DSD")[0];
            console.assert(dsdObj instanceof DataStructureObject);
        });

        let keyV14 = DataRequestPropsBuilder.getKey("v1.4.0", randomKeys, dsdObj, template);
        console.log("key=", keyV14);
        assert.equal(keyV14, "A.B.C+I.D.E.F.G.H");
    });
>>>>>>> v4.8.0
});

describe('Tests provider data of Data requests', function () {
    it('It should assert the provider id', async () => {
        let providerRefs = [new StructureReference('DATA_PROVIDER_SCHEME','ECB','DATA_PROVIDERS','1.0',['ECB'])]
        let template = {provider:{num:1,providerId:true}}
        let provider = DataRequestPropsBuilder.getProvider(providerRefs,template)
        console.assert(provider === "ECB")
    });

    it('It should assert the provider agency,id', async () => {
        let providerRefs = [new StructureReference('DATA_PROVIDER_SCHEME','ECB','DATA_PROVIDERS','1.0',['ECB'])]
        let template = {provider:{num:1,providerAgency:true,providerId:true}}
        let provider = DataRequestPropsBuilder.getProvider(providerRefs,template)
        console.assert(provider === "ECB,ECB")
    });

    it('It should assert the provider ids combination', async () => {
        let providerRefs = [new StructureReference('DATA_PROVIDER_SCHEME','ECB','DATA_PROVIDERS','1.0',['ECB']),
                            new StructureReference('DATA_PROVIDER_SCHEME','ECB','DATA_PROVIDERS','1.0',['ECB1'])]
        let template = {provider:{num:2}}
        let provider = DataRequestPropsBuilder.getProvider(providerRefs,template)
        console.assert(provider === "ECB,ECB1")
    });
});

describe('Tests startPeriod/endPeriod of Data requests from indicativeSeries', function () {
    it('It should assert the startPeriod', async () => {
        let allSeries;
        let template = {startPeriod:true}
      
        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
           allSeries = sdmxObjects.getAllSeries()
           console.assert(allSeries.every(series => series instanceof SeriesObject))
        })
        let indicativeSeries = allSeries[0];
        let key = DataRequestPropsBuilder.getStartPeriod(indicativeSeries,template)
        console.assert(key === "2010-08")

        indicativeSeries = allSeries[1];
        key = DataRequestPropsBuilder.getStartPeriod(indicativeSeries,template)
        console.assert(key === "2010-09")

    });
    it('It should assert the endPeriod', async () => {
        let allSeries;
        let template = {endPeriod:true}
      
        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
            allSeries = sdmxObjects.getAllSeries()
            console.assert(allSeries.every(series => series instanceof SeriesObject))
         })
        
        let indicativeSeries = allSeries[0];
        let key = DataRequestPropsBuilder.getEndPeriod(indicativeSeries,template)
        console.assert(key === "2010-09")

        indicativeSeries = allSeries[1];
        key = DataRequestPropsBuilder.getEndPeriod(indicativeSeries,template)
        console.assert(key === "2010-10")
    });
    it('It should assert the startPeriod when given from template', async () => {
        let indicativeSeries;
        let template = {startPeriod:"2012-05-11"}
      
        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
           indicativeSeries = sdmxObjects.getAllSeries()[0]
           console.assert(indicativeSeries instanceof SeriesObject)
        })

        let key = DataRequestPropsBuilder.getStartPeriod(indicativeSeries,template)
        console.assert(key === "2012-05-11")
    });
    it('It should assert the endPeriod when given from template', async () => {
        let indicativeSeries;
        let template = {endPeriod:"2012-05-11"}
      
        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
           indicativeSeries = sdmxObjects.getAllSeries()[0]
           console.assert(indicativeSeries instanceof SeriesObject)
        })

        let key = DataRequestPropsBuilder.getEndPeriod(indicativeSeries,template)
        console.assert(key === "2012-05-11")
    });
   
});
describe('Tests first/last N Observations of Data requests from indicativeSeries', function () {
    it('It should assert the firstNObservations', async () => {
        let allSeries;
        let template = {firstNObservations:true}
      
        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
           allSeries = sdmxObjects.getAllSeries()
           console.assert(allSeries.every(series => series instanceof SeriesObject))
        })
        let indicativeSeries = allSeries[0];
        let obsNum = DataRequestPropsBuilder.getNumOfFirstNObservations(indicativeSeries,template)
        console.assert(obsNum === 2)

        indicativeSeries = allSeries[1];
        obsNum = DataRequestPropsBuilder.getNumOfFirstNObservations(indicativeSeries,template)
        console.assert(obsNum === 3)


    });
    it('It should assert the lastNObservations', async () => {
        let allSeries;
        let template = {lastNObservations:true}
      
        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
           allSeries = sdmxObjects.getAllSeries()
           console.assert(allSeries.every(series => series instanceof SeriesObject))
        })
        let indicativeSeries = allSeries[0];
        let obsNum = DataRequestPropsBuilder.getNumOfLastNObservations(indicativeSeries,template)
        console.assert(obsNum === 2)

        indicativeSeries = allSeries[1];
        obsNum = DataRequestPropsBuilder.getNumOfLastNObservations(indicativeSeries,template)
        console.assert(obsNum === 3)
    });
    it('It should assert the lastNObservations between a starting - ending period', async () => {
        let allSeries;
        let template = {startPeriod:true,endPeriod:true,lastNObservations:true}
      
        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
           allSeries = sdmxObjects.getAllSeries()
           console.assert(allSeries.every(series => series instanceof SeriesObject))
        })
        let indicativeSeries = allSeries[1];
        let obsNum = DataRequestPropsBuilder.getNumOfLastNObservations(indicativeSeries,template)
        console.assert(obsNum === 2)
    });
});

describe('Tests updatedAfter date of Data requests from indicativeSeries', function () {
    it('It should assert the updatedAfter Date', async () => {
        let allSeries;
        let template = {updatedAfter:true}
      
        xmlMessage = fs.readFileSync('./tests/resources/DataXMLDataOnly.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (sdmxObjects) {
           allSeries = sdmxObjects.getAllSeries()
           console.assert(allSeries.every(series => series instanceof SeriesObject))
        })
        let indicativeSeries = allSeries[0];
        let updateAfterDate = DataRequestPropsBuilder.getUpdateAfterDate(indicativeSeries,template)
        console.assert(updateAfterDate === "2010-08" || updateAfterDate === "2010-09")
    });
});

describe('Tests dimension at observation of Data requests', function () {
    it('It should assert dimension at observation', async () => {
        let dsdObj;
        let template = {dimensionAtObservation:DIMENSION_AT_OBSERVATION_CONSTANTS.DIMENSION}
    
        xmlMessage = fs.readFileSync('./tests/resources/ECB_ECB_TRED1_1.xml','utf8')
        await new SdmxXmlParser().getIMObjects(xmlMessage).then(function (structureWorkspace) {
           dsdObj = structureWorkspace.sdmxObjects.get("DSD")[0];
           console.assert(dsdObj instanceof DataStructureObject)
        })

        let obsDimension = DataRequestPropsBuilder.getObsDimension(dsdObj,template)
        console.assert(dsdObj.getDimensions().some(dim => dim.getId() === obsDimension))

        template = {dimensionAtObservation:DIMENSION_AT_OBSERVATION_CONSTANTS.NOT_PROVIDED}
        obsDimension = DataRequestPropsBuilder.getObsDimension(dsdObj,template)
        console.assert(!obsDimension)

        template = {dimensionAtObservation:DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD}
        obsDimension = DataRequestPropsBuilder.getObsDimension(dsdObj,template)
        console.assert(obsDimension === DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD)
    });
<<<<<<< HEAD
=======
});

describe('Tests structure identification information extraction from data request', function () {
    it('It should get structure ref from flow', async () => {
        let flow = "ESTAT,RAIL_TF_PASSMOV,1.2.0";
        let ref = DataRequestPropsBuilder.extractStructureRefFromFlow(flow);
        assert.equal(ref.structureType, 'DATAFLOW');
        assert.equal(ref.agencyId, 'ESTAT');
        assert.equal(ref.id, 'RAIL_TF_PASSMOV');
        assert.equal(ref.version, '1.2.0');
    });

    it('It should get structure ref from flow', async () => {
        let flow = "RAIL_TF_PASSMOV";
        let ref = DataRequestPropsBuilder.extractStructureRefFromFlow(flow);
        assert.equal(ref.structureType, 'DATAFLOW');
        assert.equal(ref.agencyId, 'all');
        assert.equal(ref.id, 'RAIL_TF_PASSMOV');
        assert.equal(ref.version, 'latest');
    });

    it('It should get structure ref from flow', async () => {
        let flow = "ESTAT,RAIL_TF_PASSMOV";
        let ref = DataRequestPropsBuilder.extractStructureRefFromFlow(flow);
        assert.equal(ref.structureType, 'DATAFLOW');
        assert.equal(ref.agencyId, 'ESTAT');
        assert.equal(ref.id, 'RAIL_TF_PASSMOV');
        assert.equal(ref.version, 'latest');
    });
    
    it('It should get structure ref from context', async () => {
        let context = "dataflow:ESTAT:RAIL_TF_PASSMOV(1.2.0)";
        let ref = DataRequestPropsBuilder.extractStructureRefFromContext(context);
        assert.equal(ref.structureType, 'DATAFLOW');
        assert.equal(ref.agencyId, 'ESTAT');
        assert.equal(ref.id, 'RAIL_TF_PASSMOV');
        assert.equal(ref.version, '1.2.0');
    });
>>>>>>> v4.8.0
});