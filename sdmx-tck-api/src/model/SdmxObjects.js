var isDefined = require('../utils/Utils.js').isDefined;
var SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

class SdmxObjects {
	constructor(structures, structuresJson) {
		console.log("constructor invoked");
		this.structures = structures;
		this.structuresJson = structuresJson;
		console.log(this);
	}
	getSdmxObjects() {
		return this.structures;
	};
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
	getSdmxObjectsList() {
		let array = [];
		this.getSdmxObjects().forEach((structureList) => {
			structureList.forEach((structure) => {
				array.push(structure);
			});
		});
		return array;
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
		if (sdmxObject === null && sdmxObject === undefined) {
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
			let dpschemes = this.getSdmxObjects().get(SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key);
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
	toString() {
		let s = "";
		for (const [structureType, structuresArray] of this.structures) {
			s += "#" + structureType + "=" + structuresArray.length + " \n ";
			for (let structure in structuresArray) {
				s += structure + " : " + JSON.stringify(structuresArray[structure]) + " \n ";
			}
		}
		return s;
	};
};

module.exports = SdmxObjects;