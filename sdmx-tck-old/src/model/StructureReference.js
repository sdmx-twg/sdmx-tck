import { isDefined } from '../utils/Utils';

class StructureReference {
    constructor(structureType, agencyId, id, version, ids) {
        if (!isDefined(structureType) ||
            !isDefined(agencyId) ||
            !isDefined(id) ||
            !isDefined(version)) {
            throw new Error("Invalid structure reference information provided.");
        }
        this.structureType = structureType;
        this.agencyId = agencyId;
        this.id = id;
        this.version = version;
        this.identifiableIds = [];

        this.addIdentifiableIds(ids);
    };
    getStructureType() {
        return this.structureType;
    };
    getAgencyId() {
        return this.agencyId;
    };
    getId() {
        return this.id;
    };
    getVersion() {
        return this.version;
    };
    getIdentifiableIds() {
        return this.identifiableIds;
    };
    addIdentifiableIds(ids) {
        if (isDefined(ids)) {
            for (let i in ids) {
                if (!this.identifiableIds.includes(ids[i])) {
                    this.identifiableIds.push(ids[i]);
                }
            }
        }
    };
    equals(structureRef) {
        return  this.getStructureType() === structureRef.getStructureType() &&
                this.getAgencyId() === structureRef.getAgencyId() &&
                this.getId() === structureRef.getId() &&
                this.getVersion() === structureRef.getVersion();
    }
    toString() {
        return "{StructureType=" + this.getStructureType() + ", AgencyId=" + this.getAgencyId() + ", Id=" + this.getId() + ", Version=" + this.getVersion() + "}";
    }
};

export default StructureReference;