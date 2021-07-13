class ComponentRepresentationObject {
    constructor(props,type){
        this.type = type,
        this.minLength = props.$.minLength,
        this.maxLength = props.$.maxLength,
        this.minValue = props.$.minValue
        this.maxValue = props.$.maxValue,
        this.decimals = props.$.decimals,
        this.pattern = props.$.pattern,
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
    setMinValue(minValue){
        this.minValue = minValue
    }
    getMinValue(){
        return this.minValue
    }
    setMaxValue(maxValue){
        this.maxValue =maxValue
    }
    getMaxValue(){
        return this.maxValue;
    }
    setDecimals(decimals){
        this.decimals = decimals
    }
    getDecimals(){
        return this.decimals;
    }
    setPattern(pattern){
        this.pattern=pattern
    }
    getPattern(){
        return this.pattern;
    }
    setTextType(textType){
        this.textType = textType;
    }
    getTextType(){
        return this.textType;
    }

    equals(repObj){
        let isEqual = this.getDecimals() === repObj.getDecimals()
            && this.getMaxLength() === repObj.getMaxLength()
            && this.getMaxValue() === repObj.getMaxValue()
            && this.getMinLength() === repObj.getMinLength()
            && this.getMinValue() === repObj.getMinValue()
            && this.getPattern() === repObj.getPattern()
            && this.getTextType() === repObj.getTextType()
            && this.getType() === repObj.getType()

        return isEqual;
    }
}
module.exports = ComponentRepresentationObject