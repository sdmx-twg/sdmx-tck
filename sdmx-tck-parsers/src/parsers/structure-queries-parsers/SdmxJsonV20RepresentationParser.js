var jsonPath = require('jsonpath');
var ComponentRepresentationObject = require('sdmx-tck-api').model.ComponentRepresentationObject;
const COMPONENTS_REPRESENTATION_NAMES = require('sdmx-tck-api').constants.COMPONENTS_REPRESENTATION_NAMES;

class SdmxJsonV20RepresentationParser {
    /**
     * Returns the representation of a component.
     * @param {*} sdmxJsonObject 
     */
    static getRepresentation(sdmxJsonObject) {
        let representation;
        let textFormat = jsonPath.query(sdmxJsonObject, '$..format')[0];
        let enumFormat = jsonPath.query(sdmxJsonObject, '$..enumerationFormat')[0];

        if (enumFormat) {
            return new ComponentRepresentationObject(enumFormat, COMPONENTS_REPRESENTATION_NAMES.ENUMERATION_FORMAT)
        }
        if (textFormat) {
            return new ComponentRepresentationObject(textFormat, COMPONENTS_REPRESENTATION_NAMES.TEXT_FORMAT)
        }
        return representation;
    };
};
module.exports = SdmxJsonV20RepresentationParser;