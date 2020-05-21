var jsonPath = require('jsonpath');
var DataStructureComponentRepresentationObject = require('sdmx-tck-api').model.DataStructureComponentRepresentationObject;
const DSD_COMPONENTS_REPRESENTATION_NAMES = require('sdmx-tck-api').constants.DSD_COMPONENTS_REPRESENTATION_NAMES;
class SdmxV21JsonDsdComponentRepresentationParser {
    /**
     * Return an array containing enumerations of the given simpleType.
     * @param {*} sdmxJsonObject 
     */
    static getRepresentation(sdmxJsonObject) {
        
        let representation;
        let textFormat = jsonPath.query(sdmxJsonObject, '$..TextFormat')[0];
        let enumFormat = jsonPath.query(sdmxJsonObject,'$..EnumerationFormat')[0];
        
        if(enumFormat){
            if(enumFormat[0] && enumFormat[0].$) {
                return new DataStructureComponentRepresentationObject(enumFormat[0],DSD_COMPONENTS_REPRESENTATION_NAMES.ENUMERATION_FORMAT)
            }
        }
        if(textFormat){
            if (textFormat[0] && textFormat[0].$) {
                return new DataStructureComponentRepresentationObject(textFormat[0],DSD_COMPONENTS_REPRESENTATION_NAMES.TEXT_FORMAT)
            }
        }
        return representation;
    };
};

module.exports = SdmxV21JsonDsdComponentRepresentationParser;