var ItemObject = require('./ItemObject.js')
class CodeObject extends ItemObject {
    constructor(id,references,representation,urn,parentCode) {
        super(id,references,representation,urn);
        this.parentCode = parentCode;
    };
   
    setParentCode(parentCode){
        this.parentCode = parentCode;
    }
    getParentCode(){
        return this.parentCode
    }

};

module.exports = CodeObject;