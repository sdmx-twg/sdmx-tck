const SdmxReporter = require("./SdmxReporter");

class Report {

   
    constructor(){
        this.swVersion;
        this.apiVersion;
        this.endpoint;
        this.reportData = [];
    }

    setSwVersion(swVersion){
        this.swVersion = swVersion;
    }
    getSwVersion(){
        return this.swVersion
    }


    setApiVersion(apiVersion){
        this.apiVersion = apiVersion;
    }
    getApiVersion(){
        return this.apiVersion
    }


    setEndpoint(endpoint){
        this.endpoint = endpoint;
    }
    getEndpoint(){
        return this.endpoint
    }

    addReportData(reportData){
        this.reportData.push(reportData)
    }
    setReportData(reportData){
        this.reportData = reportData;
    }
    getReportData(){
        return this.reportData
    }


}
module.exports = Report;