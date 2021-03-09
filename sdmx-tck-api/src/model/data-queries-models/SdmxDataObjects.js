var SdmxObjects = require('../SdmxObjects.js');
const DataStructureObject = require('../structure-queries-models/DataStructureObject.js');
const DATA_COMPONENTS_TYPES = require('../../constants/data-queries-constants/DataComponentsTypes').DATA_COMPONENTS_TYPES

class SdmxDataObjects extends SdmxObjects{
    constructor(sdmxObjects){
        super(sdmxObjects)
    }
    
    getHeaderStructureData(){
        return this.getSdmxObjects().get(DATA_COMPONENTS_TYPES.STRUCTURE_DATA);
    }
    getAllHeaderRefs(){
        let structureData = this.getSdmxObjects().get(DATA_COMPONENTS_TYPES.STRUCTURE_DATA);
        let headerRefs = [];
        structureData.forEach(sd => headerRefs = headerRefs.concat(sd.getReferences()));
        return headerRefs;
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
    getRandomKeysPair(dsdObj){
        if(!dsdObj || !dsdObj instanceof DataStructureObject){return;}

        let series = this.getAllSeries();
        if(series.length === 0){return}

        let randomKey = {};
        let randomKeyArr = []
        let dsdDimensions = dsdObj.getComponents().filter(comp => comp.getType()==="DIMENSION")
        for(let i in series){
            randomKey = {}
            let seriesAtrributes = series[i].getAttributes();
            dsdDimensions.forEach(dimension => {
                if(seriesAtrributes.hasOwnProperty(dimension.getId())){
                    randomKey[dimension.getId()] = seriesAtrributes[dimension.getId()]
                }
            })
            
            randomKeyArr.push(dsdObj.sortRandomKeyAccordingToDimensions(randomKey))
            if(randomKeyArr.length === 2){break;}
        }
        return randomKeyArr;
    }
}

module.exports = SdmxDataObjects;