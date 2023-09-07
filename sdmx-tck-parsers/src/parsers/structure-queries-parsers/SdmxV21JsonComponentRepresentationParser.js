var jsonPath = require('jsonpath');
var ComponentRepresentationObject = require('sdmx-tck-api').model.ComponentRepresentationObject;
const COMPONENTS_REPRESENTATION_NAMES = require('sdmx-tck-api').constants.COMPONENTS_REPRESENTATION_NAMES;
class SdmxV21JsonComponentRepresentationParser {
    /**
     * Returns the representation of a component.
     * @param {*} sdmxJsonObject 
     */
    static getRepresentation(sdmxJsonObject) {
        
        let representation;
        let textFormat = jsonPath.query(sdmxJsonObject, '$..TextFormat')[0];
        let enumFormat = jsonPath.query(sdmxJsonObject,'$..EnumerationFormat')[0];
        
        if(enumFormat){
            if(enumFormat[0] && enumFormat[0].$) {
                return new ComponentRepresentationObject(enumFormat[0],COMPONENTS_REPRESENTATION_NAMES.ENUMERATION_FORMAT)
            }
        }
        if(textFormat){
            if (textFormat[0] && textFormat[0].$) {
                return new ComponentRepresentationObject(textFormat[0],COMPONENTS_REPRESENTATION_NAMES.TEXT_FORMAT)
            }
        }
        return representation;
    };
};

module.exports = SdmxV21JsonComponentRepresentationParser;