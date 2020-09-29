const SCHEMA_FACETS = {
    MIN_LENGTH:{value:"minLength",SDMXFacet:"minLength"},
    MAX_LENGTH:{value:"maxLength",SDMXFacet:"maxLength"},
    MIN_EXCLUSIVES:{value:"minExclusives",SDMXFacet:"minValue"},
    MIN_INCLUSIVE:{value:"minInclusive",SDMXFacet:"minValue"},
    MAX_EXCLUSIVES:{value:"maxExclusives",SDMXFacet:"maxValue"},
    MAX_INCLUSIVE:{value:"maxInclusive",SDMXFacet:"maxValue"},
    FRACTION_DIGITS:{value:"fractionDigits",SDMXFacet:"decimals"},
    PATTERN:{value:"pattern",SDMXFacet:"pattern"},
};

module.exports.SCHEMA_FACETS = Object.freeze(SCHEMA_FACETS);