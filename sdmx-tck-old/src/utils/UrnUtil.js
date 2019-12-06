class UrnUtil { 
    /**
     * Returns the Artefact Type from its URN.
     */
    static getIdentifiableType = function (urn) {
        if (urn === null || urn === undefined) {
            return null;
        }
        return urn.slice(urn.indexOf('.', 29) + 1, urn.indexOf('='));
    }
};

export default UrnUtil;