const xml2js = require('xml2js');
const stripNamespaces = require('xml2js').processors.stripPrefix;
const validator = require('@authenio/xsd-schema-validator');
var SdmxObjectsFactory = require('sdmx-tck-api').model.SdmxObjectsFactory;
var SdmxV21JsonParser = require('./SdmxV21JsonParser.js');

class SdmxXmlParser {

    //Validates the an XSD string against the XMLSchema files
    schemaValidation(xsdMessage){
        return new Promise((resolve, reject) => {
            validator.validateXML(xsdMessage, 'schemas/XMLSchema.xsd', function (err, data) {    
                if (err !== null) {
                    reject("An error occurred during the XSD Validation.");
                }
                resolve(data);
            });
        });
        
    };
    
    // Validates the SDMX-ML message against the SDMX 2.0 schema files
    validate20(xmlMessage) {
        validator.validateXML(xmlMessage, 'schemas20/SDMXMessage.xsd', function (err, data) {
            if (err !== null) {
                throw new Error("An error occurred during the SDMX 2.0 schema validation.");
            }
            return data;
        });
    };

    // Validates the SDMX-ML message against the SDMX 2.1 schema files
    validate21(xmlMessage) {
        validator.validateXML(xmlMessage, 'schemas21/SDMXMessage.xsd', function (err, data) {
            if (err !== null) {
                throw new Error("An error occurred during the SDMX 2.1 schema validation.");
            }
            return data;
        });
    };

        getIMObjects(xmlMessage,apiVersion) {
        return new Promise((resolve, reject) => {
            var parserOptions = {
                explicitArray: true,
                explicitCharkey: true,
                tagNameProcessors: [stripNamespaces],
                attrkey: '$',   // prefix that is used to access the attributes. The default is '$'.
                charkey: '_'    // prefix that is used to access the character content. The default is  '_'.
            };
            xml2js.parseString(xmlMessage, parserOptions, function (err, result) {
                if (xmlMessage === null || xmlMessage === undefined) {
                    reject("XML cannot be parsed. A valid XML should be provided.");
                }
                if (err !== null) {
                    reject("An error occurred during the SDMX-ML parsing. " + err);
                }

                var sdmxObjects = SdmxV21JsonParser.parse(result,apiVersion);
                resolve(SdmxObjectsFactory.getWorkspace(sdmxObjects, result));
            });
        });
    };
};

module.exports = SdmxXmlParser;