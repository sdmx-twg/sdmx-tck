var MaintainableObject = require('./MaintainableObject.js');
const SDMX_STRUCTURE_TYPE = require('../../constants/SdmxStructureType.js').SDMX_STRUCTURE_TYPE;
var CubeRegionObject = require('./CubeRegionObject.js')
var DataKeySetObject = require('./DataKeySetObject.js');
var ConstraintKeyValueObject = require('./ConstraintKeyValueObject.js')
var ConstraintReferencePeriod = require('./ConstraintReferencePeriod.js')
var StructureReference = require('./StructureReference.js')
var ConstraintAnnotationObject = require('./ConstraintAnnotationObject.js')
var Utils = require('../../utils/Utils.js')


class ContentConstraintObject extends MaintainableObject {
    constructor(structureType, props, children, detail, cubeRegions, dataKeySets, referencePeriod, annotations) {
        super(structureType, props, children, detail);
        if (structureType === SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key) {
            this.setType(props.$.type);
        } else {
            this.setType(props.$.role); // changed in SDMX 3.0
        }
        this.setCubeRegions(cubeRegions);
        this.setDataKeySets(dataKeySets);
        this.setReferencePeriod(referencePeriod);
        this.setAnnotations(annotations);
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
    setReferencePeriod(referencePeriod){
        this.referencePeriod = referencePeriod
    }
    getReferencePeriod(){
        return this.referencePeriod;
    }
    setAnnotations(annotations){
        this.annotations = annotations;
    }
    getAnnotations(){
        return this.annotations
    }

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

    findKeyValueWithSpecificId(id){
        let constraintComponents = (this.getCubeRegions().length > 0) ? this.getCubeRegions():this.getDataKeySets()
        for(let i in constraintComponents){
            if(constraintComponents[i] instanceof CubeRegionObject){
                let found = constraintComponents[i].getKeyValues().find(keyValue => keyValue.id === id)
                if(found){
                    return found
                }
            }else if(constraintComponents[i] instanceof DataKeySetObject){
                let keyValueIndex;
                let found = constraintComponents[i].getKeys().find(function(key){
                    keyValueIndex = key.findIndex(keyValue => keyValue.getId() === id)
                    if(keyValueIndex!==-1){
                        return true;
                    }
                    return false;
                }); 
                if(found){
                    return found[keyValueIndex]
                }
            }
        }

        return;
    }
    static fromJSON(jsObj){
        if(jsObj.structureType !== SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key){
            throw new Error("Cannot create "+SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key+" object.")
        }
        let props = {
            $:{
                structureType:(jsObj.structureType)?jsObj.structureType:"",
                agencyID:(jsObj.agencyId)?jsObj.agencyId:"",
                id:(jsObj.id)?jsObj.id:"",
                version:(jsObj.version)?jsObj.version:"",
                urn:(jsObj.urn)?jsObj.urn:"",
                isFinal:(jsObj.isFinal)?jsObj.isFinal:"",
                isExternalReference:(jsObj.isExternalReference)?jsObj.isExternalReference:"",
                structureURL:(jsObj.structureURL)?jsObj.structureURL:"",
                type:(jsObj.type)?jsObj.type:""
            }
        }
        let children= (jsObj.children)?jsObj.children:[]
        let childrenArr = []
        children.forEach(child=>{
            childrenArr.push(new StructureReference(child.structureType,child.agencyId,child.id,child.version))
        })
        let detail = (jsObj.detail)?jsObj.detail:""

       
        let cubeRegions = (jsObj.cubeRegions)?jsObj.cubeRegions:[];

        let cubeRegionsArr = []
        cubeRegions.forEach(cubeRegion => {
            let keyValues = []
            cubeRegion.keyValue.forEach(keyValue => {
                keyValues.push(new ConstraintKeyValueObject({$:{id:keyValue.id}},CubeRegionObject.name,keyValue.includeType,keyValue.values))
            })
            cubeRegionsArr.push(new CubeRegionObject({$:{includeType:cubeRegion.includeType}},keyValues))
        })

        let dataKeySets = (jsObj.dataKeySets)?jsObj.dataKeySets:[];
        let dataKeySetsArr = []
        dataKeySets.forEach(dataKeySet => {
            let keys = []
            dataKeySet.keys.forEach(key => {
                let keyValues = []
                key.forEach(keyValue =>{
                    keyValues.push(new ConstraintKeyValueObject({$:{id:keyValue.id}},DataKeySetObject.name,keyValue.includeType,keyValue.values))
                })
                keys.push(keyValues);
            })
            dataKeySetsArr.push(new DataKeySetObject({$:{includeType:dataKeySet.includeType}},keys))
        })

        let referencePeriod = (jsObj.referencePeriod)?jsObj.referencePeriod:undefined
        if(referencePeriod){
            referencePeriod = new ConstraintReferencePeriod(referencePeriod.startTime,referencePeriod.endTime)
        }

        let annotations = (jsObj.annotations)?jsObj.annotations:[]
        let annotationsArr = []
        annotations.forEach(annotation =>{
            annotationsArr.push(new ConstraintAnnotationObject(annotation.id,annotation.type,annotation.title))
        });

        return new ContentConstraintObject (jsObj.structureType,props,childrenArr,detail,cubeRegionsArr,dataKeySetsArr,referencePeriod,annotationsArr)

    }
};

module.exports = ContentConstraintObject;