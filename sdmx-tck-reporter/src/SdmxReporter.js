const Report = require("./Report");
const TestInfo = require("./TestInfo");
var Utils = require('sdmx-tck-api').utils.Utils;
const EXPORT_FORMATS = require('sdmx-tck-api').constants.EXPORT_FORMATS;
const excelJS = require("exceljs");

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
    static async  publishReport(format){
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
            report = await this._createExcelReport();
        }else if(format === EXPORT_FORMATS.XML){
            report = this._createXMLReport();
        }
        
        
        return report;
        
    }
    static _createXMLReport(){

    }
    static async _createExcelReport(){

        // Create workbook and 2 sheet one for report data and one for report metadata
        const workbook = new excelJS.Workbook();   
        const worksheet = workbook.addWorksheet("SDMX-TCK-Report"); 
        const infoWorksheet = workbook.addWorksheet("Information"); 

        //Data sheet columns
        worksheet.columns = [    
            { header: "Index", key: "index", width: 20 }, 
            { header: "Test Name", key: "name", width: 100 },
            { header: "Test Type", key: "type", width: 50 },
            { header: "Test State", key: "state", width: 10 },
            { header: "Start Time", key: "startTime", width: 25 },
            { header: "End Time", key: "endTime", width: 25 },
            { header: "URL", key: "url", width: 100 },
            { header: "Error", key: "error", width: 100 },
        ];

        //Data sheet actual data
        this.reportObj.getReportData().forEach((test) => {
              worksheet.addRow(test);
        });

        //Metadata sheet columns
        infoWorksheet.columns = [    
            { header: "Software Version", key: "swVersion", width: 50 }, 
            { header: "Api Version", key: "apiVersion", width: 50 },
            { header: "Service Tested", key: "endpoint", width: 80 },
            
        ];
        //Metadata sheet data
        infoWorksheet.addRow(this.reportObj)

        console.log(this.reportObj.getEndpoint())
        console.log(this.reportObj.getApiVersion())
        console.log(this.reportObj.getSwVersion())

        // Making first line in excel bold
        worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});
        infoWorksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});

        //return buffer with workbook data
        return await workbook.xlsx.writeBuffer();
  
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