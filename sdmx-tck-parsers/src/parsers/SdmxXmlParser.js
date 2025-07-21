const xml2js = require('xml2js');
const stripNamespaces = require('xml2js').processors.stripPrefix;
var SdmxParserFactory = require('./SdmxParserFactory.js');

class SdmxXmlParser {
    getIMObjects(xmlMessage, format) {
        return new Promise((resolve, reject) => {
            var parserOptions = {
                explicitArray: true,
                explicitCharkey: true,
                tagNameProcessors: [stripNamespaces],
                attrkey: '$',   // prefix that is used to access the attributes. The default is '$'.
                charkey: '_'    // prefix that is used to access the character content. The default is  '_'.
            };
            xml2js.parseString(xmlMessage, parserOptions, (err, jsonMessage) => {
                if (xmlMessage === null || xmlMessage === undefined) {
                    reject("XML cannot be parsed. A valid XML should be provided.");
                    return;
                }
                if (err !== null) {
                    reject("An error occurred during the SDMX-ML parsing. " + err);
                    return;
                }
                var workspace = new SdmxParserFactory().getParser(jsonMessage, format).parseMessage(jsonMessage);
                resolve(workspace);
            });
        });
    };
};

module.exports = SdmxXmlParser;