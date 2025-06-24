var MaintainableObject = require('./MaintainableObject.js');
const SDMX_STRUCTURE_TYPE = require('../../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;

class ProvisionAgreementObject extends MaintainableObject {
    constructor(props, children, detail) {
        super(SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key, props, children, detail);
        this.setDataflowRef(
            this.children.find(ref => ref.getStructureType() === SDMX_STRUCTURE_TYPE.DATAFLOW.key)
        );
        this.setDataProviderRef(
            this.children.find(ref => ref.getStructureType() === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key)
        );
    };
    setDataflowRef(dataflowRef) {
        this.dataflowRef = dataflowRef;
    };
    getDataflowRef() {
        return this.dataflowRef;
    };
    setDataProviderRef(providerRef) {
        this.providerRef = providerRef;
    }
    getDataProviderRef() {
        return this.providerRef;
    }
};
module.exports = ProvisionAgreementObject;