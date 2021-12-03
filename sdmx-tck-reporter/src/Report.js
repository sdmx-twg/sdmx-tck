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

    static flatenTestObject(testsArray){
        let flatTestArray = [];
        for (var t in testsArray) {
            let test = testsArray[t];
            flatTestArray.push(test)
            this._getSubTests(test);
        }
        return flatTestArray;
    }

    static _getSubTests(test){
        for (var j in test.subTests) {
            let test = test.subTests[j];
            flatTestArray.push(test)
            if(test.subTests){
                return this._getSubTests(test)
            }
        }
    }

}
module.exports = Report;