const { DATA_QUERY_KEY } = require('sdmx-tck-api/src/constants/data-queries-constants/DataQueryKey');
const { SDMX_STRUCTURE_TYPE } = require('sdmx-tck-api/src/constants/SdmxStructureType');
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

class DataSemanticChecker {

    static checkWorkspace(test, preparedRequest, workspace) {
        return new Promise((resolve, reject) => {
            var query = preparedRequest.request;
            try {
                let validation = {};
                if (test.testType === TEST_TYPE.DATA_IDENTIFICATION_PARAMETERS) {
                    validation = DataSemanticChecker.checkResourceIdentification(test, query, workspace)
                } else if (test.testType === TEST_TYPE.DATA_EXTENDED_RESOURCE_IDENTIFICATION_PARAMETERS) {
                    validation = DataSemanticChecker.checkExtendedResourceIdentification(test, query, workspace)
                } else if (test.testType === TEST_TYPE.DATA_FURTHER_DESCRIBING_RESULTS_PARAMETERS) {
                    validation = DataSemanticChecker.checkFurtherDescribingResults(test, query, workspace)
                } else if (test.testType === TEST_TYPE.DATA_AVAILABILITY){
                    validation = DataSemanticChecker.checkDataAvailability(test, query, workspace)
                }
                // } else if (test.testType === TEST_TYPE.STRUCTURE_REFERENCE_PARAMETER) {
                //     validation = StructuresSemanticChecker.checkReferences(query, workspace);
                // } else if (test.testType === TEST_TYPE.STRUCTURE_DETAIL_PARAMETER) {
                //     validation = StructuresSemanticChecker.checkDetails(query, workspace);
                // } else if(test.testType === TEST_TYPE.STRUCTURE_TARGET_CATEGORY){
                //     validation = StructuresSemanticChecker.checkTargetCategory(query, workspace);
                // }
                resolve(validation);
            } catch (err) {
                console.log(err)
                reject(new TckError(err));
            }
        });
    }

    static async checkResourceIdentification(test, query, workspace) {
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }

