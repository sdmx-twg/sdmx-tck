class XSDReferenceElement {
    constructor(props) {
       this.ref = props.$.ref;
       this.minOccurs = props.$.minOccurs;
       this.maxOccurs = props.$.maxOccurs
    };
        
    setRef(ref){
        this.ref = ref;
    }
    getRef(){
        return this.ref;
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

module.exports = XSDReferenceElement;