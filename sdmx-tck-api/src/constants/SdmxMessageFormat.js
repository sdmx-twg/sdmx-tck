var SDMX_MESSAGE_FORMAT = {
    XML_V21: { key: "XML_V21"},
    XML_V300: { key: "XML_V300"},
    JSON_V200: { key: "JSON_V200"}
};

SDMX_MESSAGE_FORMAT.isXML = function (format) {
    if (format === SDMX_MESSAGE_FORMAT.XML_V21.key ||
        format === SDMX_MESSAGE_FORMAT.XML_V300.key) {
        return true;
    }
    return false;
};
SDMX_MESSAGE_FORMAT.isJSON = function (format) {
    if (format === SDMX_MESSAGE_FORMAT.JSON_V200.key) {
        return true;
    }
    return false;
};
module.exports.SDMX_MESSAGE_FORMAT = Object.freeze(SDMX_MESSAGE_FORMAT);