class XSDCompositor {
    constructor(props,type,elements,compositors) {
       this.minOccurs = (props.$)?props.$.minOccurs:undefined;
       this.maxOccurs = (props.$)?props.$.maxOccurs:undefined
       this.type = type;
       this.elements = elements;
       this.compositors = compositors 
    };

    setType(type){
        this.type = type;
    }
    getType(){
        return this.type;
    }
    setElements(elements){
        this.elements = elements
    }
    getElements(){
        return this.elements;
    }
    setCompositors(compositors){
        this.compositors = compositors
    }
    getCompositors(){
        return this.compositors;
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

module.exports = XSDCompositor;