class Report {

   
    constructor(){
        this.swVersion;
        this.apiVersion;
        this.format;
        this.requestMode;
        this.endpoint;
        this.numberOfTests;
        this.compliance;
        this.coverage;
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

    setFormat(format) {
        this.format = format;
    }
    getFormat() {
        return this.format;
    }
    setRequestMode(requestMode) {
        this.requestMode = requestMode;
    }
    getRequestMode() {
        return this.requestMode;
    }

    setEndpoint(endpoint){
        this.endpoint = endpoint;
    }
    getEndpoint(){
        return this.endpoint
    }

    setNumberOfTests(numberOftests){
        this.numberOfTests = numberOftests
    }
    getNumberOfTests(){
        return this.numberOfTests;
    }

    setCompliance(compliance){
        this.compliance = compliance
    }
    getCompliance(){
        return this.compliance
    }

    setCoverage(coverage){
        this.coverage = coverage
    }
    getCoverage(){
        return this.coverage
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