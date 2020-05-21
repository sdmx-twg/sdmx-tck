class DataStructureComponentRepresentationObject {
    constructor(props,type){
        this.type = type,
        this.minLength = props.$.minLength,
        this.maxLength = props.$.maxLength,
        this.textType = props.$.textType
    }

    setType(type){
        this.type = type;
    }
    getType(){
        return this.type;
    }
    setMinLength(minLength){
        this.minLength = minLength;
    }
    getMinLength(){
        return this.minLength;
    }
    setMaxLength(maxLength){
        this.maxLength = maxLength;
    }
    getMaxLength(){
        return this.maxLength;
    }
    setTextType(textType){
        this.textType = textType;
    }
    getTextType(){
        return this.textType;
    }
}
module.exports = DataStructureComponentRepresentationObject