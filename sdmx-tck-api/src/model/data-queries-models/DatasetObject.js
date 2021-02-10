class DatasetObject {

    constructor(id,attributes,series,groups,observations){
        this.id = id;
        this.attributes=attributes;
        this.series = series;
        this.groups = groups;
        this.observations = observations;     
    }

    setId(id){
        this.id = id;
    }
    getId(){
        return this.id;
    }
    setAttributes(attributes){
        this.attributes = attributes;
    }
    getAttributes(){
        return this.attributes;
    }
    setSeries(series){
        this.series = series;
    }
    getSeries(){
        return this.series;
    }
    setGroups(groups){
        this.groups = groups;
    }
    getGroups(){
        return this.groups;
    }
    setObservations(observations){
        this.observations = observations;
    }
    getObservations(){
        return this.observations;
    }
    timeSeriesViewOfData(){
        return this.getSeries().length > 0 && this.getSeries().every(s=>s.getObservations().length>0) && this.getObservations.length === 0;
    }
    flatViewOfData(){
        return this.getSeries().length === 0  && this.getObservations().length > 0;
    }
}

module.exports = DatasetObject;