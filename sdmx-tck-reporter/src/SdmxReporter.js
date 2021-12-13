const Report = require("./Report");
const TestInfo = require("./TestInfo");
var Utils = require('sdmx-tck-api').utils.Utils;
const EXPORT_FORMATS = require('sdmx-tck-api').constants.EXPORT_FORMATS;
const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const excelJS = require("exceljs");
var js2xmlparser = require("js2xmlparser");

class SdmxReporter {

    //Initiation of reporting module
    static init(endpoint,apiVersion,swVersion,scores){
        
        this.reportObj = new Report();
        
        this.reportObj.setEndpoint(endpoint)
        this.reportObj.setApiVersion(apiVersion)
        this.reportObj.setSwVersion(swVersion)
        this.reportObj.setCompliance(scores.complianceScore);
        this.reportObj.setCoverage(scores.coverageScore)
        this.reportObj.setNumberOfTests(scores.numOfTests)


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
            throw new Error("Unsupported format for TCK report ");
        }
        let report;
        if(format === EXPORT_FORMATS.JSON){
            report = this._createJSONReport();
        }else if(format === EXPORT_FORMATS.EXCEL){
            report = await this._createExcelReport();
        }else if(format === EXPORT_FORMATS.XML){
            report = this._createXMLReport();
        }
        
        
        return report;
        
    }
    static _createXMLReport(){
        let jsonObj = {
            Information:{
                SoftwareVersion:this.reportObj.getSwVersion(),
                ApiVersion:this.reportObj.getApiVersion(),
                ServiceTested:this.reportObj.getEndpoint()
            },
            Results:{
                NumberOfTests:this.reportObj.getNumberOfTests(),
                Compliance:this.reportObj.getCompliance(),
                Coverage:this.reportObj.getCoverage()
            },
            Tests:{
                Test:this.reportObj.getReportData()
            }
        }

        return js2xmlparser.parse("Report", jsonObj).toString();
    }

    static async _createExcelReport(){

        // Create workbook and 2 sheet one for report data and one for report metadata
        const workbook = new excelJS.Workbook();   
        const worksheet = workbook.addWorksheet("SDMX-TCK-Report"); 
        const infoWorksheet = workbook.addWorksheet("Information"); 
        const resultsWorksheet = workbook.addWorksheet("Results")

        //Data sheet columns
        worksheet.columns = [    
            { header: "Index", key: "index", width: 20 }, 
            { header: "Test Name", key: "name", width: 100 },
            { header: "Test Type", key: "type", width: 50 },
            { header: "Test State", key: "state", width: 10 },
            { header: "Start Time", key: "startTime", width: 25 },
            { header: "End Time", key: "endTime", width: 25 },
            { header: "Duration (sec)", key: "duration", width: 20 },
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

        //Results sheet columns
        resultsWorksheet.columns = [
            { header: "Number Of Tests", key: "numberOfTests", width: 50 }, 
            { header: "Compliance (%)", key: "compliance", width: 50 },
            { header: "Coverage (%)", key: "coverage", width: 50 },
        ]

        //Results sheet data
        resultsWorksheet.addRow(this.reportObj)

        //Coverage and Compliance transform %
        resultsWorksheet.getRow(2).getCell(2).value = parseFloat(resultsWorksheet.getRow(2).getCell(2) * 100).toFixed(2)
        resultsWorksheet.getRow(2).getCell(3).value = parseFloat(resultsWorksheet.getRow(2).getCell(3) * 100).toFixed(2)



        // Making first line in excel bold
        worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});
        infoWorksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});
        resultsWorksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});

        //Fill color the header of metadata
        infoWorksheet.getRow(1).eachCell(function(cell){
            cell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'00a4c9'},
              };
        });

        //Fill color the header of report data
        worksheet.getRow(1).eachCell(function(cell){
            cell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'00a4c9'},
              };
        });

        //Fill color the header of report data
        resultsWorksheet.getRow(1).eachCell(function(cell){
        cell.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'00a4c9'},
            };
        });

        //font color the status cells
        worksheet.eachRow(function(row){
            if(row.getCell(4).value === TEST_STATE.FAILED){
                row.getCell(4).font = {color: {argb: "F0131A"}};
            }else if(row.getCell(4).value === TEST_STATE.COMPLETED){
                row.getCell(4).font = {color: {argb: "4CA426"}};
            }else if(row.getCell(4).value === TEST_STATE.UNABLE_TO_RUN){
                row.getCell(4).font = {color: {argb: "F09013"}};
            }
        });

        //return buffer with workbook data
        return await workbook.xlsx.writeBuffer();
  
    }

    static _createJSONReport(){
        let jsonObj = {
            Report:{
                Information:{
                    SoftwareVersion:this.reportObj.getSwVersion(),
                    ApiVersion:this.reportObj.getApiVersion(),
                    ServiceTested:this.reportObj.getEndpoint()
                },
                Results:{
                    NumberOfTests:this.reportObj.getNumberOfTests(),
                    Compliance:this.reportObj.getCompliance(),
                    Coverage:this.reportObj.getCoverage()
                },
    
                Tests:this.reportObj.getReportData()
            }

        }

        return JSON.stringify(jsonObj)
    }
}
module.exports = SdmxReporter;