var SdmxXmlParser = require('./SdmxXmlParser.js');
var SdmxJsonParser = require('./SdmxJsonParser.js');
var SDMX_MESSAGE_FORMAT = require('sdmx-tck-api').constants.SDMX_MESSAGE_FORMAT;

class SdmxParser {
    getIMObjects(sdmxMessage, format) {
        if (SDMX_MESSAGE_FORMAT.isXML(format)) {
            return new SdmxXmlParser().getIMObjects(sdmxMessage, format);
        } else if (SDMX_MESSAGE_FORMAT.isJSON(format)) {
            return new SdmxJsonParser().getIMObjects(sdmxMessage, format);
        }
    };
};

module.exports = SdmxParser;