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
                    let type = (attribute[i].$.type)?attribute[i].$.type:(attribute[i].simpleType && attribute[i].simpleType[0].restriction && attribute[i].simpleType[0].restriction[0].$)?attribute[i].simpleType && attribute[i].simpleType[0].restriction && attribute[i].simpleType[0].restriction[0].$.base:undefined
                    listOfAttributes.push(new XSDAttribute(attribute[i],type))
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
                    listOfAnyAttributes.push(new XSDAnyAttribute(anyAttribute[i]))
                }
           }
        }
        return listOfAnyAttributes;
    };
};

module.exports = SdmxV21SchemaAttributeParser;