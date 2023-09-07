
class ConstraintAnnotationObject {
    constructor(id,type,title){
        this.id = id;
        this.type = type;
        this.title = title
    }

    setId(id){
        this.id = id
    }
    getId(){
        return this.id
    }
    setType(type){
        this.type = type;
    }
    getType(){
        return this.type;
    }
    setTitle(title){
        this.title=title
    }
    getTitle(){
        return this.title
    }
}

module.exports = ConstraintAnnotationObject;