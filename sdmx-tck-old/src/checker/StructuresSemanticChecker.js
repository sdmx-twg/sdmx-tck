import STRUCTURE_REFERENCE_DETAIL from '../constants/StructureReferenceDetail';
import {isDefined, isSpecificAgency, isSpecificId, isSpecificVersion, isSpecificItem} from '../utils/Utils';
import SdmxObjects from '../model/SdmxObjects';
import StructureReference from '../model/StructureReference';
import { SUCCESS_CODE, FAILURE_CODE } from '../constants/AppConstants';
import {STRUCTURE_QUERY_DETAIL} from '../constants/StructureQueryDetail';
import SemanticError from '../errors/SemanticError';
import TckError from '../errors/TckError';
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';

export default class StructuresSemanticChecker {
    static checkWorkspace(test, workspace) {
        return new Promise((resolve, reject) => {
            try {
                let query = test.httpResponseValidation.query;
                let validation = test.callback(query, workspace);
                validation.workspace = workspace;
                
                if (validation.status === SUCCESS_CODE) {
                    resolve(validation);
                } else {
                    reject(new SemanticError(validation.error, validation.error));
                }
            } catch (err) {
                reject(new TckError(err));
            }
        });
    };

    static checkIdentification(query, sdmxObjects) {
        if (!isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }

        let structureType = SDMX_STRUCTURE_TYPE.fromRestResource(query.resource);
        let agency = query.agency;
        let id = query.id;
        // WORKAROUND - Until a better solution is found.
        // Because the version is extracted from the request it can contain values such as 'latest', 'all'. 
        // In case of 'latest' we check if the workspace contains exactly one structure 
        // but the problem here is that the version of the returned structure is not known beforehand 
        // and the workspace cannot be filtered using the 'latest' for the structure version.
        let version = query.version && query.version === 'latest' ? null : query.version;
        
        if (!isSpecificAgency(query) && !isSpecificId(query) && !isSpecificVersion(query)) {
            return { status: SUCCESS_CODE };
        } 
        else if (isSpecificAgency(query) && isSpecificId(query) && isSpecificVersion(query) && !isSpecificItem(query)) {
            return StructuresSemanticChecker.exactlyOneArtefact(sdmxObjects, structureType, agency, id, version);
        }
        else if (isSpecificAgency(query) && isSpecificId(query) && isSpecificVersion(query) && isSpecificItem(query)) {
            return StructuresSemanticChecker.exactlyOneArtefactWithCorrectNumOfItems(sdmxObjects, structureType, agency, id, version, query.item)
        }
        else if (!isSpecificAgency(query) && isSpecificId(query) && isSpecificVersion(query)) {
            return StructuresSemanticChecker.atLeastOneArtefact(sdmxObjects, structureType, undefined, id, version);
        }
        else if (isSpecificAgency(query) && !isSpecificId(query) && isSpecificVersion(query)) {
            return StructuresSemanticChecker.atLeastOneArtefact(sdmxObjects, structureType, agency, undefined, version);
        }
        else if (isSpecificAgency(query) && isSpecificId(query) && !isSpecificVersion(query)) {
            return StructuresSemanticChecker.atLeastOneArtefact(sdmxObjects, structureType, agency, id, undefined);
        }
        else if (isSpecificAgency(query) && !isSpecificId(query) && !isSpecificVersion(query)) {
            return StructuresSemanticChecker.atLeastOneArtefact(sdmxObjects, structureType, agency, undefined, undefined);
        }
    };

