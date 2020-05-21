var jsonPath = require('jsonpath');
const SCHEMA_FACETS = require('sdmx-tck-api').constants.SCHEMA_FACETS;
var XSDFacet = require('sdmx-tck-api').model.XSDFacet;
class SdmxV21SchemaFacetsParser {
    /**
     * Return an array containing facets of the given simpleType.
     * @param {*} sdmxJsonObject 
     */
    static getFacets(sdmxJsonObject) {
        
        for (const property in SCHEMA_FACETS) {
            let facet = jsonPath.query(sdmxJsonObject, '$..'.concat(SCHEMA_FACETS[property].value))[0];
            if(facet){
                if (facet[0] && facet[0].$ && facet[0].$.value) {
                    return new XSDFacet(facet[0],SCHEMA_FACETS[property].value) 
                }
            }
        }
    };
};

module.exports = SdmxV21SchemaFacetsParser;