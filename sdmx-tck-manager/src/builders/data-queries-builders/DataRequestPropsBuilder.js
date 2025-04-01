<<<<<<< HEAD
const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;
=======
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;
const DATA_CONTEXT = require('sdmx-tck-api').constants.DATA_CONTEXT;
>>>>>>> v4.8.0
const DIMENSION_AT_OBSERVATION_CONSTANTS = require('sdmx-tck-api').constants.DIMENSION_AT_OBSERVATION_CONSTANTS;
var SeriesObject = require('sdmx-tck-api').model.SeriesObject;
var ObservationObject = require('sdmx-tck-api').model.ObservationObject;
var DataStructureObject = require('sdmx-tck-api').model.DataStructureObject;
<<<<<<< HEAD
class DataRequestPropsBuilder {
    
=======
const Utils = require('sdmx-tck-api').utils.Utils;
const API_VERSIONS = require('sdmx-tck-api').constants.API_VERSIONS;

class DataRequestPropsBuilder {    
>>>>>>> v4.8.0
    static getFlow(testIdentifiers,template){
        if(!testIdentifiers || typeof testIdentifiers !== 'object'){
            throw new Error ("Missing mandatory parameter 'testIndentifiers'")
        }
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }

        if(template.agency && template.version){
            return (testIdentifiers.id)
        }
        else if (template.version){ 
            return (testIdentifiers.agency.concat(","+testIdentifiers.id))
        }
        else if (!template.agency && !template.id &&!template.version){
            return (testIdentifiers.agency.concat(","+testIdentifiers.id.concat(","+testIdentifiers.version)))
        }
        return;
    }
<<<<<<< HEAD
=======
    static getContext(testIdentifiers, template) {
        if (!testIdentifiers || typeof testIdentifiers !== 'object') {
            throw new Error("Missing mandatory parameter 'testIndentifiers'")
        }
        if (!template || typeof template !== 'object') {
            throw new Error("Missing mandatory parameter 'template'")
        }
        let context = "";
        context += template.context ? template.context : DATA_CONTEXT.getContextFromStructureType(testIdentifiers.structureType);
        context += "=";
        context += template.agency ? template.agency : testIdentifiers.agency;
        context += ":";
        context += template.id ? template.id : testIdentifiers.id;
        context += "(";
        context += template.version ? template.version : testIdentifiers.version;
        context += ")";
        return context;
    }
>>>>>>> v4.8.0
    static getComponent(randomKeys,template){
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }
        if(!template.component){return;}
        if(!randomKeys || !randomKeys[0]){
            throw new Error ("Unable to get Dimension.")
        }
        let randIndex = Math.floor(Math.random() * Object.keys(randomKeys[0]).length)
        return Object.keys(randomKeys[0])[randIndex]
    }
<<<<<<< HEAD
    static getKey(randomKeys,dsdObj,template){
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }
        if(!template.key || (template.key !== DATA_QUERY_KEY.FULL_KEY && template.key !== DATA_QUERY_KEY.PARTIAL_KEY && template.key !== DATA_QUERY_KEY.MANY_KEYS)){return;}
        if(!randomKeys || !randomKeys[0] || !dsdObj || !dsdObj instanceof DataStructureObject){
            throw new Error ("Unable to get Key.")
        }       
        
        let fullKeyValues = Object.values(randomKeys[0])
        if(template.key === DATA_QUERY_KEY.FULL_KEY){
            return fullKeyValues.join(".")
        }
        else if(template.key === DATA_QUERY_KEY.PARTIAL_KEY){
            let fullKeyValuesJoined= fullKeyValues.join(".")
            if(fullKeyValues.length === 2){return fullKeyValuesJoined.replace(fullKeyValues[1],".")}
            else if(fullKeyValues.length === 3){return fullKeyValuesJoined.replace(fullKeyValues[1],"")}
            return fullKeyValuesJoined.replace(fullKeyValues[2],"");

        }else if(template.key === DATA_QUERY_KEY.MANY_KEYS){
            if(!randomKeys[1]){
                throw new Error ("Unable to get Keys.")
            }
            let assistiveFullKeyValues = Object.values(randomKeys[1])
            for(let i in fullKeyValues){
                if(fullKeyValues[i]!== assistiveFullKeyValues[i]){
                    fullKeyValues[i] = fullKeyValues[i].concat("+"+assistiveFullKeyValues[i])
                    break;
                }
            }
            return fullKeyValues.join(".")
        }
    }

