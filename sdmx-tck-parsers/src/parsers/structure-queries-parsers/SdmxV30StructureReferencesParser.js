var jsonPath = require('jsonpath');

const SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var StructureReference = require('sdmx-tck-api').model.StructureReference;
var UrnUtil = require('sdmx-tck-api').utils.UrnUtil;

class SdmxV30StructureReferencesParser {
    /**
     * Return an array containing references of the given SDMX object.
     * @param {*} sdmxJsonObject 
     */
    static getReferences(sdmxJsonObject) {
        let structureReferences = [];
        let references = jsonPath.nodes(sdmxJsonObject, "$..['_']");
        for (let i in references) {
            if (references[i] && references[i].value && references[i].value.startsWith('urn:sdmx:org.sdmx.infomodel')) {
                try {
                    let nodeValue = references[i].value;
                    let nodePath = references[i].path;
                    // skip subelements of Annotations, Name, Description from urn parsing because they cannot contain any reference to artefacts
                    if (nodePath.length > 1 && (nodePath[1] === 'Annotations' || nodePath[1] === 'Name' || nodePath[1] === 'Description')) { continue; }
                    let structureRef = SdmxV30StructureReferencesParser.getStructureReference(nodeValue);
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

    static getStructureReference(urn) {
        let structureType = UrnUtil._getIdentifiableType(urn);
        // we don't validate the URN
        let components = UrnUtil.getUrnComponents(urn);
        let agencyId = components[0];
        let maintainableId = components[1];
        // NOTE: The version number can be null in SDMX 3. It no longer defaults to 1.0 if not explicitly set
        let version = UrnUtil.getVersionFromUrn(urn);

        if (SDMX_STRUCTURE_TYPE.isMaintainable(structureType)) {
            return new StructureReference(structureType, agencyId, maintainableId, version);
        } else {
            let parentStructureType = SDMX_STRUCTURE_TYPE.getMaintainableStructureTypeByClass(UrnUtil.getUrnClass(urn));
            let identfiableIds = components.slice(2, components.length);
            return new StructureReference(parentStructureType, agencyId, maintainableId, version, identfiableIds);
        }
    };
};

module.exports = SdmxV30StructureReferencesParser;