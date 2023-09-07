class XSDGlobalElement {
    constructor(props) {
       this.name = props.$.name;
       this.type = props.$.type;
       this.substitutionGroup = props.$.substitutionGroup;
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
    setSubstitutionGroup(substitutionGroup){
        this.substitutionGroup = substitutionGroup;
    }
    getSubstitutionGroup(){
        return this.substitutionGroup;
    }
};

module.exports = XSDGlobalElement;