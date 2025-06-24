const { DATA_QUERY_KEY } = require('sdmx-tck-api/src/constants/data-queries-constants/DataQueryKey');
const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
const STRUCTURE_REST_RESOURCE = require('sdmx-tck-api').constants.STRUCTURES_REST_RESOURCE;
var SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
var FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var Utils = require('sdmx-tck-api').utils.Utils;
var SdmxDataObjects = require('sdmx-tck-api').model.SdmxDataObjects;
var SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;
var TckError = require('sdmx-tck-api').errors.TckError;
var StructureReference = require('sdmx-tck-api').model.StructureReference;
const DataRequestPropsBuilder = require('../builders/data-queries-builders/DataRequestPropsBuilder.js');
const { DATA_QUERY_DETAIL } = require('sdmx-tck-api/src/constants/data-queries-constants/DataQueryDetail');
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
var ContentConstraintObject = require('sdmx-tck-api').model.ContentConstraintObject;
const DATA_QUERY_MODE = require('sdmx-tck-api').constants.DATA_QUERY_MODE
const DIMENSION_AT_OBSERVATION_CONSTANTS = require('sdmx-tck-api').constants.DIMENSION_AT_OBSERVATION_CONSTANTS;
const ATTRIBUTE_RELATIONSHIP_NAMES = require('sdmx-tck-api').constants.ATTRIBUTE_RELATIONSHIP_NAMES;
const DATA_QUERY_ATTRIBUTES = require('sdmx-tck-api').constants.DATA_QUERY_ATTRIBUTES;
const DATA_QUERY_MEASURES = require('sdmx-tck-api').constants.DATA_QUERY_MEASURES;

class DataSemanticChecker {

    static checkWorkspace(test, preparedRequest, workspace) {
        return new Promise((resolve, reject) => {
            var query = preparedRequest.request;
            try {
                let validation = {};
                if (test.testType === TEST_TYPE.DATA_IDENTIFICATION_PARAMETERS) {
                    validation = DataSemanticChecker._checkResourceIdentification(test, query, workspace)
                } else if (test.testType === TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS) {
                    validation = DataSemanticChecker._checkExtendedResourceIdentification(test, query, workspace)
                } else if (test.testType === TEST_TYPE.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS) {
                    validation = DataSemanticChecker._checkFurtherDescribingResults(test, query, workspace)
                } else if (test.testType === TEST_TYPE.DATA_AVAILABILITY){
                    validation = DataSemanticChecker._checkDataAvailability(test, query, workspace)
                }
                resolve(validation);
            } catch (err) {
                reject(new TckError(err));
            }
        });
    }

    static _checkResourceIdentification(test, query, workspace) {
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }

        let identificationValidation = this._checkIdentification(test, query, workspace)
        if(identificationValidation.status === FAILURE_CODE){return identificationValidation}

