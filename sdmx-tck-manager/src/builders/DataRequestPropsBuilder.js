const DATA_QUERY_KEY = require('sdmx-tck-api').constants.DATA_QUERY_KEY;
const DIMENSION_AT_OBSERVATION_CONSTANTS = require('sdmx-tck-api').constants.DIMENSION_AT_OBSERVATION_CONSTANTS;
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
    static getComponent(randomKeys,template){
        if(!randomKeys){return;}
        if(template.component){
            let randIndex = Math.floor(Math.random() * Object.keys(randomKeys[0]).length)
            return Object.keys(randomKeys[0])[randIndex]
        }
        return;
    }
    static getKey(randomKeys,template){
        if(!randomKeys){return;}
        let fullKeyValues = Object.values(randomKeys[0])
        
        if(template.key === DATA_QUERY_KEY.FULL_KEY){
            return fullKeyValues.join(".")
        }
        else if(template.key === DATA_QUERY_KEY.PARTIAL_KEY){
            let fullKeyValuesJoined= fullKeyValues.join(".")
            if(fullKeyValues.length === 2){return fullKeyValuesJoined.replace(fullKeyValues[1],".")}
            else if(fullKeyValues.length === 3){return fullKeyValuesJoined.replace(fullKeyValues[1],"")}
            return fullKeyValuesJoined.replace(fullKeyValues[2],"");

        }else if(template.key === DATA_QUERY_KEY.MANY_KEYS){
            let assistiveFullKeyValues = Object.values(randomKeys[1])
            for(let i in fullKeyValues){
                if(fullKeyValues[i]!== assistiveFullKeyValues[i]){
                    fullKeyValues[i] = fullKeyValues[i].concat("+"+assistiveFullKeyValues[i])
                    break;
                }
            }
            return fullKeyValues.join(".")
        }
        return;
    }

    static getProvider(providerRefs,template){
        if(!template.provider){return;}
        if(providerRefs.length === 1){
            if(template.provider && template.provider.providerAgency &&  template.provider.providerId) {
                return providerRefs[0].agencyId+","+providerRefs[0].identifiableIds[0]
            }else if(template.provider && !template.provider.providerAgency &&  template.provider.providerId){
                return providerRefs[0].identifiableIds[0]
            }
        }else if(providerRefs.length ===2){
            return providerRefs[0].identifiableIds[0]+","+providerRefs[1].identifiableIds[0]
        }
        
        return;
    }

    static getStartPeriod(indicativeSeries,template){
        if(!template.startPeriod){return;}
        if(typeof template.startPeriod === "string"){return template.startPeriod}
        let observations = indicativeSeries.getObservations()
        if(observations.length ===1 || observations.length ===2 || observations.length ===3){
            return observations[0].getAttributes().TIME_PERIOD;
        }else{
            return observations[1].getAttributes().TIME_PERIOD
        }
    }

    static getEndPeriod(indicativeSeries,template){
        if(!template.endPeriod){return;}
        if(typeof template.endPeriod === "string"){return template.endPeriod}
        let observations = indicativeSeries.getObservations()
        if(observations.length ===1){
            return observations[0].getAttributes().TIME_PERIOD;
        }else if(observations.length === 2 || observations.length === 3){
            return observations[observations.length-1].getAttributes().TIME_PERIOD
        }else{
            return observations[observations.length-2].getAttributes().TIME_PERIOD
        }
    }

    static getNumberOfObs(indicativeSeries,template){
        let observations = indicativeSeries.getObservations()
        if(observations.length ===1 || observations.length ===2 ){
            return observations.length;
        }else if(observations.length ===3){
            return observations.length-1;
        }else{
            return 3;
        }
    }

    static getNumOfFirstNObservations(indicativeSeries,template){
        if(!template.firstNObservations){return;}
        return this.getNumberOfObs(indicativeSeries,template)
    }

    static getNumOfLastNObservations(indicativeSeries,template){
        if(!template.lastNObservations){return;}
        if(template.startPeriod && template.endPeriod && template.lastNObservations){
            indicativeSeries.setObservations(indicativeSeries.getObservationsBetweenPeriod(this.getStartPeriod(indicativeSeries,template),this.getEndPeriod(indicativeSeries,template)))
        }
        return this.getNumberOfObs(indicativeSeries,template)
    }
    static getUpdateAfterDate(indicativeSeries,template){
        if(!template.updateAfter){return;}
        let observations = indicativeSeries.getObservations();
        let randomIndex = Math.floor(Math.random() * observations.length);
        return observations[randomIndex].getAttributes().TIME_PERIOD;
    }

    static getObsDimension(dsdObj,template){
        if(!template.dimensionAtObservation || template.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.NOT_PROVIDED){return;}
        if(template.dimensionAtObservation === DIMENSION_AT_OBSERVATION_CONSTANTS.DIMENSION){
            return dsdObj.getRandomDimension().getId()
        }
        return template.dimensionAtObservation;
    }
}

module.exports = DataRequestPropsBuilder