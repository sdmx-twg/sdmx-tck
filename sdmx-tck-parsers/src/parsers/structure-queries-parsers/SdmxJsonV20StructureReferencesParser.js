var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var UrnUtil = require('sdmx-tck-api').utils.UrnUtil;
var jsonPath = require('jsonpath');

class SdmxJsonV20StructureReferencesParser {
    /**
     * Return an array containing references of the given SDMX object.
     * @param {*} sdmxJsonObject 
     */
    static getReferences(sdmxJsonObject, structureType) {
        let refs = [];
        if (structureType === SDMX_STRUCTURE_TYPE.CATEGORISATION.key) {
            SdmxJsonV20StructureReferencesParser.addCategorisationsRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.CODE_LIST.key) {
            SdmxJsonV20StructureReferencesParser.addCodelistRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.HIERARCHY.key) {
            SdmxJsonV20StructureReferencesParser.addHierarchyRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.HIERARCHY_ASSOCIATION.key) {
            SdmxJsonV20StructureReferencesParser.addHierarchyAssociationRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key) {
            SdmxJsonV20StructureReferencesParser.addConceptSchemeRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.DSD.key) {
            SdmxJsonV20StructureReferencesParser.addDsdRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.MSD.key) {
            SdmxJsonV20StructureReferencesParser.addMsdRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATAFLOW.key) {
            SdmxJsonV20StructureReferencesParser.addDataflowRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.METADATA_FLOW.key) {
            SdmxJsonV20StructureReferencesParser.addMetadataflowRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key) {
            SdmxJsonV20StructureReferencesParser.addProvisionAgreementRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.METADATA_PROVISION_AGREEMENT.key) {
            SdmxJsonV20StructureReferencesParser.addMetadataProvisionAgreementRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY.key) {
            SdmxJsonV20StructureReferencesParser.addReportingTaxonomyRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.PROCESS.key) {
            SdmxJsonV20StructureReferencesParser.addProcessRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATA_CONSTRAINT.key) {
            SdmxJsonV20StructureReferencesParser.addDataConstraintRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.METADATA_CONSTRAINT.key) {
            SdmxJsonV20StructureReferencesParser.addMetadataConstraintRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.STRUCTURE_MAP.key) {
            SdmxJsonV20StructureReferencesParser.addStructureMapRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.REPRESENTATION_MAP.key) {
            SdmxJsonV20StructureReferencesParser.addRepresentationMapRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME_MAP.key) {
            SdmxJsonV20StructureReferencesParser.addConceptSchemeMapRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME_MAP.key) {
            SdmxJsonV20StructureReferencesParser.addCategorySchemeMapRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.ORGANISATION_SCHEME_MAP.key) {
            SdmxJsonV20StructureReferencesParser.addOrganisationSchemeMapRefs(refs, sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY_MAP.key) {
            SdmxJsonV20StructureReferencesParser.addReportingTaxonomyMapRefs(refs, sdmxJsonObject);
        }
        return refs;
    };
    static getComponentRefs(sdmxJsonObject) {
        let refs = [];
        SdmxJsonV20StructureReferencesParser.addEnumerationRefs(refs, sdmxJsonObject);
        SdmxJsonV20StructureReferencesParser.addConceptIdentityRefs(refs, sdmxJsonObject);
        return refs;
    }
    static addCategorisationsRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.source));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.target));
    }
    static addCodelistRefs(refs, sdmxJsonObject) {
        let extensions = sdmxJsonObject.codelistExtensions;
        if (extensions) {
            for (let ext of extensions) {
                SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(ext.codelist));
                console.log(ext.codelist);
            }
        }
    }
    static addHierarchyRefs(refs, sdmxJsonObject) {
        let codeRefs = jsonPath.nodes(sdmxJsonObject, "$..['code']");
        for (let ref of codeRefs) {
            SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(ref.value));
        }
    }
    static addHierarchyAssociationRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.linkedHierarchy));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.linkedObject));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.contextObject));
    }
    static addConceptSchemeRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser.addEnumerationRefs(refs, sdmxJsonObject);
    }
    static addDsdRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser.addEnumerationRefs(refs, sdmxJsonObject);
        SdmxJsonV20StructureReferencesParser.addConceptIdentityRefs(refs, sdmxJsonObject);
    }
    static addMsdRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser.addEnumerationRefs(refs, sdmxJsonObject);
        SdmxJsonV20StructureReferencesParser.addConceptIdentityRefs(refs, sdmxJsonObject);
    }
    static addDataflowRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.structure));
    }
    static addMetadataflowRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.structure));
        let targets = sdmxJsonObject.targets;
        if (targets) {
            for (let urn of targets) {
                SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(urn));
            }
        }
    }
    static addProvisionAgreementRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.dataflow));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.dataProvider));
    }
    static addMetadataProvisionAgreementRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.metadataflow));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.metadataProvider));
        let targets = sdmxJsonObject.targets;
        if (targets) {
            for (let urn of targets) {
                SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(urn));
            }
        }
    }
    static addReportingTaxonomyRefs(refs, sdmxJsonObject) {
        let structuralArray = jsonPath.nodes(sdmxJsonObject, "$..['structuralMetadata']");
        for (let array of structuralArray) {
            for (let ref of array.value) {
                SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(ref));
            }
        }
        let provisioningArray = jsonPath.nodes(sdmxJsonObject, "$..['provisioningMetadata']");
        for (let array of provisioningArray) {
            for (let ref of array.value) {
                SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(ref));
            }
        }
    }
    static addProcessRefs(refs, sdmxJsonObject) {
        let objectRefs = jsonPath.nodes(sdmxJsonObject, "$..['objectReference']");
        for (let ref of objectRefs) {
            SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(ref.value));
        }
    }
    static addDataConstraintRefs(refs, sdmxJsonObject) {
        let attachments = sdmxJsonObject.constraintAttachment;
        if (attachments) {
            let provider = attachments.dataProvider;
            SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(provider));
            
            let dsds = attachments.dataStructures;
            if (dsds) {
                for (let urn of dsds) {
                    SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(urn));
                }
            }
            let dfs = attachments.dataflows;
            if (dfs) {
                for (let urn of dfs) {
                    SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(urn));
                }
            }
            let pras = attachments.provisionAgreements;
            if (pras) {
                for (let urn of pras) {
                    SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(urn));
                }
            }
        }
    }
    static addMetadataConstraintRefs(refs, sdmxJsonObject) {
        let attachments = sdmxJsonObject.constraintAttachment;
        if (attachments) {
            let provider = sdmxJsonObject.metadataProvider;
            SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(provider));
            
            let msds = attachments.metadataStructures;
            if (msds) {
                for (let urn of msds) {
                    SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(urn));
                }
            }
            let mdfs = attachments.metadataflows;
            if (mdfs) {
                for (let urn of mdfs) {
                    SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(urn));
                }
            }
            let mpras = attachments.metadataProvisionAgreements;
            if (mpras) {
                for (let urn of mpras) {
                    SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(urn));
                }
            }
        }
    }
    static addStructureMapRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.source));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.target));
    }
    static addRepresentationMapRefs(refs, sdmxJsonObject) {
        let sources = sdmxJsonObject.source;
        if (sources) {
            for (let src of sources) {
                SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(src.codelist));
            }
        }
        let targets = sdmxJsonObject.target;
        if (targets) {
            for (let trg of targets) {
                SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(trg.codelist));
            }
        }
    }
    static addConceptSchemeMapRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.source));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.target));
    }
    static addCategorySchemeMapRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.source));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.target));
    }
    static addOrganisationSchemeMapRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.source));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.target));
    }
    static addReportingTaxonomyMapRefs(refs, sdmxJsonObject) {
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.source));
        SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(sdmxJsonObject.target));
    }
    static addEnumerationRefs(refs, sdmxJsonObject) {
        let codelistRefs = jsonPath.nodes(sdmxJsonObject, "$..['enumeration']");
        for (let ref of codelistRefs) {
            SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(ref.value));
        }
    }
    static getConceptRefs(sdmxJsonObject) {
        let refs = [];
        SdmxJsonV20StructureReferencesParser.addEnumerationRefs(refs, sdmxJsonObject);
        return refs;
    }
    
    static addConceptIdentityRefs(refs, sdmxJsonObject) {
        let conceptRefs = jsonPath.nodes(sdmxJsonObject, "$..['conceptIdentity']");
        for (let ref of conceptRefs) {
            SdmxJsonV20StructureReferencesParser._addRef(refs, UrnUtil.getStructureReference(ref.value));
        }
    }
    static _addRef(refsArray, ref) {
        if (ref) {
            refsArray.push(ref);
        }
    }
};

module.exports = SdmxJsonV20StructureReferencesParser;