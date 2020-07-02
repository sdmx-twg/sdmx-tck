var jsonPath = require('jsonpath');

var SdmxV21SchemaLocalOrReferenceElementParser = require('./SdmxV21SchemaLocalOrReferenceElementParser.js')
var XSDCompositor = require('sdmx-tck-api').model.XSDCompositor;
const COMPLEX_TYPES_COMPOSITORS_NAMES = require('sdmx-tck-api').constants.COMPLEX_TYPES_COMPOSITORS_NAMES;

class SdmxV21SchemaSequenceParser {
    /**
     * Return an array containing compositors(sequences & choices) of the given complexType.
     * @param {*} sdmxJsonObject 
     */
    static getCompositors(sdmxJsonObject) {
        let listOfCompositors = [];

        /*This parser parses compositors (sequences & choices) that are in the complexContent of a complexType.
        There are compositors that are directly inside the compexContent and others that are nested inside another compositor.
        The condition below serves both these cases. If the restriction obj is found it means that the complexContent is parsed, if not
        it means that the parser started to parse recursively for nested compositors, where there is no restriction object*/
        sdmxJsonObject =(jsonPath.query(sdmxJsonObject, '$..restriction').length>0) ? jsonPath.query(sdmxJsonObject, '$..restriction')[0][0]:sdmxJsonObject;
        
        let sequence = (jsonPath.query(sdmxJsonObject, '$.sequence').length>0) ? jsonPath.query(sdmxJsonObject, '$.sequence')[0]:undefined;
        let choice = (jsonPath.query(sdmxJsonObject, '$.choice').length>0)?jsonPath.query(sdmxJsonObject, '$.choice')[0]:undefined;

        if(sequence){
            for (let i in sequence) {
                listOfCompositors.push(new XSDCompositor(sequence[i],
                                    COMPLEX_TYPES_COMPOSITORS_NAMES.SEQUENCE,
                                    SdmxV21SchemaLocalOrReferenceElementParser.getElements(sequence[i]),
                                    this.getCompositors(sequence[i])))
            }
         }
         if(choice){
            for (let i in choice) {
                listOfCompositors.push((new XSDCompositor(choice[i],
                                    COMPLEX_TYPES_COMPOSITORS_NAMES.CHOICE,
                                    SdmxV21SchemaLocalOrReferenceElementParser.getElements(choice[i]),
                                    this.getCompositors(choice[i]))))
            }
         }
         return listOfCompositors;
    };
};

module.exports = SdmxV21SchemaSequenceParser;