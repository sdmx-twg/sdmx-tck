class SdmxV21DataGroup {

    static getGroupId(sdmxObjects){
        if(sdmxObjects.$){
            for (const [key, value] of Object.entries(sdmxObjects.$)) {
               if(key.indexOf("type")!==-1){return value.slice(value.indexOf(":")+1,value.length)}
            }
        }
        return;
    }

    static getGroupComponents(sdmxObjects){
        let attributes = {}
        if(sdmxObjects.$){
            for (const [key, value] of Object.entries(sdmxObjects.$)) {
               if(key.indexOf("type")===-1){
                   attributes[key]=value;
                }
            }
        }
        return attributes;
    }
}
module.exports = SdmxV21DataGroup;