var isDefined = require('../utils/Utils').isDefined;

class XSDAttribute {
    constructor(props) {
       this.name = props.$.name;
       this.type = props.$.type;
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