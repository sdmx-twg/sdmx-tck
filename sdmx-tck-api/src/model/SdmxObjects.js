class SdmxObjects {
	constructor(sdmxObjects, structuresJson) {
		this.sdmxObjects = sdmxObjects;
		//this.structuresJson = structuresJson;
	}
	getSdmxObjects() {
		return this.sdmxObjects;
	};
<<<<<<< HEAD
	
=======

	getSdmxObjectsOfType(structureType) {
		return this.getSdmxObjectsList().filter(obj => obj.getStructureType() === structureType);
	};

>>>>>>> v4.8.0
	getSdmxObjectsList() {
		let array = [];
		this.getSdmxObjects().forEach((sdmxObjectsList) => {
			sdmxObjectsList.forEach((sdmxObject) => {
				array.push(sdmxObject);
			});
		});
		return array;
	};

<<<<<<< HEAD
=======
	getNoOfObjects() {
		let count = 0;
		// Iterate over the map and sum the lengths of all arrays
		for (const array of this.getSdmxObjects().values()) {
			count += array.length;
		}
		return count;
	};

>>>>>>> v4.8.0
	toJSON() {
		let s = {};
		this.getSdmxObjects().forEach(function(v, k) {
			s[k] = v;
		});
		return { sdmxObjects: s };
	};
};

module.exports = SdmxObjects;