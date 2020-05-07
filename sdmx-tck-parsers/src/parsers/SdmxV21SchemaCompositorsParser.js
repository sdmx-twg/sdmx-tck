var jsonPath = require('jsonpath');

var SdmxV21SchemaLocalOrReferenceElementParser = require('./SdmxV21SchemaLocalOrReferenceElementParser.js')
var XSDCompositor = require('sdmx-tck-api').model.XSDCompositor;

class SdmxV21SchemaSequenceParser {
    /**
     * Return an array containing compositors(sequences & choices) of the given complexType.
     * @param {*} sdmxJsonObject 
     */
    static getCompositors(sdmxJsonObject) {
        let listOfSequences = [];
        let listOfChoices = [];
        let sequence = jsonPath.query(sdmxJsonObject, '$..sequence')[0];
        let choice = jsonPath.query(sdmxJsonObject, '$..choice')[0];
        if(sequence){
            for (let i in sequence) {
                let sequenceComponents = {} 
                console.log(sequence[i])
                if (sequence[i] && sequence[i].element) {
                    sequenceComponents["element"] = SdmxV21SchemaLocalOrReferenceElementParser.getElements(sdmxJsonObject)
                }
                if(sequence[i] && (sequence[i].choice || sequence[i].sequence)){
                    sequenceComponents["compositors"] = this.getCompositors(sequence[i])
                }

                listOfSequences.push(new XSDCompositor(sequence[i],"sequence",sequenceComponents["element"],sequenceComponents["compositors"]))
            }
         }
         if(choice){
            for (let i in choice) {
                let choiceComponents = {} 
                if (choice[i] && choice[i].element) {
                    choiceComponents["element"] = SdmxV21SchemaLocalOrReferenceElementParser.getElements(sdmxJsonObject)
                }
                if(choice[i] && (choice[i].choice || choice[i].sequence)){
                    choiceComponents["compositors"] = this.getCompositors(choice[i])
                }

                listOfChoices.push((new XSDCompositor(choice[i],"choice",choiceComponents["element"],choiceComponents["compositors"])))
            }
         }
         return listOfSequences.concat(listOfChoices);
    };
};

module.exports = SdmxV21SchemaSequenceParser;