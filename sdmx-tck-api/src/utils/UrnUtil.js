const { SDMX_STRUCTURE_TYPE } = require("../constants/SdmxStructureType");
const StructureReference = require("../model/structure-queries-models/StructureReference");

class UrnUtil {

    static _getUrnPrefix(urn) {
        return urn.split('=')[0];
    }
    static _getUrnPostfix(urn) {
        return urn.split('=')[1];
    }
    // static _getUrnPostfix(agencyId, id, version) {
    //     return agencyId + ':' + id + '('+version+')';
    // }
    static _removeVersionsFromUrn(urnPostfix) {
        return urnPostfix.replaceAll(/(?=\().*?(?<=\))/g, '');
    }
    static getVersionFromUrn(urn) {
        let mainUrn = this._getUrnPostfix(urn);
        let versionPart = mainUrn.match(/(?=\().*?(?<=\))/g);
        if (versionPart && versionPart[0]) {
            return versionPart[0].replaceAll('\(', '').replaceAll('\)', '');
        }
        return null;
    }
    /**
     * Returns an array of the form "maintainableAgency", "maintainableId", "identifiableId" 
     */
    static getUrnComponents(urn) {
    	let mainUrn = this._getUrnPostfix(urn);
    	if (this._getIdentifiableType(urn) === SDMX_STRUCTURE_TYPE.AGENCY) {
    		let agencies = mainUrn.split('.');
    		if (agencies.length === 1) {
    			// agency belongs to the default agency scheme
    			return ['SDMX', 'AGENCIES', agencies[0]];
    		}
    		return [mainUrn.slice(0, mainUrn.lastIndexOf('.')), 'AGENCIES', agencies[agencies.length-1]];
    	}
        
        let urnVersionsRemoved = this._removeVersionsFromUrn(mainUrn);
        let splitAgency = urnVersionsRemoved.split(':');
        if (splitAgency.length === 1) {
        	throw new Error("URN agency id is expected to be followed by a ':' character : '"+urn+"'");
        }
        if (splitAgency.length !== 2) {
        	throw new Error("URN should not contain more than one ':' character: '"+urn+"'");
        }
        let splitIds = splitAgency[1].split('.');
        let urnComponents = [];
        urnComponents[0] = splitAgency[0]; // idx 0: maintainableAgencyID
        for (let i = 0; i < splitIds.length; i++) {
        	urnComponents[i+1] = splitIds[i]; // idx 1: maintainableID
        }
        return urnComponents;
    }

    static getUrnClass(urn) {
        if (urn === null || urn === undefined) {
            return null;
        }
        if (urn.split("=").length == 0) {
            throw new Error("Not a valid SDMX urn '" + urn + "'");
		}
		let urnPrefix = this._getUrnPrefix(urn);
        return urnPrefix.slice(urnPrefix.lastIndexOf('.') + 1);
    }
    /**
     * Returns the type of identifiable object that this urn represents
     */
    static _getIdentifiableType(urn) {
        let urnClass = this.getUrnClass(urn);

        let structureType = SDMX_STRUCTURE_TYPE.getStructureTypeByClass(urnClass);
        if (!structureType) {
            throw new Error("Could not find structure type for urn class '" + urnClass + "'");
        }
        return structureType;
	}

    /**
     * Returns the Artefact Type from its URN.
     */
    static getIdentifiableType (urn) {
        if (urn === null || urn === undefined) {
            return null;
        }
        return urn.slice(urn.indexOf('.', 29) + 1, urn.indexOf('='));
    }

    static getStructureIdentityRef (urn) {
        if (urn === null || urn === undefined) {
            return null;
        }
        let structureIdentification = urn.slice(urn.indexOf('=') + 1, urn.indexOf(')')+1);

        let structureType = SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass(this.getIdentifiableType(urn))
        let agency = structureIdentification.slice(0,structureIdentification.indexOf(':'));
        let id = structureIdentification.slice(structureIdentification.indexOf(':')+1,structureIdentification.indexOf('('))
        let version = structureIdentification.slice(structureIdentification.indexOf('(')+1,structureIdentification.indexOf(')'))

        return new StructureReference (structureType,agency,id,version)
    }
};

module.exports = UrnUtil;