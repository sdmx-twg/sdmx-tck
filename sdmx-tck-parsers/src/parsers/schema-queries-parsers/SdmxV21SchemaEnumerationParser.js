var jsonPath = require('jsonpath');

class SdmxV21SchemaEnumerationParser {
    /**
     * Return an array containing enumerations of the given simpleType.
     * @param {*} sdmxJsonObject 
     */
    static getEnumerations(sdmxJsonObject) {
        
        let listOfEnumerations = [];
        let enumeration = jsonPath.query(sdmxJsonObject, '$..enumeration')[0];
        if(enumeration){
            for (let i in enumeration) {
                if (enumeration[i] && enumeration[i].$ && enumeration[i].$.value) {
                   try {
                    listOfEnumerations.push(enumeration[i].$.value)
                   } catch (ex) {
                   }
                }
           }
        }
        return listOfEnumerations;
    };
};

module.exports = SdmxV21SchemaEnumerationParser;