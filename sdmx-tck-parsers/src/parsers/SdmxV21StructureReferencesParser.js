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
         let references = jsonPath.query(sdmxJsonObject, '$..Ref');        
        for (let i in references) {
            if (references[i] && references[i][0] && references[i][0].$) {
                try {
                    let structureRef = SdmxV21StructureReferencesParser.getStructureReference(references[i][0].$);
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
    static getStructureReference(ref) {
        let structureType = SDMX_STRUCTURE_TYPE.getStructureTypeByClass(ref.class);
        if (SDMX_STRUCTURE_TYPE.isMaintainable(structureType)) {
            return new StructureReference(structureType, ref.agencyID, ref.id, ref.version);
        } else {
            let parentStructureType = SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass(ref.class);
            return new StructureReference(parentStructureType, ref.agencyID, ref.maintainableParentID, ref.maintainableParentVersion, [ref.id]);
        }
    };
};

module.exports = SdmxV21StructureReferencesParser;