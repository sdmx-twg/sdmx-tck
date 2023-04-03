const COMPLEX_TYPES_NAMES = {
    DATA_SET_TYPE:"DataSetType",
    SERIES_TYPE:"SeriesType",
    GROUP_TYPE:"GroupType",
    OBS_TYPE:"ObsType"
}

const COMPLEX_TYPES_COMPOSITORS_NAMES ={
    CHOICE:"choice",
    SEQUENCE:"sequence"
}

const COMPLEX_TYPES_RESTRICTION_BASE = {
    DSD_TIME_SERIES_DATA_SET_TYPE:"dsd:TimeSeriesDataSetType",
    DSD_DATA_SET_TYPE : "dsd:DataSetType",
    DSD_TIME_SERIES_TYPE:"dsd:TimeSeriesType",
    DSD_SERIES_TYPE:"dsd:SeriesType",
    DSD_GROUP_TYPE:"dsd:GroupType",
    GROUP_TYPE:"GroupType",
    DSD_OBS_TYPE:"dsd:ObsType",
    DSD_TIME_SERIES_OBS_TYPE:"dsd:TimeSeriesObsType"
}

module.exports.COMPLEX_TYPES_NAMES = Object.freeze(COMPLEX_TYPES_NAMES);
module.exports.COMPLEX_TYPES_COMPOSITORS_NAMES = Object.freeze(COMPLEX_TYPES_COMPOSITORS_NAMES);
module.exports.COMPLEX_TYPES_RESTRICTION_BASE = Object.freeze(COMPLEX_TYPES_RESTRICTION_BASE);