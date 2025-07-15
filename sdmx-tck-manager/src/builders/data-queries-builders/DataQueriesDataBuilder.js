var TestObjectBuilder = require('../TestObjectBuilder.js');
var HelperManager = require('../../manager/HelperManager.js')
var Utils = require('sdmx-tck-api').utils.Utils;
var TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
const MetadataDetail = require('sdmx-rest').metadata.MetadataDetail;
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const StructureReference = require('sdmx-tck-api/src/model/structure-queries-models/StructureReference');
const { DATA_CONTEXT } = require('sdmx-tck-api/src/constants/data-queries-constants/DataContext.js');

class DataQueriesDataBuilder {
    static async buildDataQueriesData(endpoint, apiVersion, format) {
        /* The returned object should contain one structure (as reference) 
         * and one indicative series for each possible context value:
         * { provisionagreement: {structureRef: {...}, indicativeSeries: {...}},
         *   dataflow: {structureRef: {...}, indicativeSeries: {...}},
         *   datastructure: {structureRef: {...}, indicativeSeries: {...}}
         * }
         */
        let data = {};
        let contextList = DATA_CONTEXT.getApplicableValuesList(apiVersion);
        for (const context of contextList) {
            data[context] = await this.getDataContext(endpoint, apiVersion, format, context);
        }
        return data;
    }

    static async getDataContext(endpoint, apiVersion, format, context) {
        let structures = await this.requestStructures(endpoint, apiVersion, format, context);
            
        return await this.getRandomStructureWithData(endpoint, apiVersion, format, context, structures);
    }

    static async requestStructures(endpoint, apiVersion, format, context) {
        let configParams = {
            index: TEST_INDEX.Structure,
            apiVersion: apiVersion,
            resource: DATA_CONTEXT.getRestResource(context),
            reqTemplate: { detail: MetadataDetail.FULL },
            identifiers: { structureType: "", agency: "all", id: "all", version: "all" },
            testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS
        };
        console.log("### Requesting structures for context " + context);
        
        let workspace = await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(configParams), format, endpoint);
        let structures = workspace.getSdmxObjectsOfType(DATA_CONTEXT.getStructureTypeFromContext(context).key);
        
        console.log("### " + structures.length + " structures found for context " + context);
        return structures;
    }

    static async requestStructureData(endpoint, apiVersion, format, context, structure) {
        let helpTestParams = {
            index: TEST_INDEX.Data,
            apiVersion: apiVersion,
            resource: DATA_CONTEXT.getRestResource(context),
            identifiers: { structureType: structure.getStructureType(), agency: structure.getAgencyId(), id: structure.getId(), version: structure.getVersion() },
            testType: TEST_TYPE.DATA_IDENTIFICATION_PARAMETERS
        };
        console.log("### Requesting data for structure ref=" + structure.asReference());
        
        return await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(helpTestParams), format, endpoint);
    }

    /**
     * Selects a structure from the list that has data.
     * @param {*} endpoint 
     * @param {*} apiVersion 
     * @param {*} context 
     * @param {*} structures 
     * @returns 
     */
    static async getRandomStructureWithData(endpoint, apiVersion, format, context, structures) {
        if (structures.length === 0) {
            throw new Error("Not possible to get structures that have data.");
        }
        let index = Utils.getRandomInt(structures.length);
        let structure = structures[index];
                
        console.log("### Structure selected. index=" + index + ", ref=" + structure.asReference().toString());
        console.log("### Checking if the selected structure has data.");
        
        // Checks that the selected artefact has data, if thats not the case keep looking for another artefact
        let dataWorkspace;
        try {
            dataWorkspace = await this.requestStructureData(endpoint, apiVersion, format, context, structure);
        } catch (ex) {
            console.log("### Cannot parse the data workspace returned for ref=" + structure.asReference().toString() + ". " + ex);
        }
        if (dataWorkspace && dataWorkspace.hasObservations() && dataWorkspace.hasSeries()) {
            console.log("### Data found for structure ref=" + structure.asReference().toString());
            return {
                structureRef: new StructureReference(structure.getStructureType(), structure.getAgencyId(), structure.getId(), structure.getVersion()),
                indicativeSeries: dataWorkspace.getNSeries(1),
                indicativeSeriesAttributes: dataWorkspace.getAttributesFromNSeries(2)
            }
        } else {
            console.log("### Data not found for structure ref=" + structure.asReference().toString());
            structures.splice(index, 1);
            console.log("### Trying again with another structure from the list.");
            return await this.getRandomStructureWithData(endpoint, apiVersion, format, context, structures);
        }
    }
}
module.exports = DataQueriesDataBuilder;