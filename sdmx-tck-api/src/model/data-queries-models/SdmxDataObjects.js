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
        return this.getSdmxObjects().get(DATA_COMPONENTS_TYPES.DATASETS);
    }
    getAllSeries(){
        let allSeries = [];
        this.getDatasets().forEach(dataset => {
            allSeries = allSeries.concat(dataset.getSeries())
        })
        return allSeries
    }
    getAllGroups(){
        let allGroups = [];
        this.getDatasets().forEach(dataset => {
            allGroups = allGroups.concat(dataset.getGroups())
        })
        return allGroups
    }
    getRandomKey(){
        let series = this.getAllSeries();
        let randomIndex = Math.floor(Math.random() * series.length);
        return series[randomIndex].getAttributes()
    }
}

module.exports = SdmxDataObjects;