class XSDAttribute {
    constructor(props,type,simpleType) {
       this.name = props.$.name;
       this.type = type;
       this.use = props.$.use;
       this.fixed = props.$.fixed;
       this.simpleType = simpleType;
    };
    
    setName(name){
        this.name = name;
    }
    getName(){
        return this.name;
    }
    setType(type){
        this.type = type;
    }
    getType(){
        return this.type;
    }
    setUse(use){
        this.use = use;
    }
    getUse(){
        return this.use;
    }
    setFixed(fixed){
        this.fixed = fixed
    }
    getFixed(){
        return this.fixed;
    }
    setSimpleType(simpleType){
        this.simpleType = simpleType;
    }
    getSimpleType(){
        return this.simpleType;
    }
};

module.exports = XSDAttribute;