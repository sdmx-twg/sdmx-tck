import { isDefined } from '../utils/Utils';
import SDMX_STRUCTURE_TYPE from '../constants/SdmxStructureType';
import StructureReference from '../model/StructureReference';

/**
 * @deprecated (NOT USED)
 */
class SdmxV21JsonChildrenParser {
    static getChildren(structureType, sdmxJsonObject) {
        if (!isDefined(structureType)) {
            throw new Error('Missing required paramter \'structureType\'');
        }
        if (structureType === SDMX_STRUCTURE_TYPE.AGENCY_SCHEME) {
            return SdmxV21JsonChildrenParser.getAgencySchemeChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.ATTACHMENT_CONSTRAINT) {
            return SdmxV21JsonChildrenParser.getAttachmentConstraintChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.CATEGORISATION) {
            return SdmxV21JsonChildrenParser.getCategorisationChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME) {
            return SdmxV21JsonChildrenParser.getCategorySchemeChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.CODE_LIST) {
            return SdmxV21JsonChildrenParser.getCodelistChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME) {
            return SdmxV21JsonChildrenParser.getConceptSchemeChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT) {
            return SdmxV21JsonChildrenParser.getContentConstraintChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME) {
            return SdmxV21JsonChildrenParser.getDataConsumerSchemeChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME) {
            return SdmxV21JsonChildrenParser.getDataProviderSchemeChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.DATAFLOW) {
            return SdmxV21JsonChildrenParser.getDataflowChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.DSD) {
            return SdmxV21JsonChildrenParser.getDataStructureChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.HIERARCHICAL_CODELIST) {
            return SdmxV21JsonChildrenParser.getHierarchicCodeList(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.METADATA_FLOW) {
            return SdmxV21JsonChildrenParser.getMetadataflowChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.MSD) {
            return SdmxV21JsonChildrenParser.getMetadataStructureChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.ORGANISATION_SCHEME) {
            return SdmxV21JsonChildrenParser.getOrganisationSchemeChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME) {
            return SdmxV21JsonChildrenParser.getOrganisationUnitSchemeChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.PROCESS) {
            return SdmxV21JsonChildrenParser.getProcessChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT) {
            return SdmxV21JsonChildrenParser.getProvisionAgreementChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY) {
            return SdmxV21JsonChildrenParser.getReportingTaxonomyChildren(sdmxJsonObject);
        } else if (structureType === SDMX_STRUCTURE_TYPE.STRUCTURE_SET) {
            return SdmxV21JsonChildrenParser.getStructureSetChildren(sdmxJsonObject);
        }
    };
    static getStructureReference(structureType, refJsonObject) {
        //TODO extract the structure type
        return new StructureReference(structureType, refJsonObject.agencyID, refJsonObject.id, refJsonObject.version);
    };
    static getConceptIdentityRef(conceptIdentity) {
        if (conceptIdentity && conceptIdentity[0] && conceptIdentity[0].Ref && conceptIdentity[0].Ref[0]) {
            let ref = conceptIdentity[0].Ref[0].$;
            return new StructureReference(SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME, ref.agencyID, ref.maintainableParentID, ref.maintainableParentVersion);
        }
        return null;
    };
    static getLocalRepresentationRef(localRepresentation) {
        if (localRepresentation && localRepresentation[0] &&
            localRepresentation[0].Enumeration && localRepresentation[0].Enumeration[0] &&
            localRepresentation[0].Enumeration[0].Ref && localRepresentation[0].Enumeration[0].Ref[0]) {
            return SdmxV21JsonChildrenParser.getStructureReference(SDMX_STRUCTURE_TYPE.CODE_LIST, localRepresentation[0].Enumeration[0].Ref[0].$)
        }
        return null;
    };
    static getAgencySchemeChildren(sdmxJsonObject) {
        return [];
    };
    static getAttachmentConstraintChildren(sdmxJsonObject) {
        return []; //TODO: Not implemented!
    };
    static getCategorisationChildren(sdmxJsonObject) {
        return []; //TODO: Not implemented!
    };
    static getCategorySchemeChildren(sdmxJsonObject) {
        return [];
    };
    static getCodelistChildren(sdmxJsonObject) {
        return [];
    };
    static getConceptSchemeChildren(sdmxJsonObject) {
        if (!isDefined(sdmxJsonObject)) {
            throw new Error('Missing required paramter \'sdmxJsonObject\'');
        }
        let children = [];
        for (let c in sdmxJsonObject.Concept) {
            let concept = sdmxJsonObject.Concept[c]; //CoreRepresentation[0].Enumeration[0].Ref[0].$;
            if (concept && concept.CoreRepresentation && concept.CoreRepresentation[0] &&
                concept.CoreRepresentation[0].Enumeration && concept.CoreRepresentation[0].Enumeration[0] && 
                concept.CoreRepresentation[0].Enumeration[0].Ref && concept.CoreRepresentation[0].Enumeration[0].Ref[0]) {
                    children.push(SdmxV21JsonChildrenParser.getStructureReference(SDMX_STRUCTURE_TYPE.CODE_LIST, 
                        concept.CoreRepresentation[0].Enumeration[0].Ref[0].$));
            }
        }
        return children;
    };
    static getContentConstraintChildren(sdmxJsonObject) {
        return []; //TODO: Not implemented!
    };
    static getDataConsumerSchemeChildren(sdmxJsonObject) {
        return [];
    };
    static getDataProviderSchemeChildren(sdmxJsonObject) {
        return [];
    };
    static getDataflowChildren(sdmxJsonObject) {
        if (!isDefined(sdmxJsonObject)) {
            throw new Error('Missing required paramter \'sdmxJsonObject\'');
        }
        let children = [];
        if (sdmxJsonObject.Structure && sdmxJsonObject.Structure[0] &&
            sdmxJsonObject.Structure[0].Ref && sdmxJsonObject.Structure[0].Ref[0]) {
            children.push(SdmxV21JsonChildrenParser.getStructureReference(SDMX_STRUCTURE_TYPE.DSD, sdmxJsonObject.Structure[0].Ref[0].$));
        }
        return children;
    };
    static getDataStructureChildren(sdmxJsonObject) {
        if (!isDefined(sdmxJsonObject)) {
            throw new Error('Missing required paramter \'sdmxJsonObject\'');
        }
        let children = [];
        if (sdmxJsonObject.DataStructureComponents && sdmxJsonObject.DataStructureComponents[0]) {
            if (sdmxJsonObject.DataStructureComponents[0].DimensionList && sdmxJsonObject.DataStructureComponents[0].DimensionList[0]) {
                let dimensionList = sdmxJsonObject.DataStructureComponents[0].DimensionList[0];
                // GET CROSS REFERENCES FROM DIMENSIONS
                if (dimensionList && dimensionList.Dimension) {
                    for (let d in dimensionList.Dimension) {
                        let conceptSchemeRef = SdmxV21JsonChildrenParser.getConceptIdentityRef(dimensionList.Dimension[d].ConceptIdentity);
                        if (conceptSchemeRef !== null) {
                            children.push(conceptSchemeRef);
                        }
                        if (dimensionList.Dimension[d]) {
                            let codelistRef = SdmxV21JsonChildrenParser.getLocalRepresentationRef(dimensionList.Dimension[d].LocalRepresentation);
                            if (codelistRef !== null) {
                                children.push(codelistRef);
                            }
                        }
                    }
                }
                // GET CROSS REFERENCES FROM TIME DIMENSION
                if (dimensionList && dimensionList.TimeDimension && dimensionList.TimeDimension[0] &&
                    dimensionList.TimeDimension[0].LocalRepresentation) {
                    let codelistRef = SdmxV21JsonChildrenParser.getLocalRepresentationRef(dimensionList.TimeDimension[0].LocalRepresentation);
                    if (codelistRef !== null) {
                        children.push(codelistRef);
                    }
                }
            }
            // GET REFERENCES FROM ATTRIBUTES
            if (sdmxJsonObject.DataStructureComponents[0].AttributeList && sdmxJsonObject.DataStructureComponents[0].AttributeList[0]) {
                let attributeList = sdmxJsonObject.DataStructureComponents[0].AttributeList[0];
                if (attributeList && attributeList.Attribute) {
                    for (let a in attributeList.Attribute) {
                        if (attributeList.Attribute[a]) {
                            let conceptSchemeRef = SdmxV21JsonChildrenParser.getConceptIdentityRef(attributeList.Attribute[a].ConceptIdentity);
                            if (conceptSchemeRef !== null) {
                                children.push(conceptSchemeRef);
                            }
                            let codelistRef = SdmxV21JsonChildrenParser.getLocalRepresentationRef(attributeList.Attribute[a].LocalRepresentation);
                            if (codelistRef !== null) {
                                children.push(codelistRef);
                            }
                        }
                    }
                }
            }
        }
        // GET CROSS REFERENCES FROM PRIMARY MEASURE
        if (sdmxJsonObject.DataStructureComponents[0].MeasureList && sdmxJsonObject.DataStructureComponents[0].MeasureList[0] &&
            sdmxJsonObject.DataStructureComponents[0].MeasureList[0].PrimaryMeasure && 
            sdmxJsonObject.DataStructureComponents[0].MeasureList[0].PrimaryMeasure[0]) {
            let primaryMeasure = sdmxJsonObject.DataStructureComponents[0].MeasureList[0].PrimaryMeasure[0];

            let conceptSchemeRef = SdmxV21JsonChildrenParser.getConceptIdentityRef(primaryMeasure.ConceptIdentity);
            if (conceptSchemeRef !== null) {
                children.push(conceptSchemeRef);
            }
            let codelistRef = SdmxV21JsonChildrenParser.getLocalRepresentationRef(primaryMeasure.LocalRepresentation);
            if (codelistRef !== null) {
                children.push(codelistRef);
            }
        }
        return children;
    };
    static getHierarchicCodeList(sdmxJsonObject) {
        if (!isDefined(sdmxJsonObject)) {
            throw new Error('Missing required paramter \'sdmxJsonObject\'');
        }
        let children = [];
        for (let c in sdmxJsonObject.IncludedCodelist) {
            children.push(SdmxV21JsonChildrenParser.getStructureReference(SDMX_STRUCTURE_TYPE.CODE_LIST, sdmxJsonObject.IncludedCodelist[c].Ref[0].$));
        }
        return children;
    };
    static getMetadataflowChildren(sdmxJsonObject) {
        return [];
    };
    static getMetadataStructureChildren(sdmxJsonObject) {
        let children = [];
        if (sdmxJsonObject && sdmxJsonObject.MetadataStructureComponents && sdmxJsonObject.MetadataStructureComponents[0] &&
            sdmxJsonObject.MetadataStructureComponents[0].MetadataTarget && sdmxJsonObject.MetadataStructureComponents[0].MetadataTarget[0]) {
            for (let i in sdmxJsonObject.MetadataStructureComponents[0].MetadataTarget) {
                if (sdmxJsonObject.MetadataStructureComponents[0].MetadataTarget[i]) {
                    let target = sdmxJsonObject.MetadataStructureComponents[0].MetadataTarget[i];
                    for (let o in target.IdentifiableObjectTarget) {
                        if (target.IdentifiableObjectTarget[o]) {
                            let ref = SdmxV21JsonChildrenParser.getLocalRepresentationRef(target.IdentifiableObjectTarget[o].LocalRepresentation);       
                            if (ref !== null) {
                                children.push(ref);
                            }
                        }
                    }
                }
            }
        }
        return children;
    };
    static getOrganisationUnitSchemeChildren(sdmxJsonObject) {
        return [];
    };
    static getProcessChildren(sdmxJsonObject) {
        return [];
    };
    static getProvisionAgreementChildren(sdmxJsonObject) {
        return [];
    };
    static getReportingTaxonomyChildren(sdmxJsonObject) {
        return [];
    };
    static getStructureSetChildren(sdmxJsonObject) {
        return [];
    };
};

export default SdmxV21JsonChildrenParser;