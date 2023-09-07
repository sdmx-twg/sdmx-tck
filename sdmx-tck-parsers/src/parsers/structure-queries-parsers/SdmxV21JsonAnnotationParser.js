var jsonPath = require('jsonpath');
var ConstraintAnnotationObject = require('sdmx-tck-api').model.ConstraintAnnotationObject;
class SdmxV21JsonAnnotationParser {

    static getAnnotations (sdmxJsonObject){
        let annotationsArr = [];
        let annotations = jsonPath.query(sdmxJsonObject, '$..Annotation')[0];
        if(annotations){
            for (let i in annotations) {
                let id  = (annotations[i].$ && annotations[i].$.id)?annotations[i].$.id:undefined
                let type = (annotations[i].AnnotationType)?annotations[i].AnnotationType[0]._:undefined
                let title = (annotations[i].AnnotationTitle)?annotations[i].AnnotationTitle[0]._:undefined
                if(annotations[i].$ && annotations[i].$.id ){
                    annotationsArr.push(new ConstraintAnnotationObject(id,type,title))
                }
                
            }
        }
        return annotationsArr;
    }
}

module.exports = SdmxV21JsonAnnotationParser;