var jsonPath = require('jsonpath');
var XSDAttribute = require('sdmx-tck-api').model.XSDAttribute;
class SdmxV21SchemaAttributeParser {
    /**
     * Return an array containing the attributes of complexContent.
     * @param {*} sdmxJsonObject 
     */
    static getAttributes(sdmxJsonObject) {
        
        let listOfAttributes = [];
        let attribute = jsonPath.query(sdmxJsonObject, '$..attribute')[0];
        if(attribute){
            for (let i in attribute) {
                if (attribute[i] && attribute[i].$) {
                   try {
                    listOfAttributes.push(new XSDAttribute(attribute[i]))
                   } catch (ex) {
                   }
                }
           }
        }
        return listOfAttributes;
    };
};

module.exports = SdmxV21SchemaAttributeParser;