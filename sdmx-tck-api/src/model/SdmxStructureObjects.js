var SdmxObjects = require('./SdmxObjects.js');
const DataflowObject = require('./DataflowObject.js');
const StructureReference = require('./StructureReference.js');
var isDefined = require('../utils/Utils.js').isDefined;
var SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
var getResources = require('../constants/StructuresRestResources.js').getResources
const TEST_INDEX = require('../constants/TestIndex.js').TEST_INDEX
const STRUCTURES_REST_RESOURCE = require('../constants/StructuresRestResources').STRUCTURES_REST_RESOURCE
const DSD_COMPONENTS_NAMES = require("../constants/DSDComponents.js").DSD_COMPONENTS_NAMES

class SdmxStructureObjects extends SdmxObjects{
    constructor(sdmxObjects){
        super(sdmxObjects)
    }

    getSdmxObject(structureRef) {
		if (!isDefined(structureRef)) {
			throw new Error('SDMX structure reference not provided.');
		}
		if (isDefined(this.getSdmxObjects())) {
			let artefacts = this.getSdmxObjects().get(structureRef.getStructureType());
			for (var s in artefacts) {
				if (artefacts[s].agencyId === structureRef.getAgencyId() &&
					artefacts[s].id === structureRef.getId() &&
					artefacts[s].version === structureRef.getVersion()) {
					return artefacts[s];
				}
			}
		}
		return null;
    };
    
    /**
	 * Check if the given structure exists in workspace. 
	 * @param {*} structureRef 
	 */
	exists(structureRef) {
		return this.getSdmxObject(structureRef) !== null;
    };
    
    /**
	 * Returns a list of structure references, that are children of the structureRef.
	 */
	getChildren(structureRef) {
		var sdmxObject = this.getSdmxObject(structureRef);
		if (sdmxObject === null || sdmxObject === undefined) {
			throw new Error("SDMX object " + structureRef + " not found in workspace.");
		}
		return sdmxObject.getChildren();
	};
	getRandomSdmxObject() {
		// Randomly pick a structure type from the available structures in the workspace.
		let structureTypesArray = this.getSdmxObjectsList();

		// Randomly pick an index from the available array of artefacts.
		let randomIndex = Math.floor(Math.random() * structureTypesArray.length);
		return structureTypesArray[randomIndex];
	};
	getRandomSdmxObjectOfType(structureType) {
		if (!isDefined(structureType)) {
			throw new Error('Missing mandatory parameter \'structureType\'');
		}
		let arrayOfStructures = [];
		// If the requested structure type is ORGANISATION_SCHEME, choose randomly one structure of the following structure types:
		// ORGANISATION_UNIT_SCHEME, AGENCY_SCHEME, DATA_CONSUMER_SCHEME, DATA_PROVIDER_SCHEME
		if (structureType === SDMX_STRUCTURE_TYPE.ORGANISATION_SCHEME.key) {
			let agencyschemes = this.getSdmxObjects().get(SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key);
			if (isDefined(agencyschemes)) {
				arrayOfStructures = arrayOfStructures.concat(agencyschemes);
			}
			let dcschemes = this.getSdmxObjects().get(SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key);;
			if (isDefined(dcschemes)) {
				arrayOfStructures = arrayOfStructures.concat(dcschemes);
			}
			let dpschemes = this.getSdmxObjects().get(SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key);
			if (isDefined(dpschemes)) {
				arrayOfStructures = arrayOfStructures.concat(dpschemes);
			}
			let ouschemes = this.getSdmxObjects().get(SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key);
			if (isDefined(ouschemes)) {
				arrayOfStructures = arrayOfStructures.concat(ouschemes);
			}
		} else {
			arrayOfStructures = this.getSdmxObjects().get(structureType);
		}
		if (!isDefined(arrayOfStructures) || arrayOfStructures.length === 0) {
			return null;
		}
		// Randomly pick an index from the available array of artefacts.
		let randomIndex = Math.floor(Math.random() * arrayOfStructures.length);
		return arrayOfStructures[randomIndex];
    };
    
    getSdmxObjectsWithCriteria(structureType, agencyId, id, version) {
		return this.getSdmxObjectsList().filter((structure) => {
			let expression = true;
			if (isDefined(structureType)) {
				if (structureType === SDMX_STRUCTURE_TYPE.ORGANISATION_SCHEME.key) {
					expression = expression && (
						SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key === structure.getStructureType() ||
						SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key === structure.getStructureType() ||
						SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key === structure.getStructureType() ||
						SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key === structure.getStructureType());
				} else if (structureType === SDMX_STRUCTURE_TYPE.ALLOWED_CONTRAINT.key) {
					expression = expression && (SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key === structure.getStructureType() && structure.getType() === "Allowed");
				} else if (structureType === SDMX_STRUCTURE_TYPE.ACTUAL_CONSTRAINT.key) {
					expression = expression && (SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key === structure.getStructureType() && structure.getType() === "Actual");
				} else {
					expression = expression && (structureType === structure.getStructureType());
				}
			}
			if (isDefined(agencyId)) {
				expression = expression && (agencyId === structure.getAgencyId());
			}
			if (isDefined(id)) {
				expression = expression && (id === structure.getId());
			}
			if (isDefined(version)) {
				expression = expression && (version === structure.getVersion());
			}
			return expression === true;
		});
	};

