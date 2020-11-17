var SdmxObjects = require('../SdmxObjects.js')
const DATA_COMPONENTS_TYPES = require('../../constants/data-queries-constants/DataComponentsTypes').DATA_COMPONENTS_TYPES

class SdmxDataObjects extends SdmxObjects{
    constructor(sdmxObjects){
        super(sdmxObjects)
    }
    getStructureRefs(){
        return this.getSdmxObjects().get(DATA_COMPONENTS_TYPES.STRUCTURE_REFS);
    }
    getStructureId(){
        return this.getSdmxObjects().get(DATA_COMPONENTS_TYPES.STRUCTURE_ID);
    }
    getDatasets(){
        return this.getSdmxObjects().get(DATA_COMPONENTS_TYPES.DATASET);
    }
    getRandomKey(){
        let allSeries = [];
        this.getDatasets().forEach(dataset => {
            allSeries.concat(dataset.getSeries())
        })
        let randomIndex = Math.floor(Math.random() * allSeries.length);
        return allSeries[randomIndex].getAttributes()
    }
}

module.exports = SdmxDataObjects;