var isDefined = require('../utils/Utils').isDefined;

class XSDLocalElement {
    constructor(props) {
       this.name = props.$.name;
       this.type = props.$.type;
       this.form = props.$.form;
       this.minOccurs = props.$.minOccurs;
       this.maxOccurs = props.$.maxOccurs
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
    setForm(form){
        this.form = form;
    }
    getForm(){
        return this.form
    }
    setMinOccurs(minOccurs){
        this.minOccurs = minOccurs
    }
    getMinOccurs(){
        return this.minOccurs
    }
    setMaxOccurs(maxOccurs){
        this.maxOccurs = maxOccurs
    }
    getMaxOccurs(){
        return this.maxOccurs
    }

    
};

module.exports = XSDLocalElement;