	getDSDObjectForXSDTests(structureType,agency,id,version){
		let structure = this.getSdmxObjectsWithCriteria(structureType,agency,id,version)
		if(structure.length === 0){return null;}
        let structureRef = structure[0].asReference();

        if(structureType === (SDMX_STRUCTURE_TYPE.DSD.key)){
            return this.getSdmxObject(structureRef)
        }else if(structureType === (SDMX_STRUCTURE_TYPE.DATAFLOW.key)){
            let childRef = this.getChildren(structureRef)[0]
            return this.getSdmxObject(childRef)
        }else if(structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key){
            let childRef = this.getChildren(structureRef)[0]
            let descendantRef = this.getChildren(childRef)[0]
            return this.getSdmxObject(descendantRef)
        }
	}
	
	 /**
     * Returns data (constraint, identifiers) for all resources needed for XSD tests (DSDs,DFs,PRAs)
     */
	 getConstraintDataForXSDTests() {
        let dataForXSDTests = {}
        let schemaTestsResources = getResources(TEST_INDEX.Schema)                
        for(var i in schemaTestsResources){
            let constraintData = this._getConstraintDataForResource(schemaTestsResources[i])
            if(constraintData){
                dataForXSDTests[schemaTestsResources[i]] = constraintData
            }
        }
    
        return dataForXSDTests
    }

    /**
     * Returns data (constraint, identifiers) for eached requested resources needed for XSD tests (DSDs,DFs,PRAs)
     * @param {*} xsdTestResource requested resource (datastructure,dataflow,provisionagreement).
     */
     _getConstraintDataForResource(xsdTestResource){
		if (!isDefined(xsdTestResource)) {
			throw new Error('Missing mandatory parameter \'resource\'');
		}
        let contentconstraints = this.getSdmxObjects().get(SDMX_STRUCTURE_TYPE.fromRestResource(STRUCTURES_REST_RESOURCE.contentconstraint))
        if(contentconstraints){
            let validContentconstraints = contentconstraints.filter(constraint => 
                                        (constraint.getType()) && constraint.getType() ==="Allowed" && constraint.getChildren().length>0);
            for(let j=0;j<validContentconstraints.length;j++){
                let requestedRef = validContentconstraints[j].getRandomRefOfSpecificStructureType(SDMX_STRUCTURE_TYPE.fromRestResource(xsdTestResource))
				if(requestedRef){
                    return {identifiers:requestedRef,constraintParent:validContentconstraints[j]}
                }
            }
        }
        return null;
	}
	
	getDataForXSDTests(resource){
		if (!isDefined(resource)) {
			throw new Error('Missing mandatory parameter \'resource\'');
		}
		if(resource === STRUCTURES_REST_RESOURCE.datastructure){
			let dsdWithMeasureDimension = this.getSdmxObjectsList().find(function(dsd){
				return dsd.hasMeasureDimension();
			})
			if(dsdWithMeasureDimension){
				return dsdWithMeasureDimension.asReference()
			}
			let randomDsd = this.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.DSD.key)
			return randomDsd.asReference()
		}else if(resource === STRUCTURES_REST_RESOURCE.dataflow){
			let dataflows = this.getSdmxObjectsList().filter(obj => obj instanceof DataflowObject)
			let chosenDf = dataflows.find( (df) => {
				let dsdRef = df.getChildren()[0];
				let dsdObj = this.getSdmxObject(dsdRef)
				return dsdObj.hasMeasureDimension()
			})
			if(chosenDf){
				return chosenDf.asReference()
			}
			let randomDf = this.getRandomSdmxObjectOfType(SDMX_STRUCTURE_TYPE.DATAFLOW.key)
			return randomDf.asReference()
		}else if(resource === STRUCTURES_REST_RESOURCE.provisionagreement){
			let provisionagreements = this.getSdmxObjectsList().filter(obj => obj.getStructureType() === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key)
			let provisionagreementsReferencingDfs = provisionagreements.filter(function(pra){
				return !pra.getChildren().some(child => child.getStructureType()===SDMX_STRUCTURE_TYPE.METADATA_FLOW.key)
			})
			if(provisionagreementsReferencingDfs.length === 0){
				return null;
			}
			let chosenPra = provisionagreementsReferencingDfs.find( (pra) => {
				let dfRef = pra.getChildren()[0];
				let dsdRef = this.getChildren(dfRef)[0]
				let dsdObj = this.getSdmxObject(dsdRef)
				return dsdObj.hasMeasureDimension()				
			})
			if(chosenPra){
				return chosenPra.asReference()
			}
			let randomIndex = Math.floor(Math.random() * provisionagreementsReferencingDfs.length);
			let randomPra = provisionagreementsReferencingDfs[randomIndex]
			return randomPra.asReference()
		}
	return null;
	}
}

module.exports = SdmxStructureObjects;