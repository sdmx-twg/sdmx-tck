const SUCCESS_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.SUCCESS_CODE;
const FAILURE_CODE = require('sdmx-tck-api').constants.API_CONSTANTS.FAILURE_CODE;
var TckError = require('sdmx-tck-api').TckError;
const sdmx_requestor = require('sdmx-rest');
const SdmxObjects = require('sdmx-tck-api').model.SdmxObjects;
const STRUCTURE_QUERY_REPRESENTATIONS = require('../constants/StructureQueryRepresentations').STRUCTURE_QUERY_REPRESENTATIONS;
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var SdmxV21JsonParser = require('../../../sdmx-tck-parsers/src/parsers/SdmxV21JsonParser.js');

class ContentConstraintTypeValidator {
    
    //Returns a content constraint's identifiers
    static getContentConstraintOfAllowedType(test) {
                //Create a Map from the workspace of the parent test.
                let parentWorkspaceMap = new Map();
                for(const prop in test.parentWorkspace.structures){
                    parentWorkspaceMap.set(prop,test.parentWorkspace.structures[prop])
                }            
                let parentWorkspaceObj = new SdmxObjects(parentWorkspaceMap);
                return ContentConstraintTypeValidator.changeContentConstraintIfNeeded(test,parentWorkspaceObj);
    };
    
    /*Checks whether the reference test has already an allowed type content constraint artefact.
    If so its identifiers are returned. If not the parent's workspace is searched for a content constraint of allowed type.
    If found it is returned else the reference test's identifiers remain unchanged*/
    static changeContentConstraintIfNeeded(test,parentWorkspaceObj){
        let selectedContentConstraint = parentWorkspaceObj.getSdmxObject(new StructureReference(test.identifiers.structureType,test.identifiers.agency,test.identifiers.id,test.identifiers.version))
        if(!selectedContentConstraint.type ||(selectedContentConstraint.type && selectedContentConstraint.type !== "Allowed")){
            let parentWorkspaceList = parentWorkspaceObj.getSdmxObjectsList()
            for(let i=0;i<parentWorkspaceList.length;i++){
                if(parentWorkspaceList[i].type === "Allowed"){
                    return ({structureType:parentWorkspaceList[i].structureType,
                             agency:parentWorkspaceList[i].agencyId,
                             id:parentWorkspaceList[i].id,
                             version:parentWorkspaceList[i].version})
                }
            }
        }
        return test.identifiers
    }
  
};

module.exports = ContentConstraintTypeValidator;