var jsonPath = require('jsonpath');

const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var StructureReference = require('sdmx-tck-api').model.StructureReference;

class SdmxV21StructureReferencesParser {
    /**
     * Return an array containing references of the given SDMX object.
     * @param {*} sdmxJsonObject 
     */
    static getReferences(sdmxJsonObject) {
        let structureReferences = [];
        let paths  = jsonPath.paths(sdmxJsonObject,'$..Ref')
        let references = jsonPath.query(sdmxJsonObject, '$..Ref');        
        for (let i in references) {
            if (references[i] && references[i][0] && references[i][0].$) {
                try {
                    let structureRef = SdmxV21StructureReferencesParser.getStructureReference(references[i][0].$,paths[i]);
                    // checks if the reference already exists in the returned references.
                    let existingRef = structureReferences.find(function (ref) { return ref.equals(structureRef) });
                    if (existingRef) {
                        existingRef.addIdentifiableIds(structureRef.getIdentifiableIds());
                    } else {
                        structureReferences.push(structureRef);
                    }
                } catch (ex) {
                    //console.log("Structure reference cannot be extracted. Cause: " + ex + JSON.stringify(references[i]));
                }
            }
        }
        return structureReferences;
    };
    //TODO:Original func. Check the other one.
    // static getStructureReference(ref) {
    //     let structureType = SDMX_STRUCTURE_TYPE.getStructureTypeByClass(ref.class);
    //     if (SDMX_STRUCTURE_TYPE.isMaintainable(structureType)) {
    //         return new StructureReference(structureType, ref.agencyID, ref.id, ref.version);
    //     } else {
    //         let parentStructureType = SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass(ref.class);
    //         return new StructureReference(parentStructureType, ref.agencyID, ref.maintainableParentID, ref.maintainableParentVersion, [ref.id]);
    //     }
    // };

    static getStructureReference(ref,paths) {

        let urnClass = ref.class;
       
        if(!ref.class){
            let pathString =  paths.toString().replace('$,','').replace(new RegExp("[,][0-9][,]", "g"),'/')
            let parentNode = paths[paths.length - 3]
            urnClass = parentNode;
            let structureType;
            if(SDMX_STRUCTURE_TYPE.matchPathToMaintainable(pathString)){
                structureType = SDMX_STRUCTURE_TYPE.matchPathToMaintainable(pathString);
            }else if(SDMX_STRUCTURE_TYPE.getStructureTypeByClass(urnClass)){
                structureType = SDMX_STRUCTURE_TYPE.getStructureTypeByClass(urnClass);
            }else if(SDMX_STRUCTURE_TYPE.matchXMLTagToMaintainable(urnClass)){
                structureType = SDMX_STRUCTURE_TYPE.matchXMLTagToMaintainable(urnClass);
            }else{
                structureType = SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass(urnClass)
            }
            if(ref.maintainableParentID){
                let maintainableParentVersion = (ref.maintainableParentVersion)?ref.maintainableParentVersion:"1.0"
                return new StructureReference(structureType, ref.agencyID, ref.maintainableParentID, maintainableParentVersion, [ref.id]);
            }else{  
                let version = (ref.version)?ref.version:"1.0"
                return new StructureReference(structureType, ref.agencyID, ref.id, version);
            }
        }else{
            let structureType = SDMX_STRUCTURE_TYPE.getStructureTypeByClass(urnClass);
            if (SDMX_STRUCTURE_TYPE.isMaintainable(structureType)) {
                let version = (ref.version)?ref.version:"1.0"
                return new StructureReference(structureType, ref.agencyID, ref.id, version);
            }else {
                let parentStructureType = SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass(urnClass);
                let maintainableParentVersion = (ref.maintainableParentVersion)?ref.maintainableParentVersion:"1.0"
                return new StructureReference(parentStructureType, ref.agencyID, ref.maintainableParentID, maintainableParentVersion, [ref.id]);
            }
        }      
    };
};

module.exports = SdmxV21StructureReferencesParser;