    static checkReferences(query, sdmxObjects) {
        if (!isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }
        let structureRef = new StructureReference(SDMX_STRUCTURE_TYPE.fromRestResource(query.resource), query.agency, query.id, query.version);

        let result;
        // get the requested structure from workspace
        let structureObject = sdmxObjects.getSdmxObject(structureRef);
        if (!isDefined(structureObject)) {
            throw new Error("Structure " + structureRef + " not found in workspace.");
        }
        if (query.references === STRUCTURE_REFERENCE_DETAIL.NONE) {
            result = [];
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.PARENTS) {
            result = StructuresSemanticChecker._getParents(sdmxObjects, structureObject);
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.PARENTS_SIBLINGS) {
            result = StructuresSemanticChecker._getParentsSiblings(sdmxObjects, structureObject);
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.CHILDREN) {
            result = StructuresSemanticChecker._getChildren(sdmxObjects, structureObject);
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.DESCENDANTS) {
            result = StructuresSemanticChecker._getDescendants(sdmxObjects, structureObject);
        } else if (query.references === STRUCTURE_REFERENCE_DETAIL.ALL) {
            result = StructuresSemanticChecker._getAll(sdmxObjects, structureObject);
        } else if (STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(query.references)) {
            result = StructuresSemanticChecker._getParentsChildren(sdmxObjects, structureObject);
        } else {
            throw new Error("Not supported structure reference detail '" + query.references + "'");
        }
        // ADDITIONAL CHECKS //
        // 1. Check if all references are found in workspace and return missing structures if such exist.
        let missingStructures = [];
        
        result.forEach((r) => {
            if (r.isReferenced === false && !STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(query.references)) {
                missingStructures.push(r.ref);
            } else if (STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(query.references) &&
                r.ref.getStructureType() === STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType(query.references) && r.isReferenced === false) {
                missingStructures.push(r.ref)
            }
        });
        if (missingStructures.length > 0) {
            return { status: FAILURE_CODE, error: "Not all structures found in workspace: " + JSON.stringify(missingStructures) };
        }
        
        // 2. Check if the workspace contains non-referenced structures.
        let extraStructures = [];
        sdmxObjects.getSdmxObjectsList().forEach((structure) => {
            // Check if the workspace object is referenced by the requested structure.
            let isReference = result.some(r => {
                return r.ref.equals(structure.asReference())
            });
            if (!structureRef.equals(structure.asReference()) && !isReference) {
                extraStructures.push(structure.asReference());
            } else if (!structureRef.equals(structure.asReference()) && isReference) {
                if (STRUCTURE_REFERENCE_DETAIL.isSpecificSdmxStructure(query.references) &&
                    structure.getStructureType() !== STRUCTURE_REFERENCE_DETAIL.getSdmxStructureType(query.references)) {
                        extraStructures.push(structure.asReference());
                }
            }
        });

        if (extraStructures.length > 0) {
            return { status: FAILURE_CODE, error: "Non-referenced structures found in workspace: " + JSON.stringify(extraStructures) };
        }
        // 3. 
        return { status: SUCCESS_CODE }
    };

    static checkDetails(query, sdmxObjects) {
        if (!isDefined(query)) {
            throw new Error("Missing mandatory parameter 'query'.");
        }
        if (!isDefined(sdmxObjects) || !(sdmxObjects instanceof SdmxObjects)) {
            throw new Error("Missing mandatory parameter 'sdmxObjects'.");
        }

        let errors = [];
        if (query.detail === STRUCTURE_QUERY_DETAIL.REFERENCED_STUBS ||
            query.detail === STRUCTURE_QUERY_DETAIL.REFERENCE_COMPLETE_STUBS ||
            query.detail === STRUCTURE_QUERY_DETAIL.REFERENCE_PARTIAL) {

            let structureRef = new StructureReference(SDMX_STRUCTURE_TYPE.fromRestResource(query.resource), query.agency, query.id, query.version);
            
            let structureObject = sdmxObjects.getSdmxObject(structureRef);
            structureObject.getChildren().forEach((childRef) => {
                var childObject = sdmxObjects.getSdmxObject(childRef)
                if (!isDefined(childObject)
                    || (query.detail === STRUCTURE_QUERY_DETAIL.REFERENCED_STUBS && childObject.isStub() === false)
                    || (query.detail === STRUCTURE_QUERY_DETAIL.REFERENCE_COMPLETE_STUBS && childObject.isCompleteStub() === false)
                    || (query.detail === STRUCTURE_QUERY_DETAIL.REFERENCE_PARTIAL &&
                        (structureObject.getStructureType() === SDMX_STRUCTURE_TYPE.DSD.key || structureObject.getStructureType() === SDMX_STRUCTURE_TYPE.MSD.key) &&
                        childObject.getStructureType() === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key && !StructuresSemanticChecker._checkIfPartial(childRef, childObject))) {
                            errors.push(childRef);
                }
            });
        } else {
            sdmxObjects.getSdmxObjects().forEach((structuresList) => {
                if (isDefined(structuresList) && structuresList instanceof Array) {
                    structuresList.forEach((structure) => {
                        if ((query.detail === STRUCTURE_QUERY_DETAIL.FULL && structure.isFull() === false) ||
                            (query.detail === STRUCTURE_QUERY_DETAIL.ALL_STUBS && structure.isStub() === false) ||
                            (query.detail === STRUCTURE_QUERY_DETAIL.ALL_COMPLETE_STUBS && structure.isCompleteStub() === false)) {
                            errors.push(structure.asReference()); // use this array to gather information about the structures that didn't pass this check.
                        }
                    });
                }
            });
        }
        if (errors.length === 0) {
            return { status: SUCCESS_CODE };
        }
        return { status: FAILURE_CODE, error: "The following structures didn't pass the check: " + JSON.stringify(errors) };
    };

