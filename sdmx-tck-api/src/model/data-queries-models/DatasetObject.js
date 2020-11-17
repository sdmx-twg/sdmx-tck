class DatasetObject {

    constructor(id,series,groups,observations){
        this.id = id;
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
}

module.exports = DatasetObject;