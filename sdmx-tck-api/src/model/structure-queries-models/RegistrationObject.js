var MaintainableObject = require('./MaintainableObject.js');
var SDMX_STRUCTURE_TYPE = require('../../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

class RegistrationObject extends MaintainableObject {
    constructor(props, children) {
        super(SDMX_STRUCTURE_TYPE.REGISTRATION.key, props, children);
        
        this.setId(props.id);
        this.setValidFrom(props.validFrom);
        this.setValidTo(props.validTo);
        this.setLastUpdated(props.lastUpdated);
    };
	
    getProvisionAgreementRef() {
        let provisionAgreementRef = null;
        if (Array.isArray(this.getChildren()) && this.getChildren().length > 0) {
            provisionAgreementRef = this.getChildren()[0];
        }
        return provisionAgreementRef;
    }
    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }
    setValidFrom(validFrom) {
        this.validFrom = validFrom;
    }
    getValidFrom() {
        return this.validFrom;
    }
    setValidTo(validTo) {
        this.validTo = validTo;
    }
    getValidTo() {
        return this.validTo;
    }
    setLastUpdated(lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    getLastUpdated() {
        return this.lastUpdated;
    }
};
module.exports = RegistrationObject;