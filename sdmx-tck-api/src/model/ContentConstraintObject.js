var MaintainableObject = require('./MaintainableObject.js');
const SDMX_STRUCTURE_TYPE = require('../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
var CubeRegionObject = require('./CubeRegionObject.js')
var DataKeySetObject = require('./DataKeySetObject.js');
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

    findMatchingKeyValueInDSD(dsdObj){
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
                            keyValue.source = constraintComponents[0].constructor.name.toString();
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
                        let keyValues = keys[j].keyValues;
                        if(keyValues && Array.isArray(keyValues)){
                            for(let k = 0;k<keyValues.length;k++){
                                let keyValue = keyValues[k];
                                let keyValFound = dsdObj.componentExistsAndItsCodedInDSD(keyValue.id)
                                if(keyValFound && keyValue.value){
                                    keyValue.source = constraintComponents[0].constructor.name.toString();
                                    keyValue.isWildCarded = this.isKeyValueWildCarded(constraintComponents,keyValue.id);
                                    return this.getValuesFromKeyValuesWithSameId(constraintComponents,keyValue);;
                                }
                            }
                        }
                    }
                }
            }
            
        }
        return {};
    }

    isKeyValueWildCarded(constraintComponents,keyValueId){
       
        for(let i=0;i<constraintComponents.length;i++){
            let keys = constraintComponents[i].getKeys();
                if(keys && Array.isArray(keys)){
                    for(let j=0;j<keys.length;j++){
                        let found = false;
                        let keyValues = keys[j].keyValues;
                        if(keyValues && Array.isArray(keyValues)){
                            for(let k = 0;k<keyValues.length;k++){
                                if(keyValues[k].id === keyValueId){
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
    getValuesFromKeyValuesWithSameId(constraintComponents,keyValue){
        let keyValArr = [];
        let values = [];
        constraintComponents.forEach(constraintComponent => {
            keyValArr = keyValArr.concat(constraintComponent.getSameIdKeyValues(keyValue.id));
        });
        keyValArr.forEach(keyVal => {
            //no duplicates
            if(!(values.some(element => (element.includeType === keyVal.includeType && element.value === keyVal.value)))){
                values.push({value:keyVal.value, includeType:keyVal.includeType})
            }
        })
        return {id:keyValue.id,
                values:values,
                source:keyValue.source,
                isWildCarded:keyValue.isWildCarded}
    }
    // getAllSameIdKeyValues(selectedkeyValue){
    //     let sumOfKeyValues = [];
    //     //Collect all KeyValues with the same id from cube regions
    //     for(let i=0;i<this.cubeRegions.length;i++){
    //         let keyValuesWithSameId = this.cubeRegions[i].getKeyValuesWithSpecificId(selectedkeyValue.id)
    //         keyValuesWithSameId.forEach(function(keyvalue) {
    //             sumOfKeyValues.push(keyvalue)
    //         });
    //     }
    //     return sumOfKeyValues;
    // }

};

module.exports = ContentConstraintObject;