=======

    static getKey(apiVersion, randomKeys, dsdObj, template) {
        if (template.keyInPath === true) {
            if (template.key === DATA_QUERY_KEY.FULL_KEY) {
                return this.getFullKey(randomKeys, dsdObj);
            } else if (template.key === DATA_QUERY_KEY.PARTIAL_KEY) {
                return this.getPartialKey(apiVersion, randomKeys, dsdObj);
            } else if (template.key === DATA_QUERY_KEY.MANY_KEYS) {
                return this.getManyKey(randomKeys, dsdObj);
            }
        }
    }

    static getFullKey(randomKeys, dsdObj) {
        if (!randomKeys || !randomKeys[0]) {
            throw new Error("Unable to construct key path parameter. No random keys provided.");
        }
        let values = [];
        dsdObj.getDimensions().forEach(dimension => {
            values.push(randomKeys[0][dimension.getId()]);
        });
        return values.join(".");
    }

    static getPartialKey(apiVersion, randomKeys, dsdObj) {
        if (!randomKeys || !randomKeys[0]) {
            throw new Error("Unable to construct key path parameter. No random keys provided.");
        }
        let values = [];
        let dimensions = dsdObj.getDimensions();
        // Select the dimension that will be wildcarded in the key.
        let position = Utils.getRandomInt(dimensions.length);
        dimensions.forEach((dimension, index) => {
            if (position === index) {
                values.push(Utils.getDimensionWildcard(apiVersion));
            } else {
                values.push(randomKeys[0][dimension.getId()]);
            }
        });
        return values.join(".");
    }

    static getManyKey(randomKeys, dsdObj) {
        if (!randomKeys || !randomKeys[0] || !randomKeys[1]) {
            throw new Error("Unable to construct key path parameter. No random keys provided.");
        }
        let values = [];
        dsdObj.getDimensions().forEach(dimension => {
            let value1 = randomKeys[0][dimension.getId()];
            let value2 = randomKeys[1][dimension.getId()];
            if (value1 !== value2) {
                values.push(value1 + "+" + value2);
            } else {
                values.push(value1);
            }
        });
        return values.join(".");
    }

>>>>>>> v4.8.0
    static getProvider(providerRefs,template){
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }
        if(!template.provider){return;}
        if(!providerRefs || providerRefs.length === 0){
            throw new Error("Unable to find Providers")
        }
        if(template.provider.num === 1){
            if(template.provider && template.provider.providerAgency &&  template.provider.providerId) {
                return providerRefs[0].getAgencyId()+","+providerRefs[0].getIdentifiableIds()[0]
            }else if(template.provider && !template.provider.providerAgency &&  template.provider.providerId){
                return providerRefs[0].getIdentifiableIds()[0]
            }
        }else if(template.provider.num === 2){
            if(providerRefs.length < 2){
                throw new Error("Unable to get 2 provider ids")
            }
            return providerRefs[0].getIdentifiableIds()[0]+","+providerRefs[1].getIdentifiableIds()[0]
        }
        
        return;
    }

