const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;

class DataRequestPropsBuilder {
    
    static getFlow(testIdentifiers,template){

        if(template.agency && template.version){
            return (testIdentifiers.id)
        }
        else if (template.version){ 
            return (testIdentifiers.agency.concat(","+testIdentifiers.id))
        }
        else if (!template.agency && !template.id &&!template.version){
            return (testIdentifiers.agency.concat(","+testIdentifiers.id.concat(","+testIdentifiers.version)))
        }
        return;
    }

    static getKey(fullKey,template){
        if(!fullKey){return;}
        let fullKeyValues = Object.values(fullKey)
        if(template.key === DATA_QUERY_KEY.FULL_KEY){
            return fullKeyValues.join(".")
        }
        else if(template.key === DATA_QUERY_KEY.PARTIAL_KEY){
            let fullKeyValuesJoined= fullKeyValues.join(".")
            if(fullKeyValues.length === 2){return fullKeyValuesJoined.replace(fullKeyValues[1],".")}
            else if(fullKeyValues.length === 3){return fullKeyValuesJoined.replace(fullKeyValues[1],"")}
            return fullKeyValuesJoined.replace(fullKeyValues[2],"");

        }else if(template.key === DATA_QUERY_KEY.MANY_KEYS){
            let fullKeyValuesJoined= fullKeyValues.join(".")
            if(fullKeyValues.length === 2){return fullKeyValuesJoined.replace(fullKeyValues[0]+"."+fullKeyValues[1],fullKeyValues[0]+"+"+fullKeyValues[1])}
            else{return fullKeyValuesJoined.replace(fullKeyValues[1]+"."+fullKeyValues[2],fullKeyValues[1]+"+"+fullKeyValues[2])}
        }
    }

    static getProvider(providerRef,template){
        if(template.providerId && template.providerAgency) {
            return providerRef.agencyId+","+providerRef.identifiableIds[0]
        }else if(template.providerId && !template.providerAgency){
            return providerRef.identifiableIds[0]
        }
        return;


    }
}

module.exports = DataRequestPropsBuilder