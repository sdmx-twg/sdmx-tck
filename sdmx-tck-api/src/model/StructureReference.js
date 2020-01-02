var isDefined = require('../utils/Utils.js').isDefined;

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
       
        var identifiersEquality =
            this.getStructureType() === structureRef.getStructureType() &&
            this.getAgencyId() === structureRef.getAgencyId() &&
            this.getId() === structureRef.getId() &&
            this.getVersion() === structureRef.getVersion();
            
        if(structureRef.identifiableIds && structureRef.identifiableIds.length>0
            && this.getIdentifiableIds() && this.getIdentifiableIds().length>0){
            return identifiersEquality &&
                    this.getIdentifiableIds().every(val => structureRef.getIdentifiableIds().includes(val));
        }
        return identifiersEquality;
    }
    toString() {
        return "{StructureType=" + this.getStructureType() + ", AgencyId=" + this.getAgencyId() + ", Id=" + this.getId() + ", Version=" + this.getVersion() + "}";
    }
};

module.exports = StructureReference;