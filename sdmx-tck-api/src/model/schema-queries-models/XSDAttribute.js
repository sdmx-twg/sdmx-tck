class XSDAttribute {
    constructor(props,type) {
       this.name = props.$.name;
       this.type = type;
       this.use = props.$.use;
       this.fixed = props.$.fixed;
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
};

module.exports = XSDAttribute;