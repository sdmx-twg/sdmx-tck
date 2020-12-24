var SdmxObjects = require('../SdmxObjects.js');
const DataStructureObject = require('../structure-queries-models/DataStructureObject.js');
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
    getAllObservations(){
        let allObservations = [];
        this.getDatasets().forEach(dataset => {
            allObservations = allObservations.concat(dataset.getObservations());
        })

        this.getAllSeries().forEach(s=> {
            allObservations=allObservations.concat(s.getObservations());
        })
        return allObservations;

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
    getRandomKey(dsdObj){
        if(!dsdObj || !dsdObj instanceof DataStructureObject){return;}
        let series = this.getAllSeries();
        let randomIndex = Math.floor(Math.random() * series.length);

        let randomKey = {};
        let dsdDimensions = dsdObj.getComponents().filter(comp => comp.getType()==="DIMENSION")
        let seriesAtrributes = series[randomIndex].getAttributes();
        dsdDimensions.forEach(dimension => {
            if(seriesAtrributes.hasOwnProperty(dimension.getId())){
                randomKey[dimension.getId()] = seriesAtrributes[dimension.getId()]
            }
        })
        return randomKey;
    }
}

module.exports = SdmxDataObjects;