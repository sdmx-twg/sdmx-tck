class SdmxV21SeriesAttributesParser {

    static getAttributes(sdmxObjects){
        if(sdmxObjects.$){
            let attributesObj = sdmxObjects.$
            return attributesObj;
        }
        return;
    }
}
module.exports = SdmxV21SeriesAttributesParser;