    static _checkIfPartial(structureRef, itemSchemeObject) {
        let items = itemSchemeObject.getItems();
        let identifiableIds = structureRef.getIdentifiableIds();
        
        if (items.length === 0 && identifiableIds.length === 0) {
            return true;
        } else if (items.length === 0 && identifiableIds.length !== 0) {
            return false;
        } else if (items.length !== 0 && identifiableIds.length === 0) {
            return false;
        }
        for (let i in items) {
            if (!identifiableIds.includes(items[i].id)) {
                return false;
            }
        }
        return true;
    };

    static _getChildren(sdmxObjects, structureObject) {
        let result = [];
        if (!structureObject.isFull()) {
            throw new Error("Children cannot be checked for SDMX structure " + structureObject.asReference() + ". Only stub returned.");
        }
        // check if all children of the requested artefact exist in workspace.
        structureObject.getChildren().forEach((childRef) => {
            result.push({ ref: childRef, isReferenced: sdmxObjects.exists(childRef) });
        });
        return result;
    };

    /**
     * Checks if the requested structure and all of its descendants exist in workspace.
     * @param {*} sdmxObjects the workspace
     * @param {*} structureRef the structure reference
     */
    static _getDescendants(sdmxObjects, structureObject) {
        let result = [];
        StructuresSemanticChecker._getDescendantsInternal(sdmxObjects, structureObject, result);
        return result;
    };

    static _getDescendantsInternal(sdmxObjects, structureObject, result) {
        if (!structureObject.isFull()) {
            throw new Error("Descendants cannot be checked for SDMX structure " + structureObject.asReference() + ". Only stub returned.");
        }
        structureObject.getChildren().forEach((childRef) => {
            let childObject = sdmxObjects.getSdmxObject(childRef);
            let childObjectFound = isDefined(childObject);
            result.push({ ref: childRef, isReferenced: childObjectFound });

            if (childObjectFound) {
                StructuresSemanticChecker._getDescendantsInternal(sdmxObjects, childObject, result);
            }
        });
    };

    /**
     * Returns an array containing the parents of the requested structure.
     * @param {*} sdmxObjects 
     * @param {*} structureObject 
     */
    static _getParents(sdmxObjects, structureObject) {
        let result = [];
        sdmxObjects.getSdmxObjects().forEach((structuresList) => {
            if (isDefined(structuresList) && structuresList instanceof Array) {
                structuresList.forEach((structure) => {
                    if (!structureObject.asReference().equals(structure.asReference())) {
                        if (!structure.isFull()) {
                            throw new Error("Parents cannot be checked for SDMX structure " + structureObject.asReference() + ". Only stub returned for structure " + structure.asReference());
                        }
                        // check if the requested structure is child of the current structure.
                        if (structure.getChildren().some((element) => {
                            return structureObject.asReference().equals(element);
                        }
                        )) {
                            result.push({ ref: structure.asReference(), isReferenced: true });
                        }
                    }
                });
            }
        });
        return result;
    };

