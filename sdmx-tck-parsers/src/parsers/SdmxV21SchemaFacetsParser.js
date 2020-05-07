var jsonPath = require('jsonpath');
const SCHEMA_FACETS = require('sdmx-tck-api').constants.SCHEMA_FACETS;

class SdmxV21SchemaFacetsParser {
    /**
     * Return an array containing facets of the given simpleType.
     * @param {*} sdmxJsonObject 
     */
    static getFacets(sdmxJsonObject) {
        
        let listOfFacets = [];
        for (const property in SCHEMA_FACETS) {
            let facet = jsonPath.query(sdmxJsonObject, '$..'.concat(SCHEMA_FACETS[property].value))[0];
            if(facet){
                for (let i in facet) {
                    if (facet[i] && facet[i].$ && facet[i].$.value) {
                       try {
                        listOfFacets.push({facet:SCHEMA_FACETS[property].value,value:facet[i].$.value})
                       } catch (ex) {
                       }
                    }
               }
            }
        }
        return listOfFacets;
    };
};

module.exports = SdmxV21SchemaFacetsParser;