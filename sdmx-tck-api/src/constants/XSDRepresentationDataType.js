const XSD_DATA_TYPE = {
    STRING:"xs:string",
    ALPHANUMERIC:"common:AlphaNumericType",
    ALPHA: "common:AlphaType",
    NUMERIC:"common:NumericType",
    BIG_INTEGER:"xs:integer",
    INTEGER:"xs:int",
    LONG:"xs:long",
    SHORT:"xs:short",
    DECIMAL:"xs:decimal",
    FLOAT:"xs:float",
    DOUBLE:"xs:double",
    BOOLEAN:"xs:boolean",
    URI:"xs:anyURI",
    COUNT:"xs:integer",
    INCLUSIVE_VALUE_RANGE:"xs:decimal",
    EXCLUSIVE_VALUE_RANGE:"xs:decimal",
    INCREMENTAL:"xs:decimal",
    OBSERVATIONAL_TIME_PERIOD:"common:ObservationalTimePeriodType",
    STANDARD_TIME_PERIOD:"common:StandardTimePeriodType",
    BASIC_TIME_PERIOD:"common:BasicTimePeriodType",
    GREGORIAN_TIME_PERIOD:"common:GregorianTimePeriodType",
    GREGORIAN_YEAR:"xs:gYear",
    GREGORIAN_YEAR_MONTH:"xs:gYearMonth",
    GREGORIAN_DAY:"xs:date",
    REPORTING_TIME_PERIOD:"common:ReportingTimePeriodType",
    REPORTING_YEAR:"common:ReportingYearType",
    REPORTING_SEMESTER:"common:ReportingSemesterType",
    REPORTING_TRIMESTER:"common:ReportingTrimesterType",
    REPORTING_QUARTER:"common:ReportingQuarterType",
    REPORTING_MONTH:"common:ReportingMonthType",
    REPORTING_WEEK:"common:ReportingWeekType",
    REPORTING_DAY:"common:ReportingDayType",
    DATE_TIME:"xs:dateTime",
    TIME_RANGE:"common:TimeRangeType",
    MONTH:"xs:gMonth",
    MONTH_DAY:"xs:gMonthDay",
    DAY:"xs:gDay",
    TIME:"xs:time",
    DURATION:"xs:duration",

    getMapping(sdmxDataType){
        switch (sdmxDataType){
            case "String":
                return XSD_DATA_TYPE.STRING
            case "AlphaNumeric":
                return XSD_DATA_TYPE.ALPHANUMERIC
            case "Alpha":
                return XSD_DATA_TYPE.ALPHA
            case "Numeric":
                return XSD_DATA_TYPE.NUMERIC
            case "BigInteger":
                return XSD_DATA_TYPE.BIG_INTEGER
            case "Integer":
                return XSD_DATA_TYPE.INTEGER 
            case "Long":
                return XSD_DATA_TYPE.LONG
            case "Short":
                return XSD_DATA_TYPE.SHORT
            case "Decimal":
                return XSD_DATA_TYPE.DECIMAL
            case "Float":
                return XSD_DATA_TYPE.FLOAT
            case "Double":
                return XSD_DATA_TYPE.DOUBLE
            case "Boolean":
                return XSD_DATA_TYPE.BOOLEAN
            case "URI":
                return XSD_DATA_TYPE.URI
            case "Count":
                return XSD_DATA_TYPE.COUNT
            case "InclusiveValueRange":
                return XSD_DATA_TYPE.INCLUSIVE_VALUE_RANGE
            case "ExclusiveValueRange":
                return XSD_DATA_TYPE.EXCLUSIVE_VALUE_RANGE
            case "Incremental":
                return XSD_DATA_TYPE.INCREMENTAL
            case "ObservationalTimePeriod":
                return XSD_DATA_TYPE.OBSERVATIONAL_TIME_PERIOD    
            case "StandardTimePeriod":
                return XSD_DATA_TYPE.STANDARD_TIME_PERIOD
            case "BasicTimePeriod":
                return XSD_DATA_TYPE.BASIC_TIME_PERIOD
            case "GregorianTimePeriod":
                return XSD_DATA_TYPE.GREGORIAN_TIME_PERIOD
            case "GregorianYear":
                return XSD_DATA_TYPE.GREGORIAN_YEAR
            case "GregorianYearMonth":
                return XSD_DATA_TYPE.GREGORIAN_YEAR_MONTH
            case "GregorianDay":
                return XSD_DATA_TYPE.GREGORIAN_DAY
            case "ReportingTimePeriod":
                return XSD_DATA_TYPE.REPORTING_TIME_PERIOD
            case "ReportingYear":
                return XSD_DATA_TYPE.REPORTING_YEAR
            case "ReportingSemester":
                return XSD_DATA_TYPE.REPORTING_SEMESTER
            case "ReportingTrimester":
                return XSD_DATA_TYPE.REPORTING_TRIMESTER
            case "ReportingQuarter":
                return XSD_DATA_TYPE.REPORTING_QUARTER
            case "ReportingMonth":
                return XSD_DATA_TYPE.REPORTING_MONTH    
            case "ReportingWeek":
                return XSD_DATA_TYPE.REPORTING_WEEK
            case "ReportingDay":
                return XSD_DATA_TYPE.REPORTING_DAY
            case "DateTime":
                return XSD_DATA_TYPE.DATE_TIME
            case "TimeRange":
                return XSD_DATA_TYPE.TIME_RANGE
            case "Month":
                return XSD_DATA_TYPE.MONTH
            case "MonthDay":
                return XSD_DATA_TYPE.MONTH_DAY
            case "Day":
                return XSD_DATA_TYPE.DAY
            case "Time":
                return XSD_DATA_TYPE.TIME
            case "Duration":
                return XSD_DATA_TYPE.DURATION
            default:
                return null
        }
    }

}

module.exports.XSD_DATA_TYPE = Object.freeze(XSD_DATA_TYPE);