        if (query.provider === "all") {
            return this._checkIdentification(query, workspace)
        }
        return this._checkProviderIdentification(test, query, workspace)

    }

    static async _checkProviderIdentification(test, query, workspace) {
        try {
            if (!query) {
                throw new Error("Missing mandatory parameter 'query'")
            }
            if (!test) {
                throw new Error("Missing mandatory parameter 'test'")
            }
            if (!workspace || !workspace instanceof SdmxDataObjects) {
                throw new Error("Missing mandatory parameter 'workspace'")
            }

            if (workspace.getStructureRefs().find(ref => ref.getStructureType() !== SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key)) {
                return { status: FAILURE_CODE, error: "Error in Identification:All structure references must be " + SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key }
            }

            let praRefs = workspace.getStructureRefs();
            for (let i in praRefs) {
                if (!test.structureWorkspace.exists(praRefs[i])) {
                    return { status: FAILURE_CODE, error: "Error in Identification: " + praRefs[i] + " is not related to requested DF" }
                }

                let praObj = test.structureWorkspace.getSdmxObject(praRefs[i]);

                if (query.provider.indexOf("+") !== -1) {
                    if (!praObj.getChildren().find(child => child.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key
                        && child.getIdentifiableIds().indexOf(query.provider.split("+")[i]) !== -1)) {
                        return { status: FAILURE_CODE, error: "Error in Identification: " + praRefs[i] + " is not related to requested DF" }
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
                        return { status: FAILURE_CODE, error: "Error in Identification: " + praRefs[i] + " is not related to requested DF" }
                    }
                }
            }
            return { status: SUCCESS_CODE }








            //    new StructureReference(test.identifiers.structureType,test.identifiers.agencyId,test.identifiers.id,test.identifiers.version)))
            // let helpTestParams = {
            //     testId: "/"+STRUCTURE_REST_RESOURCE.provisionagreement+"/agency/id/version?references="+STRUCTURE_REFERENCE_DETAIL.CHILDREN,
            //     index: TEST_INDEX.Structure,
            //     apiVersion: test.apiVersion,
            //     resource: STRUCTURE_REST_RESOURCE.provisionagreement,
            //     reqTemplate: {references:STRUCTURE_REFERENCE_DETAIL.CHILDREN},
            //     identifiers: {structureType:praRef.getStructureType(),agency:praRef.getAgencyId(),id:praRef.getId(),version:praRef.getVersion()},
            //     testType: TEST_TYPE.STRUCTURE_IDENTIFICATION_PARAMETERS
            // }
            // //TODO:DO THIS IN EVERY HELPING TEST
            // if(!praRef.getAgencyId()){helpTestParams.reqTemplate.agency="all"}
            // let helperWorkspace = await HelperManager.getWorkspace(TestObjectBuilder.getTestObject(helpTestParams),test.apiVersion,url);
            // console.log(test)


        } catch (e) {
            console.log(e)
        }


    }

    static _checkIdentification(query, workspace) {
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        let identifiers = query.flow.split(',');
        let requestedAgencyId = identifiers[0]
        let requestedId = identifiers[1]
        let requestedVersion = (identifiers[2] === "latest" || !identifiers[2]) ? null : identifiers[2]

        let reformedQuery = {
            agency: requestedAgencyId,
            id: requestedId,
            version: requestedVersion
        }

        let structureId = workspace.getStructureId();
        if (Utils.isSpecificAgency(reformedQuery) && Utils.isSpecificItem(reformedQuery) && Utils.isSpecificVersion(reformedQuery)) {
            if (structureId.getAgencyId() !== requestedAgencyId || structureId.getId() !== requestedId || structureId.getVersion() !== requestedVersion) {
                return { status: FAILURE_CODE, error: "Error in Identification" }
            }
        } else if (Utils.isSpecificAgency(reformedQuery) && Utils.isSpecificItem(reformedQuery) && !Utils.isSpecificVersion(reformedQuery)) {
            if (structureId.getAgencyId() !== requestedAgencyId || structureId.getId() !== requestedId) {
                return { status: FAILURE_CODE, error: "Error in Identification" }
            }
        } else if (!Utils.isSpecificAgency(reformedQuery) && Utils.isSpecificItem(reformedQuery) && !Utils.isSpecificVersion(reformedQuery)) {
            if (structureId.getAgencyId() !== requestedAgencyId) {
                return { status: FAILURE_CODE, error: "Error in Identification" }
            }
        }

        return { status: SUCCESS_CODE }
    }

    static checkExtendedResourceIdentification(test, query, workspace) {
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!workspace || !workspace instanceof SdmxDataObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }
        if (test.reqTemplate.key === DATA_QUERY_KEY.PARTIAL_KEY || test.reqTemplate.key === DATA_QUERY_KEY.MANY_KEYS) {
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
        if (result.length > 0) { return { status: FAILURE_CODE, error: "Error in Extenden Resource Identification: There are series that do not comply with the requested key." + JSON.stringify(result) } }
        return { status: SUCCESS_CODE }

    }

    static checkFurtherDescribingResults(test, query, workspace) {
        console.log("ENTER CHECK")
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
            let result = this.checkPeriods(test, query, workspace);
            if(result.status === FAILURE_CODE){return result}
        }

        /*Check if the observations under validation are the first or last N of an indicative series*/
        if (query.firstNObs || query.lastNObs) {
            let result = this.checkObservations(test, query, workspace);
            if(result.status === FAILURE_CODE){return result}
        }

        /*Check if the xml is of the requested detail*/
        if (query.detail) {
            let result = this.checkDetail(test, query, workspace);
            if(result.status === FAILURE_CODE){return result}
        }

        return { status: SUCCESS_CODE }


    }
    static checkDetail(test, query, workspace) {
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
                return Object.getOwnPropertyNames(s.getAttributes()).some(attr => !dsdObj.getComponents().find(comp => (comp.getType() === "DIMENSION") && (comp.getId() == attr)))
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
                return Object.getOwnPropertyNames(s.getAttributes()).some(attr => !dsdObj.getComponents().find(comp => comp.id == attr))
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
                return Object.getOwnPropertyNames(s.getAttributes()).some(attr => !dsdObj.getComponents().find(comp => (comp.getType() === "DIMENSION") && (comp.getId() == attr)))
            })
            if (inValidSeries.length > 0) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Series are not allowed to have attributes other than dsd dimensions." }
            }
            return { status: SUCCESS_CODE }
        }
    }
    static checkPeriods(test, query, workspace) {
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

            let result = workspace.getAllObservations().every(obs => {
                return obs.isAfterDate(requestedStartingDate)
            });
            if (result) {
                return { status: SUCCESS_CODE }
            }
            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are observations before the start period set." }

        } else if (!query.start && query.end) {
            let requestedEndingDate = query.end

            let result = workspace.getAllObservations().every(obs => {
                return obs.isBeforeDate(requestedEndingDate)
            });
            if (result) {
                return { status: SUCCESS_CODE }
            }
            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are observations after the end period set." }
        } else if (query.start && query.end) {
            let requestedStartingDate = query.start
            let requestedEndingDate = query.end

            let result = workspace.getAllObservations().every(obs => {
                return obs.isBeforeDate(requestedEndingDate) && obs.isAfterDate(requestedStartingDate)
            });
            if (result) {
                return { status: SUCCESS_CODE }
            }
            return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. There are observations that are not between the starting and ending period." }

        }
    }

    static checkObservations(test, query, workspace) {
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
            if (seriesObjToCheck.getObservations().length !== query.firstNObs) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Found " + seriesObjToCheck.getObservations().length + " instead of " + query.firstNObs + "." }
            }
            for (let i = 0; i < query.firstNObs; i++) {
                if (!allObsOfIndicativeSerie[i].equals(seriesObjToCheck.getObservations()[i])) {
                    return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Observations found are not the first " + query.firstNObs + "." }
                }
            }
        }
        if (query.lastNObs) {
            if (seriesObjToCheck.getObservations().length !== query.lastNObs) {
                return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Found " + seriesObjToCheck.getObservations().length + " instead of " + query.lastNObs + "." }
            }
            let objIndex=query.lastNObs-1;
            for (let i = allObsOfIndicativeSerie.length - 1; i >= allObsOfIndicativeSerie.length - query.lastNObs; i--) {
                if (!allObsOfIndicativeSerie[i].equals(seriesObjToCheck.getObservations()[objIndex])) {
                    return { status: FAILURE_CODE, error: "Error in Further Describing Results semantic check. Observations found are not the last " + query.lastNObs + "." }
                }
                objIndex--;

            }
        }

        return { status: SUCCESS_CODE }



    }

    static checkDataAvailability(test, query, workspace){
        if (!test) {
            throw new Error("Missing mandatory parameter 'test'")
        }
        if (!query) {
            throw new Error("Missing mandatory parameter 'query'")
        }
        if (!workspace || !workspace instanceof SdmxStructureObjects) {
            throw new Error("Missing mandatory parameter 'workspace'")
        }

        let constraint = workspace.getSdmxObjectsList().find(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key)
		if(!constraint){throw new Error("No constraint returned.")}

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

        let cubeRegions = constraint.getCubeRegions()
        if(cubeRegions.length > 2){throw new Error("The constraint should have one Cube Region.")}
        let result;

        if(test.reqTemplate.mode ==="exact"){
            result = cubeRegions.some(cubeRegion => {
                let keyValues = cubeRegion.getKeyValues();
                return keyValues.some(keyValue=>{
                    let index = Object.keys(test.randomKeys[0]).indexOf(keyValue.getId())
                    if(index!==-1){
                        let requestedKey = query.key.split(".")[index]
                        if(requestedKey.indexOf("+") === -1){
                            return keyValue.getValues().some(val=>val!== requestedKey)
                        }else{
                            return keyValue.getValues().some(val=>(val!== requestedKey.split("+")[0]) && (val!== requestedKey.split("+")[1]))
                        }
                    }
                })
            })
        }else if (test.reqTemplate.mode === "available"){
            let parentWorkspace = SdmxStructureObjects.fromJson(test.parentWorkspace)
            
            let parentConstraint = parentWorkspace.getSdmxObjectsList().find(obj => obj.structureType === SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key)
            if(!parentConstraint){throw new Error("No parent constraint to perform validation.")}

            parentConstraint = ContentConstraintObject.fromJSON(parentConstraint)
            
            //Check parent workspace to have the basic properties.
            let parentCubeRegions = parentConstraint.getCubeRegions()
            if(parentCubeRegions.length === 0){throw new Error("The parent constraint does not have any cube regions.")}
            
            let parentKeyValues = parentCubeRegions[0].getKeyValues();
            if(parentKeyValues.length === 0){throw new Error("The cube region of parent constraint does not have any keyValues.")}

            result =  parentCubeRegions.some(parentCube =>{
                return parentCube.equals(cubeRegions[0]) === false
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

        let constraintRefPeriod = constraint.getReferencePeriod()
        if(constraintRefPeriod){
            if(query.start && !query.end){
                let result = constraintRefPeriod.isAfterDate(query.start)
                if(!result){
                    return { status: FAILURE_CODE, error: "Error in Data Availability Temporal Coverage semantic check. StartTime of ReferencePeriod does not comply with the requested one" }
                }
            }else if (!query.start && query.end){
                let result = constraintRefPeriod.isBeforeDate(query.end)
                if(!result){
                    return { status: FAILURE_CODE, error: "Error in Data Availability Temporal Coverage semantic check. EndTime of ReferencePeriod does not comply with the requested one" }
                }
            }else if(query.start && query.end){
                let result =  constraintRefPeriod.isAfterDate(query.start) && constraintRefPeriod.isBeforeDate(query.end)
                if(!result){
                    return { status: FAILURE_CODE, error: "Error in Data Availability Temporal Coverage semantic check. ReferencePeriod times do not comply with the requested startPeriod or EndPeriod." }
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
}

module.exports = DataSemanticChecker;