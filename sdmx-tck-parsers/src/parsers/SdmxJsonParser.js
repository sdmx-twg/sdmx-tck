var SdmxParserFactory = require('./SdmxParserFactory.js');

class SdmxJsonParser {
    getIMObjects(sdmxMessage, format) {
        return new Promise((resolve, reject) => {
            let jsonMessage = JSON.parse(sdmxMessage);
            var workspace = new SdmxParserFactory().getParser(jsonMessage, format).parseMessage(jsonMessage);
            resolve(workspace);
        });
    };
};

module.exports = SdmxJsonParser;