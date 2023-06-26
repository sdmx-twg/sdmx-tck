class XSDAnyAttribute {
    constructor(props) {
       this.namespace = props.$.namespace;
    };
    
    setNamespace(namespace){
        this.namespace = namespace;
    }
    getNamespace(){
        return this.namespace;
    }
};

module.exports = XSDAnyAttribute;