        if (query.provider && query.provider !== "all") {
            return this._checkProviderIdentification(test, query, workspace)
        }
        return identificationValidation;
    }

    static _checkProviderIdentification(test, query, workspace) {
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        let headerRefs = workspace.getAllHeaderRefs()
        let praRefs = headerRefs.filter(ref=>ref.getStructureType() === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key);
        if(praRefs.length === 0){
            return { status: FAILURE_CODE, error: "Error in Identification: No PRA references in response."}
        }
        for (let i in praRefs) {
            if (!test.structureWorkspace.exists(praRefs[i])) {
                return { status: FAILURE_CODE, error: "Error in Identification: " + praRefs[i] + " is not related to requested DF" }
            }

            let praObj = test.structureWorkspace.getSdmxObject(praRefs[i]);
            
            if (query.provider.indexOf("+") !== -1) {
                if (!praObj.getChildren().find(child => child.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key
                    && child.getIdentifiableIds().some(id=> id === query.provider.split("+")[0] || query.provider.split("+")[1]) )) {
                        return { status: FAILURE_CODE, error: "Error in Identification: The Maintainable of " + praRefs[i] + " does not contain any of the requested providerIds."}
                }
            } else if (query.provider.indexOf(",") !== -1) {
                if (!praObj.getChildren().find(child =>
                    child.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key
                    && child.getIdentifiableIds().indexOf(query.provider.split(",")[1]) !== -1
                    && child.getAgencyId() === query.provider.split(",")[0])) {
                    return { status: FAILURE_CODE, error: "Error in Identification: The Maintainable of " + praRefs[i] + " does not contain the requested providerId." }
                }
            } else {
                if (!praObj.getChildren().find(child => child.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key
                    && child.getIdentifiableIds().indexOf(query.provider) !== -1)) {
                    return { status: FAILURE_CODE, error: "Error in Identification: The Maintainable of " + praRefs[i] + " does not contain the requested providerId."}
                }
            }
        }
        return { status: SUCCESS_CODE }
    } 

    static _checkIdentification(test, query, workspace) {
        let requestedStructureRef = DataRequestPropsBuilder.extractStructureRefFromQuery(query);
        let reformedQuery = {
            agency: requestedStructureRef.agencyId,
            id: requestedStructureRef.id,
            version: requestedStructureRef.version
        };
        let structureData = workspace.getHeaderStructureData();
        if (Utils.isSpecificAgency(reformedQuery) && Utils.isSpecificId(reformedQuery) && Utils.isSpecificVersion(reformedQuery)) {
            if (workspace.getDatasets().length !== 1) {
                return {
                    status: FAILURE_CODE,
                    error: "Error in Identification: Expected 1 dataset in response, but there are " + workspace.getDatasets().length + "."
                }
            }
            let structureId = structureData[0].getIdentification();
            if (reformedQuery.version !== Utils.getLatestStableOperator(test.apiVersion)) {
                if (structureId.getAgencyId() !== reformedQuery.agency ||
                    structureId.getId() !== reformedQuery.id ||
                    structureId.getVersion() !== reformedQuery.version) {
                    return {
                        status: FAILURE_CODE,
                        error: "Error in Identification: Requested data for DATAFLOW " + JSON.stringify(reformedQuery) + " but got dataset for " + structureId
                    }
                }
            } else {
                if (structureId.getAgencyId() !== reformedQuery.agency ||
                    structureId.getId() !== reformedQuery.id) {
                    return {
                        status: FAILURE_CODE,
                        error: "Error in Identification: Requested data for DATAFLOW " + JSON.stringify(reformedQuery) + " but got dataset for " + structureId
                    }
                }
            }
        } else {
            for (let i in structureData) {
                if (structureData[i].getIdentification().getId() !== reformedQuery.id) {
                    return { status: FAILURE_CODE, error: "Error in Identification: Requested data for DATAFLOW with id: " + reformedQuery.id + " but got dataset for id: " + structureData[i].getIdentification().getId() }
                }
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkExtendedResourceIdentification(test, query, workspace) {
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (test.reqTemplate.key === DATA_QUERY_KEY.FULL_KEY ||
            test.reqTemplate.key === DATA_QUERY_KEY.PARTIAL_KEY ||
            test.reqTemplate.key === DATA_QUERY_KEY.MANY_KEYS) {
            return this._validateSeriesAgainstKey(test, query, workspace)
        }
        return { status: SUCCESS_CODE }
    }

    static _validateSeriesAgainstKey(test, query, workspace) {
        // Note: In the following checks only the OR operator is supported.
        let operator = Utils.getOROperator(test.apiVersion);
        let wildcard = Utils.getDimensionWildcard(test.apiVersion);

        let errors = [];
        let dimensions = test.dsdObj.getDimensions();
        dimensions.forEach(dimensionObj => {
            let dimensionValue = DataRequestPropsBuilder.extractDimValuesFromQuery(test, query, dimensionObj);
            workspace.getAllSeries().forEach((seriesObj, index) => {
                let counter = index + 1;
                let attributes = seriesObj.getAttributes();
                // Check if the dimension is included in series attributes
                if (Object.prototype.hasOwnProperty.call(attributes, dimensionObj.getId())) {
                    // If the dimension is not wildcarded, check if the series attribute value
                    // is among the requested ones.
                    if (dimensionValue && dimensionValue !== wildcard) {
                        let valuesList = dimensionValue.split(operator);
                        let attributeValue = attributes[dimensionObj.getId()];
                        // Check if the attribute value is included in the requested values for the dimension.
                        if (!valuesList.includes(attributeValue)) {
                            this._addError(errors, "Series #" + counter + ": Attribute " + dimensionObj.getId() + "=" + attributeValue + " is not compliant with the requested value(s)='" + valuesList + "'");
                        } else {
                            console.debug("Series #" + counter + ": Attribute " + dimensionObj.getId() + "=" + attributeValue + " is compliant with the requested value(s)='" + valuesList + "'");
                        }
                    } else {
                        console.debug("Series #" + counter + ": Attribute values for " + dimensionObj.getId() + " will not be checked.");
                    }
                } else {
                    this._addError(errors, "Series #" + counter + ": Dimension " + dimensionObj.getId() + " is not present in series attributes.");
                }
            });
        });
        if (errors.length > 0) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Extended Resource Identification: There are series that do not comply with the requested key. " + JSON.stringify(errors)
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _addError(errors, msg) {
        console.error(msg);
        errors.push(msg);
    }   

    static _checkFurtherDescribingResults(test, query, workspace) {
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        //TODO: Change it if a way to check this case, is determined.
        if (test.reqTemplate.updatedAfter || test.reqTemplate.includeHistory) {
            return { status: SUCCESS_CODE };
        }
        /*Check if the observations under validation are between the specified time period */
        if (test.reqTemplate.startPeriod === true || test.reqTemplate.endPeriod === true) {
            let periods = DataRequestPropsBuilder.extractStartEndPeriodFromQuery(test.apiVersion, query);
            let result = this._checkPeriods(periods, workspace);
            if (result.status === FAILURE_CODE) {
                return result;
            }
        }
        /*Check if the observations under validation are the first or last N of an indicative series*/
        if (test.reqTemplate.firstNObservations || test.reqTemplate.lastNObservations) {
            let result = this._checkObservations(test, query, workspace);
            if (result.status === FAILURE_CODE) {
                return result
            }
        }
        /*Check if the xml is of the requested detail*/
        if (test.reqTemplate.detail) {
            let result = this._checkDetail(test, workspace);
            if (result.status === FAILURE_CODE) {
                return result
            }
        } else if (test.reqTemplate.attributes) {
            let result = this._checkAttributes(test, query, workspace);
            if (result.status === FAILURE_CODE) {
                return result;
            }
        } else if (test.reqTemplate.measures) {
            let result = this._checkMeasures(test, query, workspace)
            if (result.status === FAILURE_CODE) {
                return result;
            }
        }
        /*Check the dimension at observation in response*/
        if (test.reqTemplate.dimensionAtObservation) {
            let result = this._checkDimensionAtObservation(test, query, workspace)
            if (result.status === FAILURE_CODE) {
                return result;
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkDimensionAtObservation(test,query,workspace){
        if(test.reqTemplate.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD){
            return this._validateDimAtObsTimePeriod(workspace)
        }else if(test.reqTemplate.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.DIMENSION){
            return this._validateDimAtObsDimension(workspace,query.obsDimension)
        }else if(test.reqTemplate.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.ALLDIMENSIONS){
             return this._validateDimAtObsAllDimensions(workspace)
        }else if(test.reqTemplate.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.NOT_PROVIDED){
             return this._validateDimAtObsNotProvided(workspace,test);
        }
    }
    //TODO: Currently not in use. It was used as a validation in dimensionAtObservation tests
    static _validateAttributesPositioning(workspace,test){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        let mandatoryAttributes = test.dsdObj.getMandatoryAttributes();

        for(let i in mandatoryAttributes){
            let attr = mandatoryAttributes[i];
            let relationships = attr.getAttributeRelationship();
            //IF ATTRIBUTE HAS NO RELATIONSHIP
            if(relationships.length === 0 || (relationships.length>0 && relationships.every(rel=>rel.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.NONE))){
                if(workspace.getDatasets().length === 0){
                    throw new Error("No Datasets returned")
                }
                if(workspace.getDatasets().some(dts => Object.keys(dts.getAttributes()).indexOf(attr.getId())===-1)){
                    return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Attribute "+attr.getId()+" should have been in Datasets as it references none." }
                }
            }else{
                //IF ATTRIBUTE HAS ONE RELATIONSHIP TO PRIMARY MEASURE
                if(relationships.every(rel=>rel.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.PRIMARY_MEASURE)){
                    if(workspace.getAllObservations().length === 0){
                        throw new Error("No Observations returned")
                    }
                    if(workspace.getAllObservations().some(obs => Object.keys(obs.getAttributes()).indexOf(attr.getId()) === -1)){
                        return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Attribute "+attr.getId()+" should have been in Observations as it references a primary measure." }
                    }
                //IF ATTRIBUTE HAS ONE RELATIONSHIP TO DIMENSION(S)
                }else if (relationships.every(rel=>rel.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION)){
                    let groupsReferencingDimensions = test.dsdObj.getGroups().filter(group=>{
                        return group.getDimensionReferences().every(dimensionId=>{
                            return relationships.some(rel=>rel.getId() === dimensionId)
                        })
                    })
                    if(groupsReferencingDimensions.length > 0){
                        let groupsWithSpecificId  = workspace.getAllGroups().filter(group=>{
                            return groupsReferencingDimensions.some(dsdGroups => dsdGroups.getId() === group.getId())
                        });
                        if(groupsWithSpecificId.length === 0){
                            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Attribute "+attr.getId()+" references relationship with dimensions in group but there is no such group in workspace." }
                        }
                        
                        if(groupsWithSpecificId.some(group=>Object.keys(group.getAttributes()).indexOf(attr.getId())===-1)){
                            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Attribute "+attr.getId()+" is not an attribute of all the groups that has a relationship with." }
                        }
                    }else{
                        let dimensionInObsLevel = relationships.some(rel=>{
                            let observations= workspace.getAllObservations();
                            return observations.every(obs=>Object.keys(obs.getAttributes()).indexOf(rel.getId())!==-1)
                        })
                        if(dimensionInObsLevel){
                            if(workspace.getAllObservations().some(obs => Object.keys(obs.getAttributes()).indexOf(attr.getId())===-1)){
                                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Attribute "+attr.getId()+" should have been in Observations as it references at least one dimension in that level." }
                            }
                        }else{
                            if(workspace.getAllSeries().some(obs => Object.keys(obs.getAttributes()).indexOf(attr.getId())===-1)){
                                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Attribute "+attr.getId()+" should have been in Series as it references dimensions in series level." }
                            }
                        }
                    
                    }
                //IF ATTRIBUTE HAS ONE RELATIONSHIP TO GROUP(S)
                }else if(relationships.every(rel=>rel.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.ATTACHMENT_GROUP) || relationships.every(rel=>rel.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.GROUP)){
                    for(let i in relationships){
                        let groupsToCheck = workspace.getAllGroups().filter(group => group.getId() === relationships[i].getId())
                        if(groupsToCheck.length === 0){
                            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Attribute "+attr.getId()+" references relationship with group(s) but there are no such groups in workspace." }
                        }
                        if(groupsToCheck.some(group=>Object.keys(group.getAttributes()).indexOf(attr.getId())===-1)){
                            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Attribute "+attr.getId()+" is not an attribute of all the groups that has a relationship with." }
                        }
                    }
                }
            }
        }
            return { status: SUCCESS_CODE }       
    }
    static _validateDimAtObsTimePeriod(workspace){
        let datasets = workspace.getDatasets();
        if(datasets.length === 0){
            throw new Error("No Datasets returned.")
        }
        let isTimeSeriesViewCheck = datasets.every(dataset=>dataset.timeSeriesViewOfData()); 
        if(!isTimeSeriesViewCheck){
            return { status: FAILURE_CODE, error: "No time series view of data returned." }
        }
        let observations = workspace.getAllObservations();
        if(observations.length === 0){
            throw new Error("No Observations returned.")
        }

        //TIME_PERIOD must be as observation level
        let result = observations.filter(obs => Object.keys(obs.getAttributes()).indexOf("TIME_PERIOD") === -1)
        if(result.length > 0){return { status: FAILURE_CODE, error: "There are observations :"+JSON.stringify(result)+" without TIME_PERIOD attribute." }}
        
        return { status: SUCCESS_CODE } 
    }
    static _validateDimAtObsDimension(workspace,dimensionAtObservationId){
        if(!dimensionAtObservationId){
            throw new Error("Missing mandatory parameter 'dimensionId'")
        }

        let series = workspace.getAllSeries();
        if(series.length === 0){
            throw new Error("No Series returned.")
        }
        // TIME_PERIOD should be in series level
        let result = series.filter(s => Object.keys(s.getAttributes()).indexOf("TIME_PERIOD") === -1 )
        if(result.length > 0){
            let invalidSeriesAttributes = []
            result.forEach(s=>invalidSeriesAttributes.push(s.getAttributes()))
            return { status: FAILURE_CODE, error: "There are series:"+JSON.stringify(invalidSeriesAttributes)+" that do not contain TIME_PERIOD attribute." }
        }
        let observations = workspace.getAllObservations()
        if(observations.length === 0){
            throw new Error("No Observations returned.")
        }
       
        //dimension at observation should be at observations level
        result = observations.filter(obs => Object.keys(obs.getAttributes()).indexOf(dimensionAtObservationId) === -1)
        if(result.length > 0){
            return { status: FAILURE_CODE, error: "There are observations: "+JSON.stringify(result)+" without "+dimensionAtObservationId+" attribute." }
        }
        return { status: SUCCESS_CODE } 
    }
    static _validateDimAtObsAllDimensions(workspace){
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        let datasets = workspace.getDatasets();
        if(datasets.length === 0){
            throw new Error("No Datasets returned.")
        }
        let isFlatViewCheck = datasets.every(dataset=>dataset.flatViewOfData()); 
        if(!isFlatViewCheck){
            return { status: FAILURE_CODE, error: "No flat view of data returned." }
        }
        return { status: SUCCESS_CODE }
    }
    static _validateDimAtObsNotProvided(workspace,test){
        if(test.dsdObj.hasTimeDimension()){
            return this._validateDimAtObsTimePeriod(workspace)
        }else if(test.dsdObj.hasMeasureDimension()){
            let measureDim = test.dsdObj.getMeasureDimension();
            return this._validateDimAtObsDimension(workspace,measureDim.getId())
        }
        return this._validateDimAtObsAllDimensions(workspace,test)
    }
    static _checkDetail(test, workspace) {
        let dfObj = test.structureWorkspace.getSdmxObject(new StructureReference(test.identifiers.structureType,
            test.identifiers.agency,
            test.identifiers.id,
            test.identifiers.version))

        let dsdObj = test.structureWorkspace.getSdmxObject(dfObj.getChildren().find(child => child.getStructureType() === SDMX_STRUCTURE_TYPE.DSD.key));
        let allSeries = workspace.getAllSeries();

        if (test.reqTemplate.detail === DATA_QUERY_DETAIL.FULL) {
            return { status: SUCCESS_CODE }
        } else if (test.reqTemplate.detail === DATA_QUERY_DETAIL.DATA_ONLY) {
            if (allSeries.length === 0) {
                return { status: FAILURE_CODE, error: "No series found." }
            }
            if (workspace.getAllObservations().length === 0) {
                return { status: FAILURE_CODE, error: "No observations found." }
            }
            if (workspace.getAllGroups().length > 0) {
                return { status: FAILURE_CODE, error: "Groups are not allowed." }
            }
            let inValidSeries = allSeries.filter(s => {
                return Object.getOwnPropertyNames(s.getAttributes()).some(attribute => dsdObj.getAttributes().some(attr => attr.getId() === attribute))
            })
            if (inValidSeries.length > 0) {
                return { status: FAILURE_CODE, error: "Series are not allowed to have attributes other than dsd dimensions." }
            }
            return { status: SUCCESS_CODE }
        } else if (test.reqTemplate.detail === DATA_QUERY_DETAIL.NO_DATA) {
            if (workspace.getAllObservations().length > 0) {
                return { status: FAILURE_CODE, error: "Observations are not allowed." }
            }
            if (allSeries.length === 0) {
                return { status: FAILURE_CODE, error: "No series found." }
            }
            let inValidSeries = allSeries.filter(s => {
                return Object.getOwnPropertyNames(s.getAttributes()).some(attr => !dsdObj.getComponents().find(comp => comp.getId() == attr))
            })
            if (inValidSeries.length > 0) {
                return { status: FAILURE_CODE, error: "Series are not allowed to have attributes other than dsd dimensions or dsd attributes" }
            }
            return { status: SUCCESS_CODE }
        } else if (test.reqTemplate.detail === DATA_QUERY_DETAIL.SERIES_KEYS_ONLY) {
            if (workspace.getAllObservations().length > 0) {
                return { status: FAILURE_CODE, error: "Observations are not allowed." }
            }
            if (workspace.getAllGroups().length > 0) {
                return { status: FAILURE_CODE, error: "Groups are not allowed." }
            }
            if (allSeries.length === 0) {
                return { status: FAILURE_CODE, error: "No series found." }
            }
            let inValidSeries = allSeries.filter(s => {
                return Object.getOwnPropertyNames(s.getAttributes()).some(attr => !dsdObj.getDimensions().some(dim => dim.getId() === attr))
            })
            if (inValidSeries.length > 0) {
                return { status: FAILURE_CODE, error: "Series are not allowed to have attributes other than dsd dimensions." }
            }
            return { status: SUCCESS_CODE }
        }
    }
    static _checkPeriods(periods, workspace) {
        console.log("Before checking periods", JSON.stringify(periods));
        if (periods.startPeriod && !periods.endPeriod) {
            let requestedStartingDate = periods.startPeriod;

            let result = workspace.getAllObservations().filter(obs => {
                return !obs.isAfterDate(requestedStartingDate)
            });
            if (result.length > 0) {
                return { status: FAILURE_CODE, error: "There are observations: "+JSON.stringify(result)+" before the start period set." }
            }
        } else if (!periods.startPeriod && periods.endPeriod) {
            let requestedEndingDate = periods.endPeriod;

            let result = workspace.getAllObservations().filter(obs => {
                return !obs.isBeforeDate(requestedEndingDate)
            });
            if (result.length > 0) {
                return { status: FAILURE_CODE, error: "There are observations: "+JSON.stringify(result)+" after the end period set." }
            }
        } else if (periods.startPeriod && periods.endPeriod) {
            let requestedStartingDate = periods.startPeriod;
            let requestedEndingDate = periods.endPeriod;

            let result = workspace.getAllObservations().filter(obs => {
                return !(obs.isBeforeDate(requestedEndingDate) && obs.isAfterDate(requestedStartingDate))
            });
            if (result.length > 0) {
                return { status: FAILURE_CODE, error: "There are observations: "+JSON.stringify(result)+" that are not between the starting and ending period." }
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkObservations(test, query, workspace) {
        let seriesObjToCheck = workspace.getAllSeries().find(s => {
            return s.equals(test.indicativeSeries)
        })
        let allObsOfIndicativeSerie = test.indicativeSeries.getObservations();
        let periods = DataRequestPropsBuilder.extractStartEndPeriodFromQuery(test.apiVersion, query);
        if (periods.startPeriod || periods.endPeriod) {
            allObsOfIndicativeSerie = test.indicativeSeries.getObservationsBetweenPeriod(periods.startPeriod, periods.endPeriod);
        }

        if (query.firstNObs) {
            if (seriesObjToCheck.getObservations().length > query.firstNObs) {
                return { status: FAILURE_CODE, error: "Found " + seriesObjToCheck.getObservations().length + " instead of " + query.firstNObs + "." }
            }
            //covers the case where the number of observations are fewer than the requested N first observations
            let obsLimit = (allObsOfIndicativeSerie.length < query.firstNObs)?allObsOfIndicativeSerie.length:query.firstNObs

            for (let i = 0; i < obsLimit; i++) {
                if(!seriesObjToCheck.getObservations().some(obs=> obs.equals(allObsOfIndicativeSerie[i]))){
                     return { status: FAILURE_CODE, error: "Observations found are not the first " + query.firstNObs + "." }
                }
            }
        }
        if (query.lastNObs) {
            if (seriesObjToCheck.getObservations().length > query.lastNObs) {
                return { status: FAILURE_CODE, error: "Found " + seriesObjToCheck.getObservations().length + " instead of " + query.lastNObs + "." }
            }
            //covers the case where the number of observations are fewer than the requested N last observations
            let obsLimit = (allObsOfIndicativeSerie.length < query.lastNObs)?allObsOfIndicativeSerie.length:allObsOfIndicativeSerie.length - query.lastNObs
            for (let i = allObsOfIndicativeSerie.length - 1; i >= obsLimit; i--) {
                if(!seriesObjToCheck.getObservations().some(obs=> obs.equals(allObsOfIndicativeSerie[i]))){
                    return { status: FAILURE_CODE, error: "Observations found are not the last " + query.lastNObs + "." }
                }
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkDataAvailability(test, query, workspace) {
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        let constraintsArr = workspace.getDataConstraints();
        if (constraintsArr.length !== 1) {
            throw new Error("Wrong number of constraints returned. Expected one constraint but got " + constraintsArr.length);
        }
        let constraint = constraintsArr[0];
        if (!constraint || !constraint instanceof ContentConstraintObject) {
            throw new Error("Missing mandatory parameter 'constraint'")
        }
        
        let requestedStructureRef = DataRequestPropsBuilder.extractStructureRefFromQuery(query);
        let isConstraintRefValid = constraint.getChildren().some(ref => {
            return ref.getStructureType() === requestedStructureRef.structureType
                && ref.getAgencyId() === requestedStructureRef.agencyId
                && ref.getId() === requestedStructureRef.id
                && ref.getVersion() === requestedStructureRef.version
        });
        if (!isConstraintRefValid) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. Constraint does not reference the requested structure: " + JSON.stringify(requestedStructureRef)
            };
        }
        // Check parent test for data availability
        if (test.isParent === true) {
            let cubeRegions = constraint.getCubeRegions();
            if (cubeRegions.length === 0) {
                throw new Error("The constraint does not have any cube regions.");
            }

            let keyValues = cubeRegions[0].getKeyValues();
            if (keyValues.length === 0) {
                throw new Error("The cube region does not have any keyValues.");
            }
        }

        if (test.reqTemplate.mode === DATA_QUERY_MODE.EXACT) {
            // EXACT MODE = acts as AND operator for dimensions
            return this._checkModeExact(test, query, constraint);
        }
        if (test.reqTemplate.mode === DATA_QUERY_MODE.AVAILABLE) {
            // AVAILABLE MODE = acts as OR operator for dimensions
            return this._checkModeAvailable(test, query, constraint);
        }
        if (test.reqTemplate.startPeriod || test.reqTemplate.endPeriod) {
            return this._checkTemporalCoverage(test, constraint);
        }
        if (test.reqTemplate.metrics) {
            return this._checkMetrics(constraint);
        }
        if (test.reqTemplate.component) {
            return this._checkSingleDimension(test, query, constraint);
        }
        if (test.reqTemplate.references) {
            return this._checkReferences(test, query, workspace, constraint);
        }
        return { status: SUCCESS_CODE }
    }

    static _checkModeExact(test, query, constraint) {
        let cubeRegions = constraint.getCubeRegions();
        if (cubeRegions.length > 2) {
            throw new Error("The constraint is expected to have one CubeRegion but it has " + cubeRegions.length+ " instead.");
        }
        if (cubeRegions.length === 0 || cubeRegions.every(cubeRegion => cubeRegion.getKeyValues().length === 0)) {
            return { status: SUCCESS_CODE }
        }
        let errors = [];
        let result = cubeRegions[0].getKeyValues().every(keyValue => {
            let dimension = test.dsdObj.getDimensionById(keyValue.getId());
            if (dimension) {
                let dimensionValue = DataRequestPropsBuilder.extractDimValuesFromQuery(test, query, dimension);
                console.log("#_checkModeExact: KeyValue=" + keyValue.getId(), "position=" + dimension.getPosition(), "value=" + dimensionValue);

                // Note: In the following checks only the OR operator is supported.
                let operator = Utils.getOROperator(test.apiVersion);

                // If the dimension value does not contain the OR operator
                // the KeyValue must have only the requested value.
                if (dimensionValue.indexOf(operator) === -1) {
                    if (keyValue.hasOnlyNValues(1)) {
                        if (keyValue.hasValue(dimensionValue)) {
                            return true;
                        } else {
                            errors.push("KeyValue " + keyValue.getId() + " does not include value: " + dimensionValue + ".");
                            return false;
                        }
                    } else {
                        errors.push("KeyValue " + keyValue.getId() + " has not the expected number of values. Expected 1 value but got " + keyValue.getNumberOfValues() + ".");
                        return false;
                    }
                } else {
                    // If multiple values are requested for the dimension then 
                    // the KeyValue must have at least one of them.
                    if (keyValue.hasAtLeastNValues(1) && keyValue.hasAtMostNValues(2)) {
                        // Note: We have made the assumption that operands are always two,
                        // because all tests that have been defined have one or two operands.
                        let values = dimensionValue.split(operator);
                        if (keyValue.hasValue(values[0]) || keyValue.hasValue(values[1])) {
                            return true;
                        } else {
                            errors.push("KeyValue " + keyValue.getId() + " does not include values: " + values[0] + " OR " + values[1] + ".");
                            return false;
                        }
                    } else {
                        errors.push("KeyValue " + keyValue.getId() + " has not the expected number of values. Expected 1 or 2 values but got " + keyValue.getNumberOfValues() + ".");
                        return false;
                    }
                }
            } else {
                errors.push("No dimension found for the KeyValue " + keyValue.getId() + ".");
                return false;
            }
        });
        if (!result) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. " + errors.join(".")
            };
        }
        return { status: SUCCESS_CODE }
    }

    static _checkModeAvailable(test, query, constraint) {
        let cubeRegions = constraint.getCubeRegions();
        if (cubeRegions.length > 2) {
            throw new Error("The constraint is expected to have one CubeRegion but it has " + cubeRegions.length + " instead.");
        }
        if (cubeRegions.length === 0 || cubeRegions.every(cubeRegion => cubeRegion.getKeyValues().length === 0)) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. No or empty Cube Region returned."
            };
        }
        let result = cubeRegions[0].getKeyValues().every(keyValue => {
            let dimension = test.dsdObj.getDimensionById(keyValue.getId());
            if (dimension) {
                let dimensionValue = DataRequestPropsBuilder.extractDimValuesFromQuery(test, query, dimension);
                console.log("#_checkModeAvailable: KeyValue=" + keyValue.getId(), "position=" + dimension.getPosition(), "value=" + dimensionValue);

                // Note: In the following checks only the OR operator is supported.
                let operator = Utils.getOROperator(test.apiVersion);
                if (dimensionValue.indexOf(operator) === -1) {
                    if (keyValue.hasValue(dimensionValue)) {
                        return true;
                    } else {
                        errors.push("KeyValue " + keyValue.getId() + " does not include value: " + dimensionValue + ".");
                        return false;
                    }
                } else {
                    // If multiple values are requested for the dimension then the KeyValue must have at least one of them.
                    // Note: We have made the assumption that operands are always two, 
                    // because all tests that have been defined have one or two operands.
                    let values = dimensionValue.split(operator);
                    if (keyValue.hasValue(values[0]) || keyValue.hasValue(values[1])) {
                        return true;
                    } else {
                        errors.push("KeyValue " + keyValue.getId() + " does not include values: " + values[0] + " OR " + values[1] + ".");
                        return false;
                    }
                }
            } else {
                errors.push("No dimension found for the KeyValue " + keyValue.getId() + ".");
                return false;
            }
        });
        if (!result) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. " + errors.join(".")
            };
        }
        return { status: SUCCESS_CODE }
    }

    static _checkTemporalCoverage(test, constraint) {
        let constraintRefPeriod = constraint.getReferencePeriod()
        if (constraintRefPeriod) {
            if (test.reqTemplate.startPeriod && !test.reqTemplate.endPeriod) {
                let result = constraintRefPeriod.isAfterDate(test.reqTemplate.startPeriod);
                if (!result) {
                    return {
                        status: FAILURE_CODE,
                        error: "Error in Data Availability Temporal Coverage semantic check. StartTime of ReferencePeriod attribute of the constraint does not comply with the requested one"
                    };
                }
            } else if (!test.reqTemplate.startPeriod && test.reqTemplate.endPeriod) {
                let result = constraintRefPeriod.isBeforeDate(test.reqTemplate.endPeriod);
                if (!result) {
                    return {
                        status: FAILURE_CODE,
                        error: "Error in Data Availability Temporal Coverage semantic check. EndTime of ReferencePeriod attribute of the constraint does not comply with the requested one"
                    };
                }
            } else if (test.reqTemplate.startPeriod && test.reqTemplate.endPeriod) {
                let result = constraintRefPeriod.isAfterDate(test.reqTemplate.startPeriod) && constraintRefPeriod.isBeforeDate(test.reqTemplate.endPeriod);
                if (!result) {
                    return {
                        status: FAILURE_CODE,
                        error: "Error in Data Availability Temporal Coverage semantic check. ReferencePeriod attribute of the constraint does not comply with the requested StartPeriod or EndPeriod."
                    };
                }
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkMetrics(constraint) {
        let constraintAnnotations = constraint.getAnnotations();
        let result = true;
        if (constraintAnnotations) {
            result = constraintAnnotations.every(annotation => {
                return (annotation.getId() === 'series_count' || annotation.getId() === 'obs_count')
                    && annotation.getType() === 'sdmx_metrics'
                    && Number.isInteger(parseInt(annotation.getTitle())) 
                    && parseInt(annotation.getTitle()) > 0;
            });
        }
        if (!result) {
            return { 
                status: FAILURE_CODE, 
                error: "Error in Data Availability Metric semantic check. Invalid Annotation." 
            };
        }
        return { status: SUCCESS_CODE }
    }

    static _checkSingleDimension(test, query, constraint) {
        let cubeRegions = constraint.getCubeRegions();
        if (cubeRegions.length !== 1) {
            return { 
                status: FAILURE_CODE, 
                error: "Error in Data Availability semantic check. The response contains " + cubeRegions.length + " cubeRegions instead of 1." 
            };
        }
        if (cubeRegions[0].getKeyValues().length > 1) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. The response contains " + cubeRegions[0].getKeyValues().length + " keyValues instead of 1."
            };
        }

        //Check if there is only one keyValue in response
        let foundKeyValue = cubeRegions[0].getKeyValues().find(keyVal => keyVal.getId() === query.component);
        if (!foundKeyValue) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. KeyValue found, does not have the dimension id requested."
            };
        }
        let parentWorkspace = SdmxStructureObjects.fromJson(test.parentWorkspace);
        let parentConstraint = parentWorkspace.getDataConstraints();
        if (!parentConstraint) { 
            throw new Error("No parent constraint to perform validation.");
        };

        parentConstraint = ContentConstraintObject.fromJSON(parentConstraint[0])
        //Check parent workspace to have the basic properties.
        let parentCubeRegions = parentConstraint.getCubeRegions();
        if (parentCubeRegions.length === 0) { 
            throw new Error("The parent constraint does not have any cube regions.") 
        };
        let parentKeyValues = parentCubeRegions[0].getKeyValues();
        if (parentKeyValues.length === 0) { 
            throw new Error("The cube region of parent constraint does not have any keyValues.");
        };

        let parentKeyValue = parentKeyValues.find(pKeyVal => pKeyVal.getId() === query.component);

        //Check if the keyValue found contains the proper values from the parent workspace (the one containing all the keyValues)
        if (!parentKeyValue.equals(foundKeyValue)) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. KeyValue found, does not have the correct values."
            };
        }
        return { status: SUCCESS_CODE }
    }

    static _checkReferences(test, query, workspace, constraint) {
        if (test.reqTemplate.references === STRUCTURE_REST_RESOURCE.datastructure) {
            return this._checkReferencedDSD(test, query, workspace, constraint);
        } else if (test.reqTemplate.references === STRUCTURE_REST_RESOURCE.dataflow) {
            return this._checkReferencedDF(test, query, workspace, constraint);
        } else if (test.reqTemplate.references === STRUCTURE_REST_RESOURCE.codelist) {
            return this._checkReferencedCodelists(test, workspace, constraint);
        } else if (test.reqTemplate.references === STRUCTURE_REST_RESOURCE.conceptscheme) {
            return this._checkReferencedConceptSchemes(test, query, workspace, constraint);
        } else if (test.reqTemplate.references === STRUCTURE_REST_RESOURCE.dataproviderscheme) {
            return this._checkReferencedProviderScheme(test, query, workspace);
        } else if (test.reqTemplate.references === "all") {
            return this._checkAllReferences(test, query, workspace, constraint);
        }
    }

    static _checkReferencedDSD(test, query, workspace, constraint) {
        //check if the requested DF is referenced in constraint
        let requestedStructureRef = DataRequestPropsBuilder.extractStructureRefFromQuery(query);
        let refDfOfConstraint = constraint.getChildren().find(child => child.getStructureType() === SDMX_STRUCTURE_TYPE.DATAFLOW.key)
        if (refDfOfConstraint.getStructureType() !== requestedStructureRef.structureType
            || refDfOfConstraint.getAgencyId() !== requestedStructureRef.agencyId
            || refDfOfConstraint.getId() !== requestedStructureRef.id
            || refDfOfConstraint.getVersion() !== requestedStructureRef.version) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. The constraint references wrong DF."
            };
        }

        let dsdArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.DSD.key)
        if (dsdArr.length !== 1) { return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. Wrong number of datastructures returned. There were " + dsdArr.length + " DSDs in response." } }
        let dsdObj = dsdArr[0];

        //check if the the DSD in response is the the same as the one referenced by the DF in the constraint.
        if (!dsdObj.asReference().equals(test.dsdObj.asReference())) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. The response does not contain the correct DSD"
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkReferencedDF(test, query, workspace, constraint) {
        let requestedStructureRef = DataRequestPropsBuilder.extractStructureRefFromQuery(query);
        //check if the requested DF is referenced in constraint
        let refDfOfConstraint = constraint.getChildren().find(child => child.getStructureType() === SDMX_STRUCTURE_TYPE.DATAFLOW.key);
        if (refDfOfConstraint.getStructureType() !== requestedStructureRef.structureType
            || refDfOfConstraint.getAgencyId() !== requestedStructureRef.agencyId
            || refDfOfConstraint.getId() !== requestedStructureRef.id
            || refDfOfConstraint.getVersion() !== requestedStructureRef.version) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. The constraint references wrong DF."
            };
        }
        let dfArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.DATAFLOW.key)
        if (dfArr.length !== 1) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. Wrong number of datastructures returned. There were " + dfArr.length + " DFs in response."
            };
        }
        let dfObj = dfArr[0];
        if (!dfObj.asReference().equals(refDfOfConstraint)) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. The DF in response is not the one references by the constraint."
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkReferencedCodelists(test, workspace, constraint) {
        let codelistsArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.CODE_LIST.key);
        if (codelistsArr.length === 0) {
            return {
                status: FAILURE_CODE, error: "Error in Data Availability semantic check. No codelists returned."
            }
        }

        let cubeRegions = constraint.getCubeRegions();
        if (cubeRegions.length !== 1) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. The response contains " + cubeRegions.length + " cubeRegions instead of 1."
            }
        }
        let cubeRegion = cubeRegions[0];
        
        let errors = [];
        
        // 1. check if all keyValue values are present in codelist
        let result = cubeRegion.getKeyValues().every(keyVal => {
            let dimension = test.dsdObj.getDimensionById(keyVal.getId());
            if (!dimension) {
                errors.push("No dimension found for the KeyValue " + keyVal.getId() + ".");
                return false;
            }
            let codelistRef = dimension.getReferences().find(ref => ref.getStructureType() === SDMX_STRUCTURE_TYPE.CODE_LIST.key);
            if (!codelistRef) {
                errors.push("Could not locate codelist for the dimension " + keyVal.getId() + ".")
                return false;
            }
            let codelistInResponse = workspace.getSdmxObject(codelistRef);
            if (!codelistInResponse) {
                errors.push("The codelist of the dimension " + keyVal.getId() + " is not found in the workspace.")
                return false;
            }
            let isValueValid = keyVal.getValues().every(value => {
                let foundInCodelist = codelistInResponse.hasItem(value);
                if (foundInCodelist === false) {
                    errors.push("Value " + value + " of KeyValue " + keyVal.getId() + " is not found in the codelist " + codelistRef);
                }
                return foundInCodelist;
            });
            return isValueValid;
        });

        // 2. check if the returned codelists contain only the values listed on KeyValues and their parents (if any).
        for (let c in codelistsArr) {
            let keyValueValues = [];
            // Get all KeyValues that use the specific codelist and concatenate their values in a new array.
            // We implement this approach to manage scenarios where multiple KeyValues utilize the same codelist.
            cubeRegion.getKeyValues().forEach(keyValue => {
                let dimension = test.dsdObj.getDimensionById(keyValue.getId());
                if (dimension) {
                    let codelistRef = dimension.getReferences().find(ref => ref.getStructureType() === SDMX_STRUCTURE_TYPE.CODE_LIST.key);
                    if (codelistRef && codelistRef.equals(codelistsArr[c].asReference())) {
                        keyValueValues.push(...keyValue.getValues());
                    }
                }
            });
            
            let invalidCodes = this._findNotUsedCodes(codelistsArr[c].getItems(), keyValueValues);
            if (invalidCodes.length > 0) {
                errors.push("Codelist " + codelistsArr[c].asReference() + " is invalid. It contains codes that are not included in KeyValues:" + invalidCodes);
                result = false;
            }
        }
        if (!result) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. " + errors.join(".")
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _findNotUsedCodes(allCodes, keyValues) {
        // Find all codes that are not used in keyvalues
        let notUsedCodes = [];
        for (let code of allCodes) {
            let isCodeUsedInKeyValue = keyValues.includes(code.getId());
            if (!isCodeUsedInKeyValue) {
                notUsedCodes.push(code.getId());
            }
        }
        // For each one of the used codes mark their parent as used (if any).
        for (let code of allCodes) {
            if (notUsedCodes.length === 0) {
                break;
            }
            let isUsed = notUsedCodes.every(el => el !== code.getId());
            if (isUsed && code.hasParent()) {
                // If the child code is used in KeyValues then its parent should be considered as used 
                // and therefore if it is listed among the unused codes it should be removed from there.
                let parents = this._findParents(allCodes, code, []);
                notUsedCodes = notUsedCodes.filter(el => !parents.includes(el));
            }
        }
        return notUsedCodes;
    }

    static _findParents(codelistCodes, code, parents) {
        if (code.hasParent()) {
            let parentCode = codelistCodes.find(el => el.getId() === code.getParentCode());
            parents.push(parentCode.getId());
            return this._findParents(codelistCodes, parentCode, parents);
        }
        return parents;
    }

    static _checkReferencedConceptSchemes(test, query, workspace, constraint) {
        let conceptSchemesArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key)
        if (conceptSchemesArr.length === 0) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. No concept schemes returned."
            }
        }

        let cubeRegions = constraint.getCubeRegions();
        if (cubeRegions.length !== 1) {
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. The response contains " + cubeRegions.length + " cubeRegions instead of 1."
            }
        }
        let cubeRegion = cubeRegions[0];

        let result = conceptSchemesArr.filter(cs => {
            return cubeRegion.getKeyValues().some(keyVal => {
                return cs.getItems().some(item => item.getId() === keyVal.getId()) === false;
            })
        })

        if (result.length > 0) {
            let invalidaConceptSchemes = [];
            result.forEach(cs => invalidaConceptSchemes.push(cs.asReference()))
            return {
                status: FAILURE_CODE,
                error: "Error in Data Availability semantic check. There are semantically invalid concept schemes in response" + JSON.stringify(invalidaConceptSchemes) + "."
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkReferencedProviderScheme(test, query, workspace) {
        let dataProviderSchemesArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key)
        if (dataProviderSchemesArr.length !== 1) { return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. Wrong number of provider schemes returned." } }

        let dataProviderScheme = dataProviderSchemesArr[0];

        let result = false;

        //this serves the references="all" query
        if (query.references === "all") {
            result = test.providerRefs.every(pRef => {
                return dataProviderScheme.getItems().some(item => item.getId() === pRef.identifiableIds[0])
            })
        } else if (query.references === STRUCTURE_REST_RESOURCE.dataproviderscheme) {
            result = dataProviderScheme.getItems().length === 1 && dataProviderScheme.getItems()[0].getId() === query.provider
        }

        if (!result) {
            return { 
                status: FAILURE_CODE, 
                error: "Error in Data Availability semantic check. Wrong provider id in response." 
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkAllReferences(test, query, workspace, constraint) {
        let validateRefDSD = this._checkReferencedDSD(test, query, workspace, constraint)
        if (validateRefDSD.status === FAILURE_CODE) {
            return validateRefDSD;
        }

        let validateRefDF = this._checkReferencedDF(test, query, workspace, constraint)
        if (validateRefDF.status === FAILURE_CODE) {
            return validateRefDF;
        }

        let validateRefCodelist = this._checkReferencedCodelists(test, workspace, constraint)
        if (validateRefCodelist.status === FAILURE_CODE) {
            return validateRefCodelist;
        }

        let validateRefConceptScheme = this._checkReferencedConceptSchemes(test, query, workspace, constraint)
        if (validateRefConceptScheme.status === FAILURE_CODE) {
            return validateRefConceptScheme;
        }

        let validateRefProviderScheme = this._checkReferencedProviderScheme(test, query, workspace)
        if (validateRefProviderScheme.status === FAILURE_CODE) {
            return validateRefProviderScheme;
        }

        return { status: SUCCESS_CODE }
    }

    static _checkAttributes(test, query, workspace) {
        if (test.reqTemplate.attributes === true) {
            return this._checkSpecificAttribute(test, query, workspace);
        } else if (test.reqTemplate.attributes === DATA_QUERY_ATTRIBUTES.DSD) {
            return this._checkDsdAttributes(test, workspace);
        } else if (test.reqTemplate.attributes === DATA_QUERY_ATTRIBUTES.MSD) {
            return this._checkMsdAttributes(test, workspace);
        } else if (test.reqTemplate.attributes === DATA_QUERY_ATTRIBUTES.DATASET) {
            return this._checkDatasetAttributes(test, workspace);
        } else if (test.reqTemplate.attributes === DATA_QUERY_ATTRIBUTES.SERIES) {
            return this._checkSeriesAttributes(test, workspace);
        } else if (test.reqTemplate.attributes === DATA_QUERY_ATTRIBUTES.OBS) {
            return this._checkObsAttributes(test, workspace);
        } else if (test.reqTemplate.attributes === DATA_QUERY_ATTRIBUTES.ALL) {
            return this._checkAllAttributes(test, workspace);
        } else if (test.reqTemplate.attributes === DATA_QUERY_ATTRIBUTES.NONE) {
            return this._checkNoAttributes(test, workspace);
        }
    }

    static _checkSpecificAttribute(test, query, workspace) {
        if (!query.attributes) {
            throw new Error("Attribute not specified in the query.");
        }
        let requestedAttribute = test.dsdObj.getAttributeById(query.attributes);
        if (!requestedAttribute) {
            throw new Error("Attribute not found in the DSD.");
        }
        let dsdAttributes = test.dsdObj.getAttributes();
        const notExpected = dsdAttributes.filter(attr => attr.getId() !== requestedAttribute.getId());
        for (let relationship of requestedAttribute.getAttributeRelationship()) {    
            if (relationship.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.DATAFLOW) {
                // Check dataset-level attributes
                let failed = workspace.getDatasets().some(function (dataset) {
                    let xmlAttributes = Object.keys(dataset.getAttributes());

                    return DataSemanticChecker._attributesMissing([requestedAttribute], xmlAttributes) ||
                        DataSemanticChecker._attributesFound(notExpected, xmlAttributes);
                });
                if (failed) {
                    return { status: FAILURE_CODE, error: "Only the requested attribute is expected in the dataset attributes." }
                }
            } else if (relationship.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.GROUP) {
                // Check group-level attributes
                let failed = workspace.getAllGroups().some(function (group) {
                    let xmlAttributes = Object.keys(group.getAttributes());

                    return DataSemanticChecker._attributesMissing([requestedAttribute], xmlAttributes) ||
                        DataSemanticChecker._attributesFound(notExpected, xmlAttributes);
                });
                if (failed) {
                    return { status: FAILURE_CODE, error: "Only the requested attribute is expected in the group attributes." }
                }
            } else if (relationship.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION) {
                // Check series-level attributes
                let failed = workspace.getAllSeries().some(function (series) {
                    let xmlAttributes = Object.keys(series.getAttributes());

                    return DataSemanticChecker._attributesMissing([requestedAttribute], xmlAttributes) ||
                        DataSemanticChecker._attributesFound(notExpected, xmlAttributes);
                });
                if (failed) {
                    return { status: FAILURE_CODE, error: "Only the requested attribute is expected in the series attributes." }
                }
            } else if (relationship.getRelationshipType() === ATTRIBUTE_RELATIONSHIP_NAMES.OBSERVATION) {
                // Check obs-level attributes
                let failed = workspace.getAllObservations().some(function (obs) {
                    let xmlAttributes = Object.keys(obs.getAttributes());

                    return DataSemanticChecker._attributesMissing([requestedAttribute], xmlAttributes) ||
                        DataSemanticChecker._attributesFound(notExpected, xmlAttributes);
                });
                if (failed) {
                    return { status: FAILURE_CODE, error: "Only the requested attribute is expected in the observation attributes." }
                }
            }
        }
        return { status: SUCCESS_CODE };
    }

    /* All the attributes defined in the data structure definition */
    static _checkDsdAttributes(test, workspace) {
        let result = this._checkDatasetAttributes(test, workspace)
        if (result.status === FAILURE_CODE) {
            return result;
        }
        result = this._checkSeriesAttributes(test, workspace)
        if (result.status === FAILURE_CODE) {
            return result;
        }
        result = this._checkObsAttributes(test, workspace)
        if (result.status === FAILURE_CODE) {
            return result;
        }
        return { status: SUCCESS_CODE };
    }

    /* All the attributes defined in the data structure definition */
    static _checkMsdAttributes(test, workspace) {
        return { status: SUCCESS_CODE }; //TODO To be implemented
    }

    /* All the attributes attached to the dataset-level */
    static _checkDatasetAttributes(test, workspace) {
        let attributes = test.dsdObj.getAttributesWithRelationship(ATTRIBUTE_RELATIONSHIP_NAMES.DATAFLOW);
        
        let failed = workspace.getDatasets().some(function (dataset) {
            return DataSemanticChecker._attributesMissing(attributes, Object.keys(dataset.getAttributes()));
        });
        if (failed) {
            return { status: FAILURE_CODE, error: "Not all DSD attributes are present in the dataset attributes." }
        }
        return { status: SUCCESS_CODE };
    }

    /* All the attributes attached to the series- and group-level) */
    static _checkSeriesAttributes(test, workspace) {
        let dsdAttributes = test.dsdObj.getAttributesWithRelationship(ATTRIBUTE_RELATIONSHIP_NAMES.DIMENSION);
        
        for (let att of dsdAttributes) {
            let dimensions = att.getAttributeRelationship().map(r => r.id);
            
            let group = null;
            if (test.dsdObj.hasGroups()) {
                group = test.dsdObj.getGroup(dimensions);
            }
            // The attribute should be a group-level attribute
            if (group) {
                let groups = workspace.getAllGroups().filter(g => {
                    return group.getId() === g.getId();
                });
                let failed = groups.some(function (g) {
                    return DataSemanticChecker._attributesMissing([att], Object.keys(g.getAttributes()));
                });
                if (failed) {
                    return { status: FAILURE_CODE, error: "Not all DSD attributes are present in the group attributes." }
                }
            } else { // The attribute should be a series-level attribute
                let failed = workspace.getAllSeries().some(function (s) {
                    return DataSemanticChecker._attributesMissing([att], Object.keys(s.getAttributes()));
                });
                if (failed) {
                    return { status: FAILURE_CODE, error: "Not all DSD attributes are present in the series attributes." }
                }
            }
        };
        return { status: SUCCESS_CODE };
    }

    /* All the attributes attached to the observation-level */
    static _checkObsAttributes(test, workspace) {
        let attributes = test.dsdObj.getAttributesWithRelationship(ATTRIBUTE_RELATIONSHIP_NAMES.OBSERVATION);
        
        let failed = workspace.getAllObservations().some(function (obs) {
            return DataSemanticChecker._attributesMissing(attributes, Object.keys(obs.getAttributes()));
        });
        if (failed) {
            return { status: FAILURE_CODE, error: "Not all DSD attributes are present in the observation attributes." }
        }
        return { status: SUCCESS_CODE };
    }

    /* All attributes */
    static _checkAllAttributes(test, workspace) {
        let result = this._checkDsdAttributes(test, workspace)
        if (result.status === FAILURE_CODE) {
            return result;
        }
        result = this._checkMsdAttributes(test, workspace)
        if (result.status === FAILURE_CODE) {
            return result;
        }
        return { status: SUCCESS_CODE };
    }

    /* No attributes */
    static _checkNoAttributes(test, workspace) {
        let dsdAttributes = test.dsdObj.getAttributes();
        
        // Check dataset-level attributes
        let failed = workspace.getDatasets().some(function (dataset) {
            let xmlAttributes = Object.keys(dataset.getAttributes());

            return DataSemanticChecker._attributesFound(dsdAttributes, xmlAttributes);
        });
        if (failed) {
            return { status: FAILURE_CODE, error: "No DSD attributes should be present in dataset attributes." }
        }

        // Check group-level attributes
        failed = workspace.getAllGroups().some(function (group) {
            let xmlAttributes = Object.keys(group.getAttributes());

            return DataSemanticChecker._attributesFound(dsdAttributes, xmlAttributes);
        });
        if (failed) {
            return { status: FAILURE_CODE, error: "No DSD attributes should be present in group attributes." }
        }

        // Check series-level attributes
        failed = workspace.getAllSeries().some(function (series) {
            let xmlAttributes = Object.keys(series.getAttributes());

            return DataSemanticChecker._attributesFound(dsdAttributes, xmlAttributes);
        });
        if (failed) {
            return { status: FAILURE_CODE, error: "No DSD attributes should be present in series attributes." }
        }

        // Check obs-level attributes
        failed = workspace.getAllObservations().some(function (obs) {
            let xmlAttributes = Object.keys(obs.getAttributes());

            return DataSemanticChecker._attributesFound(dsdAttributes, xmlAttributes);
        });
        if (failed) {
            return { status: FAILURE_CODE, error: "No DSD attributes should be present in observation attributes." }
        }
        return { status: SUCCESS_CODE };
    }

    /* Utility method that check if at least one MANDATORY attribute is missing from the XML attributes. */
    static _attributesMissing(dsdAttributes, xmlAttributes) {
        return dsdAttributes.some(function (a) {
            return xmlAttributes.indexOf(a.id) === -1 && a.isMandatory();
        });
    }

    static _attributesFound(dsdAttributes, xmlAttributes) {
        return dsdAttributes.some(function (a) {
            return xmlAttributes.indexOf(a.id) >= 0;
        });
    }

    static _checkMeasures(test, query, workspace) {
        if (test.reqTemplate.measures === true) {
            return DataSemanticChecker._checkSpecificMeasure(test, query, workspace);
        } else if (test.reqTemplate.measures === DATA_QUERY_MEASURES.ALL) {
            return DataSemanticChecker._checkAllMeasures(test, workspace);
        } else if (test.reqTemplate.measures === DATA_QUERY_MEASURES.NONE) {
            return DataSemanticChecker._checkNoMeasures(test, workspace);
        }
    }
    static _checkSpecificMeasure(test, query, workspace) {
        if (!query.measures) {
            throw new Error("Measure not specified in the query.");
        }
        let requestedMeasure = test.dsdObj.getMeasureById(query.measures);
        if (!requestedMeasure) {
            throw new Error("Measure not found in the DSD.");
        }
        let measures = test.dsdObj.getMeasures();
        const notExpected = measures.filter(m => m.getId() !== requestedMeasure.getId());

        // Check dataset-level attributes
        let failed = workspace.getAllObservations().some(function (obs) {
            let xmlAttributes = Object.keys(obs.getAttributes());

            return DataSemanticChecker._attributesMissing([requestedMeasure], xmlAttributes) ||
                DataSemanticChecker._attributesFound(notExpected, xmlAttributes);
        });
        if (failed) {
            return { status: FAILURE_CODE, error: "Only the requested measure is expected in observation attributes." }
        }
        return { status: SUCCESS_CODE };
    }

    static _checkAllMeasures(test, workspace) {
        let measures = test.dsdObj.getMeasures();
        
        // check if at least one MANDATORY measure is missing from the observation.
        let failed = workspace.getAllObservations().some(function (obs) {
            let xmlAttributes = Object.keys(obs.getAttributes());

            return DataSemanticChecker._attributesMissing(measures, xmlAttributes);
        });
        if (failed) {
            return { status: FAILURE_CODE, error: "Not all defined measures are present in the observations." }
        }
        return { status: SUCCESS_CODE };
    }

    static _checkNoMeasures(test, workspace) {
        let measures = test.dsdObj.getMeasures();
        
        let failed = workspace.getAllObservations().some(function (obs) {
            let xmlAttributes = Object.keys(obs.getAttributes());

            return DataSemanticChecker._attributesFound(measures, xmlAttributes);
        });
        if (failed) {
            return { status: FAILURE_CODE, error: "Measures should not be present in observations." }
        }
        return { status: SUCCESS_CODE };
    }
}

module.exports = DataSemanticChecker;