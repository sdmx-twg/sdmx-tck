const SCHEMA_ELEMENT_NAMES = {
   GROUP:"Group",
   OBS:"Obs",
   SERIES:"Series"
}
const SCHEMA_ELEMENT_REF = {
    COMMON_ANNOTATIONS:"common:Annotations",
    COMMON_DATA_PROVIDER_REFERENCE:"common:DataProviderReferenceType"
}
const SCHEMA_ELEMENT_TYPES = {
    GROUP_TYPE:"GroupType",
    OBS_TYPE:"ObsType",
    SERIES_TYPE:"SeriesType"
}

const SCHEMA_ELEMENT_FORMS = {
    UNQUALIFIED:"unqualified",
    QUAIFIED:"qualified"
}

module.exports.SCHEMA_ELEMENT_NAMES = Object.freeze(SCHEMA_ELEMENT_NAMES);
module.exports.SCHEMA_ELEMENT_REF = Object.freeze(SCHEMA_ELEMENT_REF);
module.exports.SCHEMA_ELEMENT_TYPES = Object.freeze(SCHEMA_ELEMENT_TYPES);
module.exports.SCHEMA_ELEMENT_FORMS = Object.freeze(SCHEMA_ELEMENT_FORMS);