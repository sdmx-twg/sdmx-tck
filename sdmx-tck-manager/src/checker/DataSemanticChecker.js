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
var HelperManager = require('../manager/HelperManager.js');
var TestObjectBuilder = require("../builders/TestObjectBuilder.js");
const { DATA_QUERY_DETAIL } = require('sdmx-tck-api/src/constants/data-queries-constants/DataQueryDetail');
const DataStructureGroupObject = require('sdmx-tck-api/src/model/structure-queries-models/DataStructureGroupObject');
const TEST_TYPE = require('sdmx-tck-api').constants.TEST_TYPE;
const STRUCTURE_REFERENCE_DETAIL = require('sdmx-tck-api').constants.STRUCTURE_REFERENCE_DETAIL;
const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;
var ContentConstraintObject = require('sdmx-tck-api').model.ContentConstraintObject;
const DSD_COMPONENTS_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_NAMES
const DATA_QUERY_MODE = require('sdmx-tck-api').constants.DATA_QUERY_MODE
const DIMENSION_AT_OBSERVATION_CONSTANTS = require('sdmx-tck-api').constants.DIMENSION_AT_OBSERVATION_CONSTANTS;
const ATTRIBUTE_ASSIGNMENT_STATUS = require('sdmx-tck-api').constants.ATTRIBUTE_ASSIGNMENT_STATUS;
const ATTRIBUTE_RELATIONSHIP_NAMES = require('sdmx-tck-api').constants.ATTRIBUTE_RELATIONSHIP_NAMES;

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
                console.log(err)
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

        let identificationValidation = this._checkIdentification(query, workspace)
        if(identificationValidation.status === FAILURE_CODE){return identificationValidation}
        
        if (query.provider !== "all") {
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

    static _checkIdentification(query, workspace) {
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        let identifiers = query.flow.split(',');
        let requestedAgencyId; 
        let requestedId ;
        let requestedVersion ;

        if(identifiers.length === 1){
            requestedAgencyId="all"
            requestedId = identifiers[0]
            requestedVersion="latest"
        }else{
            requestedAgencyId = (identifiers[0] === "all" || !identifiers[0]) ? "all" : identifiers[0] 
            requestedId = identifiers[1]
            requestedVersion = (identifiers[2] === "latest" || !identifiers[2]) ? "latest" : identifiers[2]    
        }
       
        let reformedQuery = {
            agency: requestedAgencyId,
            id: requestedId,
            version: requestedVersion
        }
        
        let structureData = workspace.getHeaderStructureData()
        if (Utils.isSpecificAgency(reformedQuery) && Utils.isSpecificId(reformedQuery) && Utils.isSpecificVersion(reformedQuery)) {
            
            if(workspace.getDatasets().length !== 1){
                return { status: FAILURE_CODE, error: "Error in Identification: Expected 1 dataset in response, but there are "+workspace.getDatasets().length+"." }
            }
            let structureId = structureData[0].getIdentification()
            if(requestedVersion !== "latest"){
                if (structureId.getAgencyId() !== requestedAgencyId || structureId.getId() !== requestedId || structureId.getVersion() !== requestedVersion) {
                    return { status: FAILURE_CODE, error: "Error in Identification: Requested data for DATAFLOW "+JSON.stringify(reformedQuery)+" but got dataset for "+structureId }
                }
            }else{
                if (structureId.getAgencyId() !== requestedAgencyId || structureId.getId() !== requestedId) {
                    return { status: FAILURE_CODE, error: "Error in Identification: Requested data for DATAFLOW "+JSON.stringify(reformedQuery)+" but got dataset for "+structureId }
                }
            }
        }else{
            for(let i in structureData){
                if (structureData[i].getIdentification().getId() !== requestedId) {
                    return { status: FAILURE_CODE, error: "Error in Identification: Requested data for DATAFLOW with id: "+requestedId+" but got dataset for id: "+structureData[i].getIdentification().getId() }
                }
            }
           
        } 
        return { status: SUCCESS_CODE }
    }

    static _checkExtendedResourceIdentification(test, query, workspace) {
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (test.reqTemplate.key === DATA_QUERY_KEY.FULL_KEY || test.reqTemplate.key === DATA_QUERY_KEY.PARTIAL_KEY || test.reqTemplate.key === DATA_QUERY_KEY.MANY_KEYS) {
            return this._validateSeriesAgainstKey(query.key, workspace)
        }
        return { status: SUCCESS_CODE }

    }

    static _validateSeriesAgainstKey(key, workspace) {
        if (!key) {
            throw new Error("Missing mandatory parameter 'key'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        //TODO:IF THERE ARE MANY DATASETS WE HAVE TO SEARCH FOR EVERY ONE OF THEM?
        let series = workspace.getAllSeries();
        let result = series.filter(serieObj => {
            return !serieObj.complyWithRequestedKey(key)
        })
        if (result.length > 0) { return { status: FAILURE_CODE, error: "Error in Data Extended Resource Identification: There are series that do not comply with the requested key." + JSON.stringify(result) } }
        return { status: SUCCESS_CODE }

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
        if (query.updateAfter || query.history){
            return {status: SUCCESS_CODE};
        }

        /*Check if the observations under validation are between the specified time period */
        if (query.start || query.end) {
            let result = this._checkPeriods(test, query, workspace);
            if(result.status === FAILURE_CODE){return result}
        }

        /*Check if the observations under validation are the first or last N of an indicative series*/
        if (query.firstNObs || query.lastNObs) {
            let result = this._checkObservations(test, query, workspace);
            if(result.status === FAILURE_CODE){return result}
        }

        /*Check if the xml is of the requested detail*/
        if (query.detail) {
            let result = this._checkDetail(test, query, workspace);
            if(result.status === FAILURE_CODE){return result}
        }
        /*Check the dimension at observation in response*/
        if(query.obsDimension){
            let result =  this._checkDimensionAtObservation(test,query,workspace)
            if(result.status === FAILURE_CODE){return result;}
        }

        return { status: SUCCESS_CODE }
    }
    static _checkDimensionAtObservation(test,query,workspace){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        
        let attributesValidPositioning = this._validateAttributesPositioning(workspace,test);
        if(attributesValidPositioning.status === FAILURE_CODE){return attributesValidPositioning;}
       
        if(test.reqTemplate.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.TIME_PERIOD){
            return this._validateDimAtObsTimePeriod(workspace)
        }else if(test.reqTemplate.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.DIMENSION){
            return this._validateDimAtObsDimension(workspace,query.obsDimension)
        }else if(test.reqTemplate.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.ALLDIMENSIONS){
             return this._validateDimAtObsAllDimensions(workspace,test)
        }else if(test.reqTemplate.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.NOT_PROVIDED){
             return this._validateDimAtObsNotProvided(workspace,test);
        }
    }
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
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        let datasets = workspace.getDatasets();
        if(datasets.length === 0){
            throw new Error("No Datasets returned.")
        }
        let isTimeSeriesViewCheck = datasets.every(dataset=>dataset.timeSeriesViewOfData()); 
        if(!isTimeSeriesViewCheck){
            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. No time series view of data returned." }
        }
        let observations = workspace.getAllObservations();
        if(observations.length === 0){
            throw new Error("No Observations returned.")
        }
        let result = observations.filter(obs => Object.keys(obs.getAttributes()).indexOf("TIME_PERIOD") === -1)
        if(result.length > 0){return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are observations :"+JSON.stringify(result)+" without TIME_PERIOD attribute." }}
        
        return { status: SUCCESS_CODE } 
    }
    static _validateDimAtObsDimension(workspace,dimensionId){
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if(!dimensionId){
            throw new Error("Missing mandatory parameter 'dimensionId'")
        }

        let series = workspace.getAllSeries();
        if(series.length === 0){
            throw new Error("No Series returned.")
        }
        let result = series.filter(s => Object.keys(s.getAttributes()).indexOf("TIME_PERIOD") === -1 )
        if(result.length > 0){
            let invalidSeriesAttributes = []
            result.forEach(s=>invalidSeriesAttributes.push(s.getAttributes()))
            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are series:"+JSON.stringify(invalidSeriesAttributes)+" that do not contain TIME_PERIOD attribute." }
        }
        let observations = workspace.getAllObservations()
        if(observations.length === 0){
            throw new Error("No Observations returned.")
        }
        result = observations.filter(obs => Object.keys(obs.getAttributes()).indexOf(dimensionId) === -1)
        if(result.length > 0){
            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are observations: "+JSON.stringify(result)+" without TIME_PERIOD attribute." }
        }
        return { status: SUCCESS_CODE } 
    }
    static _validateDimAtObsAllDimensions(workspace,test){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        let datasets = workspace.getDatasets();
        if(datasets.length === 0){
            throw new Error("No Datasets returned.")
        }
        let isFlatViewCheck = datasets.every(dataset=>dataset.flatViewOfData()); 
        if(!isFlatViewCheck){
            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. No flat view of data returned." }
        }

        let result = workspace.getAllObservations().filter(obs => {
            return test.dsdObj.getDimensions().some(dim => Object.keys(obs.getAttributes()).indexOf(dim.getId()) === -1) 
        })   
        if(result.length>0){
            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are observations: "+JSON.stringify(result)+" that do not contain all dimensions." }
        }
        return { status: SUCCESS_CODE }
    }
    static _validateDimAtObsNotProvided(workspace,test){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if(test.dsdObj.hasTimeDimension()){
            return this._validateDimAtObsTimePeriod(workspace)
        }else if(test.dsdObj.hasMeasureDimension()){
            let measureDim = test.dsdObj.getMeasureDimension();
            return this._validateDimAtObsDimension(workspace,measureDim.getId())
        }
        return this._validateDimAtObsAllDimensions(workspace,test)
    }
    static _checkDetail(test, query, workspace) {
        let dfObj = test.structureWorkspace.getSdmxObject(new StructureReference(test.identifiers.structureType,
            test.identifiers.agency,
            test.identifiers.id,
            test.identifiers.version))

        let dsdObj = test.structureWorkspace.getSdmxObject(dfObj.getChildren().find(child => child.getStructureType() === SDMX_STRUCTURE_TYPE.DSD.key));
        let allSeries = workspace.getAllSeries();

        if (query.detail === DATA_QUERY_DETAIL.FULL) {
            return { status: SUCCESS_CODE }
        } else if (query.detail === DATA_QUERY_DETAIL.DATA_ONLY) {

            if (allSeries.length === 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. No series found when detail = dataonly" }
            }
            if (workspace.getAllObservations().length === 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. No observations found when detail = dataonly" }
            }
            if (workspace.getAllGroups().length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Groups are not allowed when detail = dataonly" }
            }
            let inValidSeries = allSeries.filter(s => {
                return Object.getOwnPropertyNames(s.getAttributes()).some(attribute => dsdObj.getAttributes().some(attr => attr.getId() === attribute))
            })
            if (inValidSeries.length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Series are not allowed to have attributes other than dsd dimensions." }
            }
            return { status: SUCCESS_CODE }
        } else if (query.detail === DATA_QUERY_DETAIL.NO_DATA) {
            if (workspace.getAllObservations().length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. No observations found when detail = nodata" }
            }
            if (allSeries.length === 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. No series found when detail = nodata" }
            }
            let inValidSeries = allSeries.filter(s => {
                return Object.getOwnPropertyNames(s.getAttributes()).some(attr => !dsdObj.getComponents().find(comp => comp.getId() == attr))
            })
            if (inValidSeries.length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Series are not allowed to have attributes other than dsd dimensions or dsd attributes" }
            }
            return { status: SUCCESS_CODE }
        } else if (query.detail === DATA_QUERY_DETAIL.SERIES_KEYS_ONLY) {
            if (workspace.getAllObservations().length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. No observations found when detail = serieskeysonly" }
            }
            if (workspace.getAllGroups().length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Groups are not allowed when detail = serieskeysonly" }
            }
            if (allSeries.length === 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. No series found when detail = serieskeysonly" }
            }
            let inValidSeries = allSeries.filter(s => {
                return Object.getOwnPropertyNames(s.getAttributes()).some(attr => !dsdObj.getDimensions().some(dim => dim.getId() === attr))
            })
            if (inValidSeries.length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Series are not allowed to have attributes other than dsd dimensions." }
            }
            return { status: SUCCESS_CODE }
        }
    }
    static _checkPeriods(test, query, workspace) {
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        if (query.start && !query.end) {

            let requestedStartingDate = query.start

            let result = workspace.getAllObservations().filter(obs => {
                return !obs.isAfterDate(requestedStartingDate)
            });
            if (result.length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are observations: "+JSON.stringify(result)+" before the start period set." }
            }
        } else if (!query.start && query.end) {
            let requestedEndingDate = query.end

            let result = workspace.getAllObservations().filter(obs => {
                return !obs.isBeforeDate(requestedEndingDate)
            });
            if (result.length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are observations: "+JSON.stringify(result)+" after the end period set." }
            }
        } else if (query.start && query.end) {
            let requestedStartingDate = query.start
            let requestedEndingDate = query.end

            let result = workspace.getAllObservations().filter(obs => {
                return !(obs.isBeforeDate(requestedEndingDate) && obs.isAfterDate(requestedStartingDate))
            });
            if (result.length>0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are observations: "+JSON.stringify(result)+" that are not between the starting and ending period." }
            }
        }
        return { status: SUCCESS_CODE }

    }

    static _checkObservations(test, query, workspace) {
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        let seriesObjToCheck = workspace.getAllSeries().find(s => {
            return s.equals(test.indicativeSeries)
        })
        let allObsOfIndicativeSerie = test.indicativeSeries.getObservations();
        if (query.start || query.end) {
            allObsOfIndicativeSerie = test.indicativeSeries.getObservationsBetweenPeriod(query.start, query.end)
        }


        if (query.firstNObs) {
            if (seriesObjToCheck.getObservations().length > query.firstNObs) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Found " + seriesObjToCheck.getObservations().length + " instead of " + query.firstNObs + "." }
            }
            //covers the case where the number of observations are fewer than the requested N first observations
            let obsLimit = (allObsOfIndicativeSerie.length < query.firstNObs)?allObsOfIndicativeSerie.length:query.firstNObs

            for (let i = 0; i < obsLimit; i++) {
                if(!seriesObjToCheck.getObservations().some(obs=> obs.equals(allObsOfIndicativeSerie[i]))){
                     return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Observations found are not the first " + query.firstNObs + "." }
                }
            }
        }
        if (query.lastNObs) {
            if (seriesObjToCheck.getObservations().length > query.lastNObs) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Found " + seriesObjToCheck.getObservations().length + " instead of " + query.lastNObs + "." }
            }
            //covers the case where the number of observations are fewer than the requested N last observations
            let obsLimit = (allObsOfIndicativeSerie.length < query.lastNObs)?allObsOfIndicativeSerie.length:allObsOfIndicativeSerie.length - query.lastNObs
            for (let i = allObsOfIndicativeSerie.length - 1; i >= obsLimit; i--) {
                if(!seriesObjToCheck.getObservations().some(obs=> obs.equals(allObsOfIndicativeSerie[i]))){
                    return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Observations found are not the last " + query.lastNObs + "." }
                }
            }
        }

        return { status: SUCCESS_CODE }



    }

    static _checkDataAvailability(test, query, workspace){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        let constraintsArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key)
        if(constraintsArr.length !== 1){throw new Error("Wrong number of constraints returned.")}
        let constraint = constraintsArr[0];
        
        let isConstraintRefValid  = constraint.getChildren().some(ref=>{
           return ref.getStructureType() === SDMX_STRUCTURE_TYPE.DATAFLOW.key
            && ref.getAgencyId() === query.flow.split(",")[0]
            && ref.getId() === query.flow.split(",")[1]
            && ref.getVersion() === query.flow.split(",")[2]
        })
        if(!isConstraintRefValid){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. Constraint does not reference requested DF."}
        }
        //Check parent test for data availability
        if(Object.keys(test.reqTemplate).length === 0){
            let cubeRegions = constraint.getCubeRegions()
            if(cubeRegions.length === 0){throw new Error("The constraint does not have any cube regions.")}
            
            let keyValues = cubeRegions[0].getKeyValues();
            if(keyValues.length === 0){throw new Error("The cube region does not have any keyValues.")}
        }

        if (test.reqTemplate.mode){
            return this._checkSimpleKeys(test, query, workspace,constraint)
        }
        if (query.start || query.end){
            return this._checkTemporalCoverage(test, query, workspace,constraint)
        }
        if (query.metrics){
            return this._checkMetrics(test,query,workspace,constraint)
        }
        if (test.reqTemplate.component){
            return this._checkSingleDimension(test,query,workspace,constraint)
        }
        if (test.reqTemplate.references){
            return this._checkReferences(test,query,workspace,constraint)
        }
        return { status: SUCCESS_CODE }
    }

    static _checkSimpleKeys(test,query,workspace,constraint){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (!constraint || !constraint instanceof ContentConstraintObject) {
            throw new Error("Missing mandatory parameter 'constraint'")
        }
        let cubeRegions = constraint.getCubeRegions()
        if(cubeRegions.length > 2){throw new Error("The constraint should have one Cube Region.")}
        let result;
        
        if(test.reqTemplate.mode === DATA_QUERY_MODE.EXACT){
            if(cubeRegions.length === 0){return { status: SUCCESS_CODE }}

            result =  cubeRegions[0].getKeyValues().some(keyValue=>{
                let index = Object.keys(test.randomKeys[0]).indexOf(keyValue.getId())
                if(index!==-1){
                    let requestedKey = query.key.split(".")[index]
                    if(requestedKey.indexOf("+") === -1){
                        return !(keyValue.hasOnlyNValues(1) && keyValue.hasValue(requestedKey))
                    }else{
                        return !(keyValue.hasOnlyNValues(2) && (keyValue.hasValue(requestedKey.split("+")[0]) && keyValue.hasValue(requestedKey.split("+")[1])))
                    }
                }
            })
        }else if (test.reqTemplate.mode === DATA_QUERY_MODE.AVAILABLE){
            if(cubeRegions.length === 0){return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. No Cube Region returned."}}
            
            result = cubeRegions[0].getKeyValues().every(keyValue=>{
                let index = Object.keys(test.randomKeys[0]).indexOf(keyValue.getId())
                if(index!==-1){
                    let requestedKey = query.key.split(".")[index]
                    if(requestedKey.indexOf("+") === -1){
                        return !keyValue.hasValue(requestedKey);
                    }else{
                        return !(keyValue.hasValue(requestedKey.split("+")[0]) || keyValue.hasValue(requestedKey.split("+")[1]))
                    }
                }
            })
        }
        
        if(result){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. Invalid response for single key query."}
        }

        return { status: SUCCESS_CODE }
       

    }

    static _checkTemporalCoverage(test,query,workspace,constraint){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (!constraint || !constraint instanceof ContentConstraintObject) {
            throw new Error("Missing mandatory parameter 'constraint'")
        }
        let constraintRefPeriod = constraint.getReferencePeriod()
        if(constraintRefPeriod){
            if(query.start && !query.end){
                let result = constraintRefPeriod.isAfterDate(query.start)
                if(!result){
                    return { status: FAILURE_CODE, error: "Error in Data Availability Temporal Coverage semantic check. StartTime of ReferencePeriod attribute of the constraint does not comply with the requested one" }
                }
            }else if (!query.start && query.end){
                let result = constraintRefPeriod.isBeforeDate(query.end)
                if(!result){
                    return { status: FAILURE_CODE, error: "Error in Data Availability Temporal Coverage semantic check. EndTime of ReferencePeriod attribute of the constraint does not comply with the requested one" }
                }
            }else if(query.start && query.end){
                let result =  constraintRefPeriod.isAfterDate(query.start) && constraintRefPeriod.isBeforeDate(query.end)
                if(!result){
                    return { status: FAILURE_CODE, error: "Error in Data Availability Temporal Coverage semantic check. ReferencePeriod attribute of the constraint does not comply with the requested StartPeriod or EndPeriod." }
                }
            }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkMetrics(test,query,workspace,constraint){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        let constraintAnnotations = constraint.getAnnotations();
        let result=true;
        if(constraintAnnotations){
            result = constraintAnnotations.every(annotation=>{
                return (annotation.getId()==='series_count' || annotation.getId()==='obs_count') &&  annotation.getType() === 'sdmx_metrics'
                && Number.isInteger(parseInt(annotation.getTitle())) && parseInt(annotation.getTitle())>0
            })
        }
        if(!result){
            return { status: FAILURE_CODE, error: "Error in Data Availability Metric semantic check. Wrong Annotation." }
        }
        return { status: SUCCESS_CODE }
    }

    static _checkSingleDimension(test,query,workspace,constraint){
        
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (!constraint || !constraint instanceof ContentConstraintObject) {
            throw new Error("Missing mandatory parameter 'constraint'")
        }
        let cubeRegions = constraint.getCubeRegions();
        if(cubeRegions.length !== 1){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. The response contains "+cubeRegions.length+" cubeRegions instead of 1."}
        }
        if(cubeRegions[0].getKeyValues().length > 1){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. The response contains "+cubeRegions[0].getKeyValues().length+" keyValues instead of 1."}
        }

        let foundKeyValue = cubeRegions[0].getKeyValues().find(keyVal=>keyVal.getId() === query.component)
        if(!foundKeyValue){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. KeyValue found, does not have the dimension id requested."}
        }

        let parentWorkspace = SdmxStructureObjects.fromJson(test.parentWorkspace)
            
        let parentConstraint = parentWorkspace.getSdmxObjectsList().find(obj => obj.structureType === SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key)
        if(!parentConstraint){throw new Error("No parent constraint to perform validation.")}

        parentConstraint = ContentConstraintObject.fromJSON(parentConstraint)
        
        //Check parent workspace to have the basic properties.
        let parentCubeRegions = parentConstraint.getCubeRegions()
        if(parentCubeRegions.length === 0){throw new Error("The parent constraint does not have any cube regions.")}
        
        let parentKeyValues = parentCubeRegions[0].getKeyValues();
        if(parentKeyValues.length === 0){throw new Error("The cube region of parent constraint does not have any keyValues.")}

        let parentKeyValue =  parentKeyValues.find(pKeyVal => pKeyVal.getId() === query.component);

        if(!parentKeyValue.equals(foundKeyValue)){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. KeyValue found, does not have the correct values."}
        }

        return { status: SUCCESS_CODE }
        

    }
    static _checkReferences(test,query,workspace,constraint){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (!constraint || !constraint instanceof ContentConstraintObject) {
            throw new Error("Missing mandatory parameter 'constraint'")
        }
        if(query.references === STRUCTURE_REST_RESOURCE.datastructure){
            return this._checkReferencedDSD(test,query,workspace)
        }else if(query.references === STRUCTURE_REST_RESOURCE.dataflow){
            return this._checkReferencedDF(test,query,workspace)
        }else if(query.references === STRUCTURE_REST_RESOURCE.codelist){
            return this._checkReferencedCodelists(test,query,workspace,constraint)
        }else if(query.references === STRUCTURE_REST_RESOURCE.conceptscheme){
            return this._checkReferencedConceptSchemes(test,query,workspace,constraint)
        }else if(query.references === STRUCTURE_REST_RESOURCE.dataproviderscheme){
            return this._checkReferencedProviderScheme(test,query,workspace)
        }else {
            return this._checkAllReferences(test,query,workspace,constraint)
        }
    }

    static _checkReferencedDSD(test,query,workspace){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        let dsdArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.DSD.key)
        if(dsdArr.length !== 1){return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. Wrong number of datastructures returned."}}
        let dsdObj = dsdArr[0];

        if(dsdObj.getStructureType()!==test.dsdObj.getStructureType()
            || dsdObj.getAgencyId()!==test.dsdObj.getAgencyId()
            || dsdObj.getId()!==test.dsdObj.getId()
            || dsdObj.getVersion()!==test.dsdObj.getVersion()){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. The response does not contain the correct DSD"}

        }
        
        return { status: SUCCESS_CODE }
    }

    static _checkReferencedDF(test,query,workspace){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        let dfArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.DATAFLOW.key)
        if(dfArr.length !== 1){return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. Wrong number of dataflows returned."}}
        let dfObj = dfArr[0];

        if(dfObj.getStructureType()!== SDMX_STRUCTURE_TYPE.DATAFLOW.key
            || dfObj.getAgencyId()!== query.flow.split(",")[0]
            || dfObj.getId()!== query.flow.split(",")[1]
            || dfObj.getVersion()!== query.flow.split(",")[2]){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. The response does not contain the correct DF"}

        }
        
        return { status: SUCCESS_CODE }
    }

    static _checkReferencedCodelists(test,query,workspace,constraint){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (!constraint || !constraint instanceof ContentConstraintObject) {
            throw new Error("Missing mandatory parameter 'constraint'")
        }

        let codelistsArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.CODE_LIST.key)
        if(codelistsArr.length === 0){return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. No codelists returned."}}

        let cubeRegions = constraint.getCubeRegions();
        if(cubeRegions.length !== 1){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. The response contains "+cubeRegions.length+" cubeRegions instead of 1."}
        }
        let cubeRegion = cubeRegions[0];

        let invalidCodelists = []
        let result = cubeRegion.getKeyValues().every(keyVal => {
            let dimension = test.dsdObj.getDimensions().find(comp => comp.getId() === keyVal.getId());
            if(!dimension){throw new Error("Error in Data Availability semantic check. Could not locate codelist for dimension with id: "+keyVal.getId()+".")}

            let codelistRef = dimension.getReferences().find(ref=>ref.getStructureType() === SDMX_STRUCTURE_TYPE.CODE_LIST.key)
            if(!codelistRef){throw new Error("Error in Data Availability semantic check. Could not locate codelist for dimension with id: "+keyVal.getId()+".")}

            let codelistInResponse = workspace.getSdmxObject(codelistRef)
            if(!codelistInResponse){throw new Error("Error in Data Availability semantic check. Could not locate codelist for dimension with id: "+keyVal.getId()+".")}

            //check if all keyValue values are present in codelist
            if(!keyVal.getValues().every(value=> codelistInResponse.getItems().some(item=>item.getId()=== value))){
                return false;
            }
            let visitedCodes = []
            let invalidCodes = []

            //check if codelist contains only the values of keyValue and their parents(if any)
            let invalidCodesArr  = this._validateCodelistCodes(codelistInResponse.getItems(),keyVal,visitedCodes,invalidCodes,codelistInResponse.getItems().find(item=>item.getId() === keyVal.getValues()[0]))
            if(invalidCodesArr.length > 0){invalidCodelists.push(codelistRef)}
            return invalidCodesArr.length === 0
        })
        if(!result){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. There are semantically invalid codelists in response "+JSON.stringify(invalidCodelists)+"."}
        }
        
        return { status: SUCCESS_CODE }
    }
    static _validateCodelistCodes(allCodes,keyValue,visitedCodes,invalidCodes,specificCode){
     
        //If codelist contains a code that is not in keyValue nor is the parent of another code then it is considered invalid.
        if(!keyValue.hasValue(specificCode.getId()) && !allCodes.some(code=>code.getParentCode() === specificCode.getId())){
            invalidCodes.push(specificCode.getId())
        }

        visitedCodes.push(specificCode.getId())
        
        if(specificCode.getParentCode() && visitedCodes.indexOf(specificCode.getParentCode()) ===-1 && invalidCodes.indexOf(specificCode.getParentCode()) ===-1){
            //get the code 
            let newCode = allCodes.find(code=>code.getId() === specificCode.getParentCode())
            //mark the code as visited and move on to its parent code recursively
            if(newCode){
                return this._validateCodelistCodes(allCodes,keyValue,visitedCodes,invalidCodes,newCode)
            }
        }
        
        if(allCodes.find(item=>item.getId() === keyValue.getValues().find(value=>visitedCodes.indexOf(value) ===-1 && invalidCodes.indexOf(value) ===-1))){
            let newCode =  allCodes.find(item=>item.getId() === keyValue.getValues().find(value=>visitedCodes.indexOf(value) ===-1 && invalidCodes.indexOf(value) ===-1))
            return this._validateCodelistCodes(allCodes,keyValue,visitedCodes,invalidCodes,newCode)
        }
        //get one by one the codes not checked yet
        let uncheckedCode  = allCodes.find(code=>visitedCodes.indexOf(code.getId())===-1 && invalidCodes.indexOf(code.getId())===-1)
        //mark the code as visited and move on to its parent code recursively
        if(uncheckedCode){
            return this._validateCodelistCodes(allCodes,keyValue,visitedCodes,invalidCodes,uncheckedCode)
        }
        //when all the codes are visited we have finished the validation process
        if(allCodes.every(code=>visitedCodes.indexOf(code.getId())!==-1)){
            return invalidCodes;
        }
    }
    static _checkReferencedConceptSchemes(test,query,workspace,constraint){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (!constraint || !constraint instanceof ContentConstraintObject) {
            throw new Error("Missing mandatory parameter 'constraint'")
        }

        let conceptSchemesArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key)
        if(conceptSchemesArr.length === 0){return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. No concept schemes returned."}}


        let cubeRegions = constraint.getCubeRegions();
        if(cubeRegions.length !== 1){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. The response contains "+cubeRegions.length+" cubeRegions instead of 1."}
        }
        let cubeRegion = cubeRegions[0];

        let result = conceptSchemesArr.filter(cs=>{
            return cubeRegion.getKeyValues().some(keyVal => {
                return cs.getItems().some(item=>item.getId() === keyVal.getId()) === false;
            })
        })

        if(result.length > 0){
            let invalidaConceptSchemes = [];
            result.forEach(cs=>invalidaConceptSchemes.push(cs.asReference()))
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. There are semantically invalid concept schemes in response"+JSON.stringify(invalidaConceptSchemes)+"."}
        }
        
        return { status: SUCCESS_CODE }
    }

    static _checkReferencedProviderScheme(test,query,workspace){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        let dataProviderSchemesArr = workspace.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key)
        if(dataProviderSchemesArr.length !== 1){return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. Wrong number of provider schemes returned."}}

        let dataProviderScheme = dataProviderSchemesArr[0];

        let result=false;
        if(query.references === "all"){
             result = test.providerRefs.every(pRef => {
                return dataProviderScheme.getItems().some(item => item.getId() === pRef.identifiableIds[0])
            }) 
        }else if(query.references === STRUCTURE_REST_RESOURCE.dataproviderscheme){
             result = dataProviderScheme.getItems().length === 1 && dataProviderScheme.getItems()[0].getId() === query.provider
        }

        if(!result){
            return { status: FAILURE_CODE, error: "Error in Data Availability semantic check. Wrong provider id in response."}
        } 
        return { status: SUCCESS_CODE }
    }
    
    static _checkAllReferences(test,query,workspace,constraint){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (!constraint || !constraint instanceof ContentConstraintObject) {
            throw new Error("Missing mandatory parameter 'constraint'")
        }
        let validateRefDSD = this._checkReferencedDSD(test,query,workspace)
        if(validateRefDSD.status === FAILURE_CODE){
            return validateRefDSD;
        }

        let validateRefDF = this._checkReferencedDF(test,query,workspace)
        if(validateRefDF.status === FAILURE_CODE){
            return validateRefDF;
        }

        let validateRefCodelist = this._checkReferencedCodelists(test,query,workspace,constraint)
        if(validateRefCodelist.status === FAILURE_CODE){
            return validateRefCodelist;
        }

        let validateRefConceptScheme = this._checkReferencedConceptSchemes(test,query,workspace,constraint)
        if(validateRefConceptScheme.status === FAILURE_CODE){
            return validateRefConceptScheme;
        }

        let validateRefProviderScheme = this._checkReferencedProviderScheme(test,query,workspace)
        if(validateRefProviderScheme.status === FAILURE_CODE){
            return validateRefProviderScheme;
        }

        return { status: SUCCESS_CODE }
    }
}

module.exports = DataSemanticChecker;