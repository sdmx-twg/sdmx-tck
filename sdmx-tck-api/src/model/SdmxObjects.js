class SdmxObjects {
	constructor(sdmxObjects, structuresJson) {
		this.sdmxObjects = sdmxObjects;
		//this.structuresJson = structuresJson;
	}
	getSdmxObjects() {
		return this.sdmxObjects;
	};
	
	getSdmxObjectsList() {
		let array = [];
		this.getSdmxObjects().forEach((sdmxObjectsList) => {
			sdmxObjectsList.forEach((sdmxObject) => {
				array.push(sdmxObject);
			});
		});
		return array;
	};

	toJSON() {
		let s = {};
		this.getSdmxObjects().forEach(function(v, k) {
			s[k] = v;
		});
		return { sdmxObjects: s };
	};
};

module.exports = SdmxObjects;