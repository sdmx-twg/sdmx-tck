class DateTransformations {

    static getFullDatePeriod(date){
        let year = date.split("-")[0]
        if(date.indexOf("Q") !== -1){
            let quarter = parseInt(date.split("-")[1].split("Q")[1]);
            return this._getFullDateFromQuarter(year,quarter);
        }else if(date.indexOf("W")!==-1){
            let week = parseInt(date.split("-")[1].split("W")[1]);
            return this._getFullDateFromWeeks(year,week);
        }else if(date.indexOf("S")!==-1){
            let semiAnnual = parseInt(date.split("-")[1].split("S")[1]);
            return this._getFullDateFromSemiannual(year,semiAnnual);
        }
        return null;
    }
    static getLastDayOfDate(dateString){
        //Get last date from a period of time like 2010-Q1
        if(dateString.indexOf("Q")!==-1 || dateString.indexOf("S")!==-1 || dateString.indexOf("W")!==-1 ){
            return this.getFullDatePeriod(dateString).until
        }
        //Get last day of year for a date like 2011
        if(dateString.split("-").length === 1){
            let d = new Date(dateString)
            d.setUTCFullYear(d.getUTCFullYear()+1)
            d.setUTCDate(d.getUTCDate()-1);
            return new Date(d);
        }
         //Get last day of month for a date like 2011-05
        else if(dateString.split("-").length === 2){
            let d = new Date(dateString)
            d.setUTCMonth(d.getUTCMonth()+1)
            d.setUTCDate(d.getUTCDate()-1)
            return new Date(d);
        }
        
        else if(dateString.split("-").length === 3){
            return new Date(dateString);
            
        }
        return null;
    }
    static _getFullDateFromWeeks(year,weekNum){
        let weekEnd = new Date(year).setUTCDate(new Date(year).getUTCDate()+weekNum*7-1);
        let weekStart = new Date(year).setUTCDate(new Date(year).getUTCDate()+(weekNum-1)*7)
        return this._fromMillisecsToDate(weekStart,weekEnd)
    }

    static _getFullDateFromQuarter(year,quarter){
        let startOfNextQuarter = new Date(year).setUTCMonth(new Date(year).getUTCMonth()+quarter*3);
        let quarterEnd = new Date(startOfNextQuarter).setUTCDate(new Date(startOfNextQuarter).getUTCDate()-1)
        let quarterStart = new Date(year).setUTCMonth(new Date(year).getUTCMonth()+(quarter-1)*3)
        return this._fromMillisecsToDate(quarterStart,quarterEnd)
    }

    static _getFullDateFromSemiannual(year,semiannual){
        let startOfNextSemiannual = new Date(year).setUTCMonth(new Date(year).getUTCMonth()+semiannual*6);
        let semiannualEnd = new Date(startOfNextSemiannual).setUTCDate(new Date(startOfNextSemiannual).getUTCDate()-1);
        let semiannualStart = new Date(year).setUTCMonth(new Date(year).getUTCMonth()+(semiannual-1)*6)
        return this._fromMillisecsToDate(semiannualStart,semiannualEnd)
    }
    static fromStringToUtcDate(dateString){
        let splitDate = dateString.split("-");

        if(splitDate[0] && !splitDate[1] && !splitDate[2]){
            return Date.UTC(parseInt(splitDate[0]))
        }else if(splitDate[0] && splitDate[1] && !splitDate[2]){
            return Date.UTC(parseInt(splitDate[0]),parseInt(splitDate[1])-1)
        }else if(splitDate[0] && splitDate[1] && splitDate[2]){
            return Date.UTC(parseInt(splitDate[0]),parseInt(splitDate[1])-1,splitDate[2])
        }
        return null;
    }
    static _fromMillisecsToDate(start,end){
        let monthStart = (parseInt(new Date(start).getUTCMonth())+1).toString()
        monthStart = (monthStart.length === 1)?"0"+monthStart:monthStart;

        let monthEnd = (parseInt(new Date(end).getUTCMonth())+1).toString()
        monthEnd = (monthEnd.length === 1)?"0"+monthEnd:monthEnd;

        let dayStart = (new Date(start).getUTCDate().toString().length === 1) ? "0"+new Date(start).getUTCDate().toString():new Date(start).getUTCDate().toString()
        let dayEnd = (new Date(end).getUTCDate().toString().length === 1) ? "0"+new Date(end).getUTCDate().toString():new Date(end).getUTCDate().toString()

        let from = new Date(start).getUTCFullYear()+"-"+monthStart+"-"+dayStart
        let until = new Date(end).getUTCFullYear()+"-"+monthEnd+"-"+dayEnd

        return {from:from,until:until}
    }
};

module.exports = DateTransformations;