    /**
     * Returns an array containing parents and siblings of the requested structure and an indication whether they are found in workspace or not.
     * @param {*} sdmxObjects the workspace
     * @param {*} structureObject the requested structure
     */
    static _getParentsSiblings(sdmxObjects, structureObject) {
        let result = [];
        let parents = StructuresSemanticChecker._getParents(sdmxObjects, structureObject);
        if (parents) result = result.concat(parents);

        parents.forEach((parent) => {
            let parentObject = sdmxObjects.getSdmxObject(parent.ref);
            if (!isDefined(parentObject)) {
                throw new Error("Structure " + parent.ref + " not found in workspace.");
            }
            parentObject.getChildren().forEach((childRef) => {
                result.push({ ref: childRef, isReferenced: sdmxObjects.exists(childRef) });
            });
        });
        return result;
    };

    /**
     * Returns an array containing parents and children of the requested structure and an indication whether they are found in workspace or not.
     * @param {*} sdmxObjects the workspace
     * @param {*} structureObject the requested structure
     */
    static _getParentsChildren(sdmxObjects, structureObject) {
        let result = [];
        
        let parents = StructuresSemanticChecker._getParents(sdmxObjects, structureObject);
        if (parents) result = result.concat(parents);

        let children = StructuresSemanticChecker._getChildren(sdmxObjects, structureObject);
        if (children) result = result.concat(children);
        
        return result;
    };

    /**
     * Returns an array containing all artefacts that are referenced by the requested artefact and an indication whether they are found in workspace or not.
     * @param {*} sdmxObjects the workspace
     * @param {*} structureObject the requested structure
     */
    static _getAll(sdmxObjects, structureObject) {
        let result = [];

        let descendants = StructuresSemanticChecker._getDescendants(sdmxObjects, structureObject);
        if (descendants) result = result.concat(descendants);

        let parentsSiblings = StructuresSemanticChecker._getParentsSiblings(sdmxObjects, structureObject);
        if (parentsSiblings) result = result.concat(parentsSiblings);

        return result;
    };
    
    //============================================================================================//
    
    static exactlyOneArtefact(sdmxObjects, structureType, agencyId, id, version) {
        if (!sdmxObjects) {
            throw new Error("Error in response validation. No workspace provided");
        }
        let matchingStructures = sdmxObjects.getSdmxObjectsWithCriteria(structureType, agencyId, id, version);
        return { status: (matchingStructures.length === 1) ? SUCCESS_CODE : FAILURE_CODE };
    };

    static exactlyOneArtefactWithCorrectNumOfItems(sdmxObjects, structureType, agencyId, id, version, item) {
        if (!sdmxObjects) {
            throw new Error("Error in response validation. No workspace provided");
        }

        let matchingStructures = sdmxObjects.getSdmxObjectsWithCriteria(structureType, agencyId, id, version);
        if (matchingStructures.length > 1) {
            return { status: FAILURE_CODE, error: "More artefacts than requested." };
        }
        let items = matchingStructures[0].getItems();

        var countItemsFromResponse = items.length;
        var countItemsTestRequest = item.split("+").length;

        var itemsStr = "";
        for(let i=0;i<items.length;i++){
            if(i+1 === items.length){
                itemsStr = itemsStr.concat(items[i].id)
            }else{
                itemsStr = itemsStr.concat(items[i].id+"+")
            }
        }
        return { status: (matchingStructures.length === 1 && countItemsFromResponse === countItemsTestRequest && itemsStr === item) ? SUCCESS_CODE : FAILURE_CODE };
    };

    static atLeastOneArtefact(sdmxObjects, structureType, agencyId, id, version) {
        if (!sdmxObjects) {
            throw new Error("Error in response validation. No workspace provided");
        }
        let matchingStructures = sdmxObjects.getSdmxObjectsWithCriteria(structureType, agencyId, id, version);
        return { status: (matchingStructures.length >= 1) ? SUCCESS_CODE : FAILURE_CODE };
    }
};