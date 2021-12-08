const Report = require("./Report");
const TestInfo = require("./TestInfo");
var Utils = require('sdmx-tck-api').utils.Utils;
const EXPORT_FORMATS = require('sdmx-tck-api').constants.EXPORT_FORMATS;


class SdmxReporter {

    //Initiation of reporting module
    static init(endpoint,apiVersion,swVersion,tests){
        
        this.reportObj = new Report();
        
        this.reportObj.setEndpoint(endpoint)
        this.reportObj.setApiVersion(apiVersion)
        this.reportObj.setSwVersion(swVersion)

    }

    //Record a test
    static record(test){
        if(!test instanceof TestInfo || !Utils.isDefined(test)){
            throw new Error("Missing Mandatory parameter 'test' ");

        }
        this.reportObj.addReportData(test)
        
    }

    //Publish a report
    static publishReport(format){
        if(!Utils.isDefined(format)){
            throw new Error("Missing Mandatory parameter 'format' ");
        }
        if(!EXPORT_FORMATS.isValidFormat(format)){
            throw new Error("Unsupported format ");
        }
        let report;
        if(format === EXPORT_FORMATS.CSV){
            report = this._createCsvReport();
        }else if(format === EXPORT_FORMATS.EXCEL){
            report = this._createExcelReport();
        }else if(format === EXPORT_FORMATS.XML){
            report = this._createXMLReport();
        }
        
        
        return report;
        
    }
    static _createXMLReport(){

    }
    static _createExcelReport(){

    }
    static _createCsvReport(){
        let lines="";

        let reportInfoHeader = "TCK Version;Service Tested;Api Version";
        let reportInfoData = this.reportObj.getSwVersion() +";"+this.reportObj.getEndpoint()+";"+this.reportObj.getApiVersion();
        
        lines = reportInfoHeader +"\r\n"+ reportInfoData +"\r\n\r\n"

        let header = "Index;Test Name;Test Type;State;Start Time;End Time;URL;Errors";
        lines = lines +header + "\r\n";
        this.reportObj.getReportData().forEach(test => {
            let line = test.getIndex() + ";" + test.getName() + ";" + test.getType() + ";" + test.getState() + ";" + test.getStartTime() + ";" + test.getEndTime() + ";" + test.getURL() + ";" + test.getError();
            lines = lines + line +"\r\n";
        })
        return lines;
    }
}
module.exports = SdmxReporter;