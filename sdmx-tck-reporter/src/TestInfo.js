class TestInfo {

    constructor(index,name,type,state,isCompliant,isCovered,startTime,endTime,duration,url,error){
        this.index = index;
        this.name = name;
        this.type = type;
        this.state = state;
        this.isCompliant = isCompliant;
        this.isCovered = isCovered;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.url = url;
        this.error = error;
    }

    setIndex(index){
        this.index = index
    }
    getIndex(){
        return this.index;
    }
    setName(name){
        this.name = name
    }
    getName(){
        return this.name;
    }
    setType(type){
        this.type = type
    }
    getType(){
        return this.type;
    }
    setState(state){
        this.state = state
    }
    getState(){
        return this.state;
    }
    setIsCompliant(isCompliant){
        this.isCompliant = isCompliant;
    }
    getIsCompliant(){
        return this.isCompliant;
    }
    setIsCovered(isCovered){
        this.isCovered = isCovered;
    }
    getIsCovered(){
        return this.isCovered;
    }
    setStartTime(startTime){
        this.startTime = startTime
    }
    getStartTime(){
        return this.startTime;
    }
    setEndTime(endTime){
        this.endTime = endTime
    }
    getEndTime(){
        return this.endTime;
    }
    setDuration(duration){
        this.duration = duration
    }
    getDuration(){
        return this.duration;
    }
    setURL(url){
        this.url = url
    }
    getURL(){
        return this.url;
    }
    setError(error){
        this.error = error
    }
    getError(){
        return this.error;
    }

    static fromJSON(testJSON){
        return Object.assign(new TestInfo, testJSON)
    }


    
}
module.exports = TestInfo;