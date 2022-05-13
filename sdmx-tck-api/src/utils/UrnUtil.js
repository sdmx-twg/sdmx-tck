const { SDMX_STRUCTURE_TYPE } = require("../constants/SdmxStructureType");
const StructureReference = require("../model/structure-queries-models/StructureReference");

class UrnUtil {
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