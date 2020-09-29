var StructureReference = require("./StructureReference.js");
var StructureDetail = require('../constants/structure-queries-constants/StructureDetail.js').StructureDetail;

class MaintainableObject {
    constructor(structureType, props, children, detail) {
        this.structureType = structureType;
        this.agencyId = props.$.agencyID;
        this.id = props.$.id;
        this.version = props.$.version;
        this.urn = props.$.urn;
        this.isFinal = props.$.isFinal;
        this.isExternalReference = props.$.isExternalReference;
        this.structureURL = props.$.structureURL;
        this.children = children;
        this.detail = detail;
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
    getDetail() {
        return this.detail;
    };
    isFull() {
        return this.detail === StructureDetail.Full;
    }
    isStub() {
        return this.detail === StructureDetail.Stub;
    };
    isCompleteStub() {
        return this.detail === StructureDetail.CompleteStub;
    };
    getUrn() {
        return this.urn;
    };
    getIsFinal() {
        return this.isFinal;
    };
    getIsExternalReference() {
        return this.isExternalReference;
    };
    getStructureURL() {
        return this.structureURL;
    };
    /**
	 * Returns a list of structure references, that are children of the objectRef.
	 */
    getChildren() {
        return this.children;
    };
    asReference() {
        return new StructureReference(this.getStructureType(), this.getAgencyId(), this.getId(), this.getVersion());
    }
    getRandomRefOfSpecificStructureType(structureType){
        let requestedTypeChildren = this.children.filter(child => child.getStructureType() === structureType)
        if(!Array.isArray(requestedTypeChildren) || (Array.isArray(requestedTypeChildren) && requestedTypeChildren.length === 0)){
            return null;
        }
        return requestedTypeChildren[Math.floor(Math.random() * requestedTypeChildren.length)];
        
    }
    toString() {
        let str = [];
        str.push("structureType=" + this.getStructureType());
        str.push("agencyId=" + this.getAgencyId());
        str.push("id=" + this.getId());
        str.push("version=" + this.getVersion());
        str.push("urn=" + this.getUrn());
        str.push("isFinal=" + this.getIsFinal());
        str.push("isExternalReference=" + this.getIsExternalReference());
        str.push("structureURL=" + this.getStructureURL());
        str.push("children=[" + this.getChildren() + "]")

        return str.join(",");
    };
};

module.exports = MaintainableObject;