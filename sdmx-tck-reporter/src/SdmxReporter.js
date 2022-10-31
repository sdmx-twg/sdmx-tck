const Report = require("./Report");
const TestInfo = require("./TestInfo");
var Utils = require('sdmx-tck-api').utils.Utils;
const EXPORT_FORMATS = require('sdmx-tck-api').constants.EXPORT_FORMATS;
const TEST_STATE = require('sdmx-tck-api').constants.TEST_STATE;
const excelJS = require("exceljs");
const ReporterUtils = require('./ReporterUtils.js')
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
                ServiceTested:this.reportObj.getEndpoint(),
                ReportCreationDate:new Date().toString()
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
        const infoWorksheet = workbook.addWorksheet("Information");   
        const worksheet = workbook.addWorksheet("SDMX-TCK-Report"); 
        const generalInfoRowIndex = 1;
        const tckResultsRowIndex = 7;

        //Data sheet columns
        worksheet.columns = [    
            { header: "Index", key: "index", width: 20 }, 
            { header: "Test Name", key: "name", width: 100 },
            { header: "Test Type", key: "type", width: 50 },
            { header: "Test State", key: "state", width: 10 },
            { header: "Compliant", key: "isCompliant", width: 10 },
            { header: "Covered", key: "isCovered", width: 10 },
            { header: "Start Time", key: "startTime", width: 25 },
            { header: "End Time", key: "endTime", width: 25 },
            { header: "Duration (sec)", key: "duration", width: 20 },
            { header: "URL", key: "url", width: 100 },
            { header: "Error", key: "error", width: 200 },
        ];

        

        //Data sheet actual data
        this.reportObj.getReportData().forEach((test) => {
            //Limit error cell length
            test.setError(ReporterUtils._limitCellContent(test.getError()));
            worksheet.addRow(test);
        });

        var generalInfoRows = [
            ["General Information"],
            ["Software Information",this.reportObj.getSwVersion()],
            ["Api Version",this.reportObj.getApiVersion()],
            ["ServiceTested",this.reportObj.getEndpoint()],
            ["Report Creation Date",new Date().toString()],
        ];
        // insert new rows and return them as array of row objects
        infoWorksheet.insertRows(generalInfoRowIndex, generalInfoRows);


        var resultsRows = [
            ["TCK Results"],
            ["Number Of Tests",this.reportObj.getNumberOfTests()],
            ["Compliance (%)", parseFloat(this.reportObj.getCompliance())*100],
            ["Coverage (%)",parseFloat(this.reportObj.getCoverage())*100],
        ];
        // insert new rows and return them as array of row objects
        infoWorksheet.insertRows(tckResultsRowIndex, resultsRows);


        // Making first line in report excel bold
        worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };});

        //Style information sheet
        infoWorksheet.getColumn(1).width = 30;
        infoWorksheet.getColumn(2).width = 70;
        infoWorksheet.eachRow(function(row, rowNumber){
            if(rowNumber === generalInfoRowIndex || rowNumber === tckResultsRowIndex){
                row.eachCell((cell) => {  cell.font = { bold: true }; cell.fill = {type:'pattern',pattern:"solid",fgColor:{argb:'00a4c9'}}});
            }else{
                row.getCell(1).font = {bold:true};
                row.getCell(1).fill = {type:'pattern',pattern:"solid",fgColor:{argb:'cfd7f8'}}
            }
        });

        //Fill color the header of report data
        worksheet.getRow(1).eachCell(function(cell){
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
        return await workbook.xlsx.writeBuffer({});
  
    }

    static _createJSONReport(){
        let jsonObj = {
            Report:{
                Information:{
                    SoftwareVersion:this.reportObj.getSwVersion(),
                    ApiVersion:this.reportObj.getApiVersion(),
                    ServiceTested:this.reportObj.getEndpoint(),
                    ReportCreationDate:new Date().toString()
                },
                Results:{
                    NumberOfTests:this.reportObj.getNumberOfTests().toString(),
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