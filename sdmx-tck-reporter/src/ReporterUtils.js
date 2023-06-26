var Utils = require('sdmx-tck-api').utils.Utils;
const TestInfo = require("./TestInfo");

class ReporterUtils {
    
    static _limitCellContent(content){
        if(!Utils.isDefined(content) || !content instanceof String){
            throw new Error("Missing Mandatory parameter 'content' ");
        }
        const xlsxCellLimit = 30000;

        let indexEnd = (content.length > xlsxCellLimit) ? xlsxCellLimit : content.length;
        return content.substring(0,indexEnd);

    }
}

module.exports = ReporterUtils;