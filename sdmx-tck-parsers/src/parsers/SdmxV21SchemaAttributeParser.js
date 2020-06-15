var jsonPath = require('jsonpath');
var XSDAttribute = require('sdmx-tck-api').model.XSDAttribute;
var XSDAnyAttribute = require('sdmx-tck-api').model.XSDAnyAttribute;
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

    /**
     * Return an array containing the anyAttributes of complexContent.
     * @param {*} sdmxJsonObject 
     */
    static getAnyAttributes(sdmxJsonObject) {
        
        let listOfAnyAttributes = [];
        let anyAttribute = jsonPath.query(sdmxJsonObject, '$..anyAttribute')[0];
        if(anyAttribute){
            for (let i in anyAttribute) {
                if (anyAttribute[i] && anyAttribute[i].$) {
                    console.log(anyAttribute[i])
                   try {
                    listOfAnyAttributes.push(new XSDAnyAttribute(anyAttribute[i]))
                   } catch (ex) {
                   }
                }
           }
        }
        return listOfAnyAttributes;
    };
};

module.exports = SdmxV21SchemaAttributeParser;