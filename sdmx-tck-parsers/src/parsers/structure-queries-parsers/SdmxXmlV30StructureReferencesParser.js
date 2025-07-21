var jsonPath = require('jsonpath');

var UrnUtil = require('sdmx-tck-api').utils.UrnUtil;

class SdmxXmlV30StructureReferencesParser {
    /**
     * Return an array containing references of the given SDMX object.
     * @param {*} sdmxJsonObject 
     */
    static getReferences(sdmxJsonObject) {
        let structureReferences = [];
        let references = jsonPath.nodes(sdmxJsonObject, "$..['_']");
        for (let i in references) {
            if (references[i] && references[i].value && references[i].value.startsWith('urn:sdmx:org.sdmx.infomodel')) {
                let nodeValue = references[i].value;
                let nodePath = references[i].path;
                try {    
                    // skip subelements of Annotations, Name, Description from urn parsing because they cannot contain any reference to artefacts
                    if (nodePath.length > 1 && (nodePath[1] === 'Annotations' || nodePath[1] === 'Name' || nodePath[1] === 'Description')) { continue; }
                    let structureRef = UrnUtil.getStructureReference(nodeValue);
                    // checks if the reference already exists in the returned references.
                    let existingRef = structureReferences.find(function (ref) { return ref.equals(structureRef) });
                    if (existingRef) {
                        existingRef.addIdentifiableIds(structureRef.getIdentifiableIds());
                    } else {
                        structureReferences.push(structureRef);
                    }
                } catch (ex) {
                    console.log("Structure reference cannot be extracted. Cause: " + ex + JSON.stringify(nodeValue));
                }
            }
        }
        return structureReferences;
    };
};

module.exports = SdmxXmlV30StructureReferencesParser;