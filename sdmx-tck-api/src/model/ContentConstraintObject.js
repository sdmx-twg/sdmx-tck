var MaintainableObject = require('./MaintainableObject.js');
const SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
var CubeRegionObject = require('./CubeRegionObject.js')
var DataKeySetObject = require('./DataKeySetObject.js');
var ConstraintKeyValueObject = require('./ConstraintKeyValueObject.js')

var Utils = require('../utils/Utils.js')


class ContentConstraintObject extends MaintainableObject {
    constructor(props, children, detail, cubeRegions, dataKeySets) {
        super(SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key, props, children, detail);
        this.setType(props.$.type);
        this.setCubeRegions(cubeRegions);
        this.setDataKeySets(dataKeySets);
    };
    setDataKeySets(dataKeySets){
        this.dataKeySets = dataKeySets;
    };
    getDataKeySets(){
        return this.dataKeySets;
    };

    setCubeRegions(cubeRegions){
        this.cubeRegions = cubeRegions;
    };
    getCubeRegions(){
        return this.cubeRegions;
    };
    setType(type) {
        this.type = type;
    };
    getType() {
        return this.type;
    };

    getMatchingKeyValueDataInDSD(dsdObj){
        let keyValue;
        let constraintComponents = (Utils.isDefined(this.cubeRegions) && Array.isArray(this.cubeRegions) && this.cubeRegions.length > 0) ? this.cubeRegions:this.dataKeySets;
        
        if (!Utils.isDefined(constraintComponents) || constraintComponents.length === 0) {
            throw new Error("Missing Constraint Components.");
        }
        if(constraintComponents[0] instanceof CubeRegionObject){
            for(let i=0;i<constraintComponents.length;i++){
                let keyValues = constraintComponents[i].getKeyValues();
                if (keyValues && Array.isArray(keyValues)){
                    for(let j=0;j<keyValues.length;j++){
                        keyValue = keyValues[j];
                        let keyValFound  = dsdObj.componentExistsAndItsCodedInDSD(keyValue.id)
                        if(keyValFound && keyValue.values && Array.isArray(keyValue.values) && keyValue.values.length>0){
                            return keyValue;
                        }
                    }
                }
                
            }
        }else if(constraintComponents[0] instanceof DataKeySetObject){
            for(let i=0;i<constraintComponents.length;i++){
                let keys = constraintComponents[i].getKeys();
                if(keys && Array.isArray(keys)){
                    for(let j=0;j<keys.length;j++){
                        let keyValues = keys[j];
                        if(keyValues && Array.isArray(keyValues)){
                            for(let k = 0;k<keyValues.length;k++){
                                let keyValue = keyValues[k];
                                let keyValFound = dsdObj.componentExistsAndItsCodedInDSD(keyValue.id)
                                if(keyValFound && keyValue.values){
                                    return keyValue;
                                }
                            }
                        }
                    }
                }
            }
            
        }
        return null;
    }

    isKeyValueWildCarded(keyValue){
       
        for(let i=0;i<this.dataKeySets.length;i++){
            let keys = this.dataKeySets[i].getKeys();
                if(keys && Array.isArray(keys)){
                    for(let j=0;j<keys.length;j++){
                        let found = false;
                        let keyValues = keys[j];
                        if(keyValues && Array.isArray(keyValues)){
                            for(let k = 0;k<keyValues.length;k++){
                                if(keyValues[k].id === keyValue.getId()){
                                    found = true;
                                }
                            }
                        }
                        if(!found){
                            return true;
                        }
                    }
                }
        }

        return false;
    }
    getValuesFromKeyValuesWithSameId(keyValue){
        let keyValArr = [];
        let values = [];
        this.dataKeySets.forEach(dataKeySet => {
            keyValArr = keyValArr.concat(dataKeySet.getSameIdKeyValues(keyValue.id));
        });
        keyValArr.forEach(keyVal => {
            //no duplicates
            if(!(values.some(element => (element.includeType === keyVal.includeType && element.value === keyVal.values)))){
                values.push({value:keyVal.values, includeType:keyVal.includeType})
            }
        })
        return values
    }
};

module.exports = ContentConstraintObject;