<<<<<<< HEAD
    static getStartPeriod(indicativeSeries,template){
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }
        if(!template.startPeriod){return;}
        if(typeof template.startPeriod === "string"){return template.startPeriod}

        if(!indicativeSeries instanceof SeriesObject || indicativeSeries.getObservations().length === 0
            || indicativeSeries.getObservations().some(obs=>!obs instanceof ObservationObject)){

            throw new Error ("Unable to get a starting period.")
        }
        let observations = indicativeSeries.getObservations()
        if(observations.length ===1 || observations.length ===2 || observations.length ===3){
            return observations[0].getAttributes().TIME_PERIOD;
        }else{
            return observations[1].getAttributes().TIME_PERIOD
        }
    }

    static getEndPeriod(indicativeSeries,template){
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }
        if(!template.endPeriod){return;}
        if(typeof template.endPeriod === "string"){return template.endPeriod}
        if(!indicativeSeries instanceof SeriesObject || indicativeSeries.getObservations().length === 0
            || indicativeSeries.getObservations().some(obs=>!obs instanceof ObservationObject)){

            throw new Error ("Unable to get an ending period.")
        }
        let observations = indicativeSeries.getObservations()
        if(observations.length ===1){
            return observations[0].getAttributes().TIME_PERIOD;
        }else if(observations.length === 2 || observations.length === 3){
            return observations[observations.length-1].getAttributes().TIME_PERIOD
        }else{
            return observations[observations.length-2].getAttributes().TIME_PERIOD
=======
    static getFilters(toRun) {
        let filters = [];
        filters = filters.concat(this.getComponentValueFilters(toRun.randomKeys, toRun.dsdObj, toRun.reqTemplate));
        filters = filters.concat(this.getStartEndPeriodFilters(toRun.indicativeSeries, toRun.reqTemplate));
        return filters;
    }

    static getComponentValueFilters(randomKeys, dsdObj, template) {
        let filters = [];
        // If the template.keyInPath flag is enabled no filters will be constructed for filtering component values
        if (template.keyInPath === false) {
            if (!randomKeys || !randomKeys[0]) {
                throw new Error("Unable to construct component values filter. No random keys provided.");
            }
            if (template.key === DATA_QUERY_KEY.MANY_KEYS && !randomKeys[1]) {
                throw new Error("Unable to construct component values filter. No random keys provided.");
            }
            if (!dsdObj || !dsdObj instanceof DataStructureObject) {
                throw new Error("Unable to construct component value's filter. The DSD object is not provided.");
            }
            dsdObj.getDimensions().forEach(dimension => {
                let value1 = randomKeys[0][dimension.getId()];

                if (template.key === DATA_QUERY_KEY.FULL_KEY) {
                    filters.push(dimension.getId() + "=" + value1);
                } else if (template.key === DATA_QUERY_KEY.PARTIAL_KEY) {
                    // TODO: Not the case for any of the existing tests (to be implemented).
                } else if (template.key === DATA_QUERY_KEY.MANY_KEYS) {
                    let value2 = randomKeys[1][dimension.getId()];
                    let filterValue = "";
                    if (value1 !== value2) {
                        filterValue = value1 + "," + value2;
                    } else {
                        filterValue = value1;
                    }
                    filters.push(dimension.getId() + "=" + filterValue);
                }
            });
        }
        return filters;
    }

    static getStartEndPeriodFilters(indicativeSeries, template) {
        if (!template || typeof template !== 'object') {
            throw new Error("Missing mandatory parameter 'template'")
        }
        let startPeriodFilter = "";
        if (typeof template.startPeriod === "string") {
            startPeriodFilter = "ge:" + template.startPeriod;
        } else if (template.startPeriod === true) {
            startPeriodFilter = "ge:" + this.getStartPeriodFromIndicativeSeries(indicativeSeries);
        }
        let endPeriodFilter = "";
        if (typeof template.endPeriod === "string") {
            endPeriodFilter = "le:" + template.endPeriod;
        } else if (template.endPeriod === true) {
            endPeriodFilter = "le:" + this.getEndPeriodFromIndicativeSeries(indicativeSeries);
        }
        let filters = [];
        if (startPeriodFilter && endPeriodFilter) {
            filters.push("TIME_PERIOD=" + startPeriodFilter + "+" + endPeriodFilter);
        } else if (startPeriodFilter && !endPeriodFilter) {
            filters.push("TIME_PERIOD=" + startPeriodFilter);
        } else if (!startPeriodFilter && endPeriodFilter) {
            filters.push("TIME_PERIOD=" + endPeriodFilter);
        }
        return filters;
    }

    static getStartPeriod(indicativeSeries, template) {
        if (!template || typeof template !== 'object') {
            throw new Error("Missing mandatory parameter 'template'")
        }
        if (!template.startPeriod) { return; }
        if (typeof template.startPeriod === "string") { return template.startPeriod }

        return this.getStartPeriodFromIndicativeSeries(indicativeSeries);
    }

    static getStartPeriodFromIndicativeSeries(indicativeSeries) {
        if (!indicativeSeries instanceof SeriesObject ||
            indicativeSeries.getObservations().length === 0 ||
            indicativeSeries.getObservations().some(obs => !obs instanceof ObservationObject)) {
            throw new Error("Unable to get a starting period.");
        }
        let observations = indicativeSeries.getObservations();
        if (observations.length === 1 ||
            observations.length === 2 ||
            observations.length === 3) {
            return observations[0].getAttributes().TIME_PERIOD;
        } else {
            return observations[1].getAttributes().TIME_PERIOD;
        }
    }

    static getEndPeriod(indicativeSeries, template) {
        if (!template || typeof template !== 'object') {
            throw new Error("Missing mandatory parameter 'template'")
        }
        if (!template.endPeriod) { return; }
        if (typeof template.endPeriod === "string") { return template.endPeriod }

        return this.getEndPeriodFromIndicativeSeries(indicativeSeries);
    }

    static getEndPeriodFromIndicativeSeries(indicativeSeries) {
        if (!indicativeSeries instanceof SeriesObject || 
            indicativeSeries.getObservations().length === 0 || 
            indicativeSeries.getObservations().some(obs => !obs instanceof ObservationObject)) {
            throw new Error("Unable to get an ending period.");
        }
        let observations = indicativeSeries.getObservations();
        if (observations.length === 1) {
            return observations[0].getAttributes().TIME_PERIOD;
        } else if (observations.length === 2 || observations.length === 3) {
            return observations[observations.length - 1].getAttributes().TIME_PERIOD;
        } else {
            return observations[observations.length - 2].getAttributes().TIME_PERIOD;
>>>>>>> v4.8.0
        }
    }

    static getNumberOfObs(indicativeSeries){
        if(!indicativeSeries instanceof SeriesObject || indicativeSeries.getObservations().length === 0
            || indicativeSeries.getObservations().some(obs=>!obs instanceof ObservationObject)){

            throw new Error ("Unable to get a number of observations.")
        }
        let observations = indicativeSeries.getObservations()
        if(observations.length ===1 || observations.length ===2 ){
            return observations.length;
        }else if(observations.length ===3){
            return observations.length-1;
        }else{
            return 3;
        }
    }

    static getNumOfFirstNObservations(indicativeSeries,template){
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }
        if(!template.firstNObservations){return;}
        return this.getNumberOfObs(indicativeSeries)
    }

    static getNumOfLastNObservations(indicativeSeries,template){
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }
        if(!template.lastNObservations){return;}
        if(!indicativeSeries instanceof SeriesObject){
            throw new Error ("Unable to get a number of observations.")
        }
        let copyOfIndicativeSeries = indicativeSeries;
        if(template.startPeriod && template.endPeriod && template.lastNObservations){
            copyOfIndicativeSeries.setObservations(indicativeSeries.getObservationsBetweenPeriod(this.getStartPeriod(indicativeSeries,template),this.getEndPeriod(indicativeSeries,template)))
        }
        return this.getNumberOfObs(copyOfIndicativeSeries)
    }
    static getUpdateAfterDate(indicativeSeries,template){
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }
        if(!template.updatedAfter){return;}
        if(!indicativeSeries instanceof SeriesObject || indicativeSeries.getObservations().length === 0
            || indicativeSeries.getObservations().some(obs=>!obs instanceof ObservationObject)){
            throw new Error ("Unable to get a date.")
        }
        let observations = indicativeSeries.getObservations();
        let randomIndex = Math.floor(Math.random() * observations.length);
        return observations[randomIndex].getAttributes().TIME_PERIOD;
    }

    static getObsDimension(dsdObj,template){
        if(!template || typeof template !== 'object'){
            throw new Error ("Missing mandatory parameter 'template'")
        }
        if(!template.dimensionAtObservation || template.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.NOT_PROVIDED){return;}
        if(template.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.DIMENSION){
            if(!dsdObj || !dsdObj instanceof DataStructureObject){
                throw new Error ("Unable to get a dimension.")
            }
            return dsdObj.getRandomDimension().getId()
        }
        return template.dimensionAtObservation;
    }
<<<<<<< HEAD
=======
    static extractStructureRefFromQuery(query) {
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        let structureRef;
        if (query.flow) {
            structureRef = this.extractStructureRefFromFlow(query.flow);
        } else if (query.context) {
            structureRef = this.extractStructureRefFromContext(query.context);
        }
        return structureRef;
    }
    /*
        This method takes as input a string identifying the dataflow.
        The syntax is agency id, artefact id, version, separated by a ",". 
        For example: AGENCY_ID,FLOW_ID,VERSION. 
        In case the string only contains one out of these 3 elements, 
        it is considered to be the flow id, i.e. all,FLOW_ID,latest. 
        In case the string only contains two out of these 3 elements, 
        they are considered to be the agency id and the flow id, i.e. AGENCY_ID,FLOW_ID,latest.
    */
    static extractStructureRefFromFlow(flow) {
        let matches = flow.split(",");
        if (matches.length === 0) {
            console.error("Cannot extract structure ref. from flow " + flow);
            return null;
        }
        let structureRef;
        if (matches.length === 1) {
            structureRef = {
                structureType: SDMX_STRUCTURE_TYPE.DATAFLOW.key,
                agencyId: "all",
                id: matches[0],
                version: "latest"
            };
        } else if (matches.length === 2) {
            structureRef = {
                structureType: SDMX_STRUCTURE_TYPE.DATAFLOW.key,
                agencyId: matches[0],
                id: matches[1],
                version: "latest"
            };
        } else if (matches.length === 3) {
            structureRef = {
                structureType: SDMX_STRUCTURE_TYPE.DATAFLOW.key,
                agencyId: matches[0],
                id: matches[1],
                version: matches[2]
            };
        }
        console.log("Structure ref=" + JSON.stringify(structureRef) + " extracted from flow " + flow);
        return structureRef;
    }
    static extractStructureRefFromContext(context) {
        var regex = /[^=:\(\)]+/g;
        let matches = context.match(regex);
        if (matches.length < 4) {
            throw new Error("Cannot extract structure identification information from context " + context);
        }
        let structureType = DATA_CONTEXT.getStructureTypeFromContext(matches[0]);
        if (!structureType) {
            throw new Error("Cannot extract structure type from context " + context);
        }
        let structureRef = {
            structureType: structureType.key,
            agencyId: matches[1],
            id: matches[2],
            version: matches[3]
        };
        console.log("Structure ref=" + JSON.stringify(structureRef) + " extracted from context " + context);
        return structureRef;
    }
    static extractDimValuesFromQuery(test, query, dimension) {
        let dimensionValue;
        if (test.reqTemplate.keyInPath === true) {
            dimensionValue = query.key.split(".")[dimension.getPosition() - 1];
        } else {
            dimensionValue = query.filters.find(filter => {
                let parts = filter.split('=');
                if (parts[0] === dimension.getId()) {
                    return true;
                }
                return false;
            });
            if (dimensionValue) {
                dimensionValue = dimensionValue.split('=')[1];
            }
        }
        console.log("Dimension=" + dimension.getId() + ", position=" + dimension.getPosition() + ", value(s)='" + dimensionValue + "' extracted from the query " + JSON.stringify(query));
        return dimensionValue;
    }

    static extractStartEndPeriodFromQuery(apiVersion, query) {
        if (API_VERSIONS[apiVersion] >= API_VERSIONS["v2.0.0"]) {
            return this.extractStartEndPeriodFromFilters(query.filters);
        } else {
            return this.extractStartEndPeriodFromParams(query);
        }
    }

    static extractStartEndPeriodFromFilters(filters) {
        let periods = {}
        if (filters) {
            let filter = filters.find(filter => {
                return filter.startsWith("TIME_PERIOD=");
            });
            if (filter) {
                let regex = /(?:ge|le):[A-Za-z0-9_@$-]+/g;
                let matches = filter.match(regex);
                for (let m of matches) {
                    if (m && m.startsWith("ge:")) {
                        periods = {
                            ...periods,
                            startPeriodOperator: "ge",
                            startPeriod: m.split(":")[1]
                        };
                    } else if (m && m.startsWith("le:")) {
                        periods = {
                            ...periods,
                            endPeriodOperator: "le",
                            endPeriod: m.split(":")[1]
                        };
                    }
                }
            }
        }
        return periods;
    }

    static extractStartEndPeriodFromParams(query) {
        return {
            startPeriodOperator: query.start? "ge" : undefined,
            startPeriod: query.start,
            endPeriodOperator: query.end? "le" : undefined,
            endPeriod: query.end
        };
    }
>>>>>>> v4.8.0
}

module.exports = DataRequestPropsBuilder