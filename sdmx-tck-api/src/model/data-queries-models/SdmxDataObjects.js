var SdmxObjects = require('../SdmxObjects.js')
const DATA_COMPONENTS_TYPES = require('../../constants/data-queries-constants/DataComponentsTypes').DATA_COMPONENTS_TYPES

class SdmxDataObjects extends SdmxObjects{
    constructor(sdmxObjects){
        super(sdmxObjects)
    }
    getStructureId(){
        return this.getSdmxObjects().get(DATA_COMPONENTS_TYPES.STRUCTURE_ID);
    }
    getDataset(){
        return this.getSdmxObjects().get(DATA_COMPONENTS_TYPES.DATASET);
    }
}

module.exports = SdmxDataObjects;