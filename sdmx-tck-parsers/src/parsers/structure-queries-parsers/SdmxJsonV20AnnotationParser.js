var AnnotationObject = require('sdmx-tck-api').model.AnnotationObject;

class SdmxJsonV20AnnotationParser {
    static getAnnotations(sdmxJsonObject) {
        let annotationsArr = [];
        let annotations = sdmxJsonObject.annotations;
        if (annotations) {
            for (let annot of annotations) {
                annotationsArr.push(new AnnotationObject(annot.id, annot.type, annot.title));
            }
        }
        return annotationsArr;
    }
}
module.exports = SdmxJsonV20AnnotationParser;