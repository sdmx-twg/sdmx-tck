const ATTRIBUTE_RELATIONSHIP_NAMES = {
    DIMENSION:"Dimension",              // SDMX 2.1 & SDMX 3.0
    ATTACHMENT_GROUP:"AttachmentGroup", // SDMX 2.1
    GROUP:"Group",                      // SDMX 2.1 & SDMX 3.0
    PRIMARY_MEASURE:"PrimaryMeasure",   // SDMX 2.1
    NONE:"None",                        // SDMX 2.1

    DATAFLOW: "Dataflow",               // SDMX 3.0
    OBSERVATION:"Observation",          // SDMX 3.0
    MEASURE: "Measure"                  // SDMX 3.0 (for MeasureRelationship)
}

const ATTRIBUTE_ASSIGNMENT_STATUS = {
    MANDATORY:"Mandatory",
    CONDITIONAL:"Conditional",
}

const USAGE_TYPE = {
    MANDATORY: "mandatory",
    OPTIONAL: "optional",
    toAssignmentStatus: function (usage) {
        if (usage === USAGE_TYPE.MANDATORY) {
            return ATTRIBUTE_ASSIGNMENT_STATUS.MANDATORY;
        } else if (usage === USAGE_TYPE.OPTIONAL) {
            return ATTRIBUTE_ASSIGNMENT_STATUS.CONDITIONAL;
        }
        return undefined;
    }
}

const RELATIONSHIP_REF_ID = {
    GROUP:"Group"
}

const ATTRIBUTE_NAMES = {
    REPORTING_YEAR_START_DAY:"REPORTING_YEAR_START_DAY"
}

module.exports.ATTRIBUTE_RELATIONSHIP_NAMES = Object.freeze(ATTRIBUTE_RELATIONSHIP_NAMES);
module.exports.ATTRIBUTE_ASSIGNMENT_STATUS = Object.freeze(ATTRIBUTE_ASSIGNMENT_STATUS);
module.exports.USAGE_TYPE = Object.freeze(USAGE_TYPE);
module.exports.RELATIONSHIP_REF_ID = Object.freeze(RELATIONSHIP_REF_ID);
module.exports.ATTRIBUTE_NAMES = Object.freeze(ATTRIBUTE_NAMES);