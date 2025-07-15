var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var MaintainableObject = require('sdmx-tck-api').model.MaintainableObject;
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var DataflowObject = require('sdmx-tck-api').model.DataflowObject;
var DataStructureObject = require('sdmx-tck-api').model.DataStructureObject;
var ProvisionAgreementObject = require('sdmx-tck-api').model.ProvisionAgreementObject;
var ContentConstraintObject = require('sdmx-tck-api').model.ContentConstraintObject;
var RegistrationObject = require('sdmx-tck-api').model.RegistrationObject;
var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;

var SdmxXmlV21StructureReferencesParser = require('./SdmxXmlV21StructureReferencesParser.js');
var SdmxXmlV21ItemsParser = require("./SdmxXmlV21ItemsParser.js");
var SdmxXmlForStubsParser = require('./SdmxXmlForStubsParser.js');
var SdmxXmlV21DsdComponentParser= require('./SdmxXmlV21DsdComponentParser.js')
var SdmxXmlV21DsdGroupParsers = require('./SdmxXmlV21DsdGroupParsers.js') 
var SdmxXmlV21ConstraintParser = require('./SdmxXmlV21ConstraintParser.js')
var SdmxXmlAnnotationParser = require('./SdmxXmlAnnotationParser.js')
var SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;

class SdmxXmlV21StructuresParser {
    static parseMessage(sdmxJsonObjects) {
       
        if (sdmxJsonObjects === null || sdmxJsonObjects === undefined) {
            throw new Error("Missing mandatory parameter.");
        }
        let structures = new Map();

        if (sdmxJsonObjects && sdmxJsonObjects.Structure && sdmxJsonObjects.Structure.Structures[0]) {
            let s = sdmxJsonObjects.Structure.Structures[0];

            SdmxXmlV21StructuresParser.parseAgencySchemes(structures, s);
            SdmxXmlV21StructuresParser.parseOrganisationUnitSchemes(structures, s);
            SdmxXmlV21StructuresParser.parseDataProviderSchemes(structures, s);
            SdmxXmlV21StructuresParser.parseDataConsumerSchemes(structures, s);
            SdmxXmlV21StructuresParser.parseAttachmentConstraints(structures, s);
            SdmxXmlV21StructuresParser.parseContentConstraints(structures, s);
            SdmxXmlV21StructuresParser.parseCategorySchemes(structures, s);
            SdmxXmlV21StructuresParser.parseCodelists(structures, s);
            SdmxXmlV21StructuresParser.parseConceptSchemes(structures, s);
            SdmxXmlV21StructuresParser.parseDataflows(structures, s);
            SdmxXmlV21StructuresParser.parseHierarchicalCodelists(structures, s);
            SdmxXmlV21StructuresParser.parseDataStructures(structures, s);
            SdmxXmlV21StructuresParser.parseMetadataflows(structures, s);
            SdmxXmlV21StructuresParser.parseMetadataStructures(structures, s);
            SdmxXmlV21StructuresParser.parseProcesses(structures, s);
            SdmxXmlV21StructuresParser.parseStructureSets(structures, s);
            SdmxXmlV21StructuresParser.parseReportingTaxonomies(structures, s);
            SdmxXmlV21StructuresParser.parseCategorisations(structures, s);
            SdmxXmlV21StructuresParser.parseProvisionAgreements(structures, s);
        } else if (sdmxJsonObjects
            && sdmxJsonObjects.RegistryInterface
            && sdmxJsonObjects.RegistryInterface.QueryRegistrationResponse[0]) {
            let s = sdmxJsonObjects.RegistryInterface.QueryRegistrationResponse[0];
            SdmxXmlV21StructuresParser.parseRegistrations(structures, s);
        }
        return new SdmxStructureObjects(structures);
    };
    static parseAgencySchemes(structures, s) {
        if (s.OrganisationSchemes && s.OrganisationSchemes[0] && s.OrganisationSchemes[0].AgencyScheme) {
            let schemes = s.OrganisationSchemes[0].AgencyScheme;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV21ItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseOrganisationUnitSchemes(structures, s) {
        if (s.OrganisationSchemes && s.OrganisationSchemes[0] && s.OrganisationSchemes[0].OrganisationUnitScheme) {
            let schemes = s.OrganisationSchemes[0].OrganisationUnitScheme;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV21ItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseDataProviderSchemes(structures, s) {
        if (s.OrganisationSchemes && s.OrganisationSchemes[0] && s.OrganisationSchemes[0].DataProviderScheme) {
            let schemes = s.OrganisationSchemes[0].DataProviderScheme;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV21ItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseDataConsumerSchemes(structures, s) {
        if (s.OrganisationSchemes && s.OrganisationSchemes[0] && s.OrganisationSchemes[0].DataConsumerScheme) {
            let schemes = s.OrganisationSchemes[0].DataConsumerScheme;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV21ItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseAttachmentConstraints(structures, s) {

    };
    static parseContentConstraints(structures, s) {
        if (s.Constraints && s.Constraints[0] && s.Constraints[0].ContentConstraint) {
            let constraints = s.Constraints[0].ContentConstraint;
            for (let c in constraints) {
                let structureType = SDMX_STRUCTURE_TYPE.CONTENT_CONSTRAINT.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ContentConstraintObject(structureType, { ...constraints[c].$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(constraints[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, constraints[c]),
                        SdmxXmlV21ConstraintParser.getCubeRegions(constraints[c]),
                        SdmxXmlV21ConstraintParser.getDataKeySets(constraints[c]),
                        SdmxXmlV21ConstraintParser.getReferencePeriod(constraints[c]),
                        SdmxXmlAnnotationParser.getAnnotations(constraints[c])));
            }
        }
    };
    static parseCategorySchemes(structures, s) {
        if (s.CategorySchemes && s.CategorySchemes[0] && s.CategorySchemes[0].CategoryScheme) {
            let schemes = s.CategorySchemes[0].CategoryScheme;
            for (let c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV21ItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseCodelists(structures, s) {
        if (s.Codelists && s.Codelists[0] && s.Codelists[0].Codelist) {
            let schemes = s.Codelists[0].Codelist;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.CODE_LIST.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV21ItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseConceptSchemes(structures, s) {
        if (s.Concepts && s.Concepts[0] && s.Concepts[0].ConceptScheme) {
            for (var c in s.Concepts[0].ConceptScheme) {
                var conceptScheme = s.Concepts[0].ConceptScheme[c];
                let structureType = SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...conceptScheme, ...conceptScheme.$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(conceptScheme),
                        SdmxXmlForStubsParser.getDetail(structureType, conceptScheme),
                        SdmxXmlV21ItemsParser.getItems(structureType, conceptScheme)
                    )
                );
            }
        }
    };
    static parseDataflows(structures, s) {
        if (s.Dataflows && s.Dataflows[0] && s.Dataflows[0].Dataflow) {
            for (var d in s.Dataflows[0].Dataflow) {
                let dataflow = s.Dataflows[0].Dataflow[d];
                let structureType = SDMX_STRUCTURE_TYPE.DATAFLOW.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new DataflowObject({ ...dataflow.$ }, 
                        SdmxXmlV21StructureReferencesParser.getReferences(dataflow),
                        SdmxXmlForStubsParser.getDetail(structureType, dataflow)));
            }
        }
    };
    static parseHierarchicalCodelists(structures, s) {
        if (s.HierarchicalCodelists && s.HierarchicalCodelists[0] && s.HierarchicalCodelists[0].HierarchicalCodelist) {
            let cls = s.HierarchicalCodelists[0].HierarchicalCodelist;
            for (var c in cls) {
                var hierarchicalCodelist = cls[c];
                let structureType = SDMX_STRUCTURE_TYPE.HIERARCHICAL_CODELIST.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...hierarchicalCodelist, ...hierarchicalCodelist.$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(hierarchicalCodelist),
                        SdmxXmlForStubsParser.getDetail(structureType, hierarchicalCodelist),
                        SdmxXmlV21ItemsParser.getItems(structureType, hierarchicalCodelist)
                    )
                );
            }
        }
    };
    static parseDataStructures(structures, s) {
        if (s.DataStructures && s.DataStructures[0] && s.DataStructures[0].DataStructure) {
            for (var d in s.DataStructures[0].DataStructure) {
                let dsd = s.DataStructures[0].DataStructure[d];
                let structureType = SDMX_STRUCTURE_TYPE.DSD.key;
                let array = structures.get(structureType);
                if (!isDefined(array)) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new DataStructureObject({ ...dsd.$ },
                        SdmxXmlV21DsdComponentParser.getComponents(dsd),
                        SdmxXmlV21DsdGroupParsers.getGroups(dsd),
                        SdmxXmlV21StructureReferencesParser.getReferences(dsd),
                        SdmxXmlForStubsParser.getDetail(structureType, dsd)));
                    
            }
        }
    };
    static parseMetadataflows(structures, s) {
        if (s.Metadataflows && s.Metadataflows[0] && s.Metadataflows[0].Metadataflow) {
            let metadataflows = s.Metadataflows[0].Metadataflow;
            for (var m in metadataflows) {
                let structureType = SDMX_STRUCTURE_TYPE.METADATA_FLOW.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new MaintainableObject(structureType, { ...metadataflows[m].$ }, 
                        SdmxXmlV21StructureReferencesParser.getReferences(metadataflows[m]),
                        SdmxXmlForStubsParser.getDetail(structureType, metadataflows[m])));
            }
        }
    };
    static parseMetadataStructures(structures, s) {
        if (s.MetadataStructures && s.MetadataStructures[0] && s.MetadataStructures[0].MetadataStructure) {
            let msds = s.MetadataStructures[0].MetadataStructure;
            for (var m in msds) {
                let structureType = SDMX_STRUCTURE_TYPE.MSD.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new MaintainableObject(structureType, { ...msds[m].$ },
                        SdmxXmlV21StructureReferencesParser.getReferences(msds[m]),
                        SdmxXmlForStubsParser.getDetail(structureType, msds[m])));
            }
        }
    };
    static parseProcesses(structures, s) {
        if (s.Processes && s.Processes[0] && s.Processes[0].Process) {
            let processes = s.Processes[0].Process;
            for (var p in processes) {
                let structureType = SDMX_STRUCTURE_TYPE.PROCESS.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new MaintainableObject(structureType, { ...processes[p].$ }, 
                        SdmxXmlV21StructureReferencesParser.getReferences(processes[p]),
                        SdmxXmlForStubsParser.getDetail(structureType, processes[p])));
            }
        }
    };
    static parseStructureSets(structures, s) {
        if (s.StructureSets && s.StructureSets[0] && s.StructureSets[0].StructureSet) {
            let structureSets = s.StructureSets[0].StructureSet;
            for (var c in structureSets) {
                let structureType = SDMX_STRUCTURE_TYPE.STRUCTURE_SET.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new MaintainableObject(structureType, { ...structureSets[c].$ }, 
                        SdmxXmlV21StructureReferencesParser.getReferences(structureSets[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, structureSets[c])));
            }
        }
    };
    static parseReportingTaxonomies(structures, s) {
        if (s.ReportingTaxonomies && s.ReportingTaxonomies[0] && s.ReportingTaxonomies[0].ReportingTaxonomy) {
            let rtx = s.ReportingTaxonomies[0].ReportingTaxonomy;
            for (var r in rtx) {
                let structureType = SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new MaintainableObject(structureType, { ...rtx[r].$ }, 
                        SdmxXmlV21StructureReferencesParser.getReferences(rtx[r]),
                        SdmxXmlForStubsParser.getDetail(structureType, rtx[r])));
            }
        }
    };
    static parseCategorisations(structures, s) {
        if (s.Categorisations && s.Categorisations[0] && s.Categorisations[0].Categorisation) {
            let ctg = s.Categorisations[0].Categorisation;
            for (var c in ctg) {
                let structureType = SDMX_STRUCTURE_TYPE.CATEGORISATION.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new MaintainableObject(structureType, { ...ctg[c].$ }, 
                        SdmxXmlV21StructureReferencesParser.getReferences(ctg[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, ctg[c])));
            }
        }
    };
    static parseProvisionAgreements(structures, s) {
        if (s.ProvisionAgreements && s.ProvisionAgreements[0] && s.ProvisionAgreements[0].ProvisionAgreement) {
            let provisionAgreements = s.ProvisionAgreements[0].ProvisionAgreement;
            for (var p in provisionAgreements) {
                let structureType = SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ProvisionAgreementObject({ ...provisionAgreements[p].$ }, 
                        SdmxXmlV21StructureReferencesParser.getReferences(provisionAgreements[p]),
                        SdmxXmlForStubsParser.getDetail(structureType, provisionAgreements[p])));
            }
        }
    };

    static parseRegistrations(structures, s) {
        if (s.QueryResult) {
            let queryResults = s.QueryResult;
            for (let i in queryResults) {
                let dataResult = queryResults[i].DataResult[0];
                if (dataResult) {
                    let registration = dataResult.Registration[0];

                    let structureType = SDMX_STRUCTURE_TYPE.REGISTRATION.key;
                    let array = structures.get(structureType);
                    if (array === null || array === undefined) {
                        structures.set(structureType, []);
                    }
                    let props = {...registration, ...registration.$};
                    let children = SdmxXmlV21StructureReferencesParser.getReferences(registration);

                    structures.get(structureType).push(new RegistrationObject(props, children));
                }
            }
        }
    };
};

module.exports = SdmxXmlV21StructuresParser;