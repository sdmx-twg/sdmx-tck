var jsonPath = require('jsonpath');
var XSDLocalElement = require('sdmx-tck-api').model.XSDLocalElement;
var XSDReferenceElement = require('sdmx-tck-api').model.XSDReferenceElement;

class SdmxV21SchemaLocalOrReferenceElementParser {
    /**
     * Return an array of elements inside complexContent.
     * @param {*} sdmxJsonObject 
     */
    static getElements(sdmxJsonObject) {
        let elementComponents = []
        let element = (jsonPath.query(sdmxJsonObject, '$.element').length>0) ? jsonPath.query(sdmxJsonObject, '$.element')[0]:undefined
        if(element){
            for (let i in element) {
                if (element[i] && element[i].$) {
                    if(element[i].$.ref){
                        elementComponents.push(new XSDReferenceElement(element[i]))  
                    }else{
                        elementComponents.push(new XSDLocalElement(element[i]))
                    }
                }
            }
        }
        return elementComponents;
    };
};

module.exports = SdmxV21SchemaLocalOrReferenceElementParser;