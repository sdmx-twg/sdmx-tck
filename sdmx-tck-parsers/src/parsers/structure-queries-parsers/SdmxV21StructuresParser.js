var MaintainableObject = require('sdmx-tck-api').model.MaintainableObject;
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var DataflowObject = require('sdmx-tck-api').model.DataflowObject;
var DataStructureObject = require('sdmx-tck-api').model.DataStructureObject;
var ContentConstraintObject = require('sdmx-tck-api').model.ContentConstraintObject;
var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;

var SdmxV21StructureReferencesParser = require('./SdmxV21StructureReferencesParser.js');
var SdmxV21JsonItemsParser = require('./SdmxV21JsonItemsParser.js');
var SdmxV21JsonForStubsParser = require('./SdmxV21JsonForStubsParser.js');
var SdmxV21JsonCubeRegionParser = require('./SdmxV21JsonCubeRegionParser.js')
var SdmxV21JsonDataKeySetParser = require('./SdmxV21JsonDataKeySetParser.js')
var SdmxV21JsonDsdComponentParser= require('./SdmxV21JsonDsdComponentParser.js')
var SdmxV21DsdGroupParsers = require('./SdmxV21DsdGroupParsers.js') 
var SdmxV21JsonReferencePeriodParser = require('./SdmxV21JsonReferencePeriodParser.js')
class SdmxV21StructuresParser {
    static parseStructures(sdmxJsonObjects) {
       
        if (sdmxJsonObjects === null || sdmxJsonObjects === undefined) {
            throw new Error("Missing mandatory parameter.");
        }
        let structures = new Map();

        if (sdmxJsonObjects && sdmxJsonObjects.Structure && sdmxJsonObjects.Structure.Structures[0]) {
            let s = sdmxJsonObjects.Structure.Structures[0];

            SdmxV21StructuresParser.parseAgencySchemes(structures, s);
            SdmxV21StructuresParser.parseOrganisationUnitSchemes(structures, s);
            SdmxV21StructuresParser.parseDataProviderSchemes(structures, s);
            SdmxV21StructuresParser.parseDataConsumerSchemes(structures, s);
            SdmxV21StructuresParser.parseAttachmentConstraints(structures, s);
            SdmxV21StructuresParser.parseContentConstraints(structures, s);
            SdmxV21StructuresParser.parseCategorySchemes(structures, s);
            SdmxV21StructuresParser.parseCodelists(structures, s);
            SdmxV21StructuresParser.parseConceptSchemes(structures, s);
            SdmxV21StructuresParser.parseDataflows(structures, s);
            SdmxV21StructuresParser.parseHierarchicalCodelists(structures, s);
            SdmxV21StructuresParser.parseDataStructures(structures, s);
            SdmxV21StructuresParser.parseMetadataflows(structures, s);
            SdmxV21StructuresParser.parseMetadataStructures(structures, s);
            SdmxV21StructuresParser.parseProcesses(structures, s);
            SdmxV21StructuresParser.parseStructureSets(structures, s);
            SdmxV21StructuresParser.parseReportingTaxonomies(structures, s);
            SdmxV21StructuresParser.parseCategorisations(structures, s);
            SdmxV21StructuresParser.parseProvisionAgreements(structures, s);
        }
        return structures;
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
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV21JsonItemsParser.getItems(structureType, schemes[c])
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
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV21JsonItemsParser.getItems(structureType, schemes[c])
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
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV21JsonItemsParser.getItems(structureType, schemes[c])
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
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV21JsonItemsParser.getItems(structureType, schemes[c])
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
                //console.log(constraints[c].DataKeySet[0].Key[0].KeyValue[0].Value)
                structures.get(structureType).push(
                    new ContentConstraintObject(constraints[c],
                        SdmxV21StructureReferencesParser.getReferences(constraints[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, constraints[c]),
                        SdmxV21JsonCubeRegionParser.getCubeRegions(constraints[c]),
                        SdmxV21JsonDataKeySetParser.getDataKeySets(constraints[c]),
                        SdmxV21JsonReferencePeriodParser.getReferencePeriod(constraints[c])));
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
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV21JsonItemsParser.getItems(structureType, schemes[c])
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
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV21StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV21JsonItemsParser.getItems(structureType, schemes[c])
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
                    new ItemSchemeObject(structureType, conceptScheme,
                        SdmxV21StructureReferencesParser.getReferences(conceptScheme),
                        SdmxV21JsonForStubsParser.getDetail(structureType, conceptScheme),
                        SdmxV21JsonItemsParser.getItems(structureType, conceptScheme)
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
                    new DataflowObject(dataflow, 
                        SdmxV21StructureReferencesParser.getReferences(dataflow),
                        SdmxV21JsonForStubsParser.getDetail(structureType, dataflow)));
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
                    new MaintainableObject(structureType, hierarchicalCodelist,
                        SdmxV21StructureReferencesParser.getReferences(hierarchicalCodelist),
                        SdmxV21JsonForStubsParser.getDetail(structureType, hierarchicalCodelist)
                    )
                );
            }
        }
    };
    static parseDataStructures(structures, s) {
        if (s.DataStructures && s.DataStructures[0] && s.DataStructures[0].DataStructure) {
            //console.log(s.DataStructures[0].DataStructure)
            for (var d in s.DataStructures[0].DataStructure) {
                let dsd = s.DataStructures[0].DataStructure[d];
                let structureType = SDMX_STRUCTURE_TYPE.DSD.key;
                let array = structures.get(structureType);
                if (!isDefined(array)) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new DataStructureObject(dsd,
                        SdmxV21JsonDsdComponentParser.getComponents(dsd),
                        SdmxV21DsdGroupParsers.getGroups(dsd),
                        SdmxV21StructureReferencesParser.getReferences(dsd),
                        SdmxV21JsonForStubsParser.getDetail(structureType, dsd)));
                    
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
                    new MaintainableObject(structureType, metadataflows[m], 
                        SdmxV21StructureReferencesParser.getReferences(metadataflows[m]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, metadataflows[m])));
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
                    new MaintainableObject(structureType, msds[m], 
                        SdmxV21StructureReferencesParser.getReferences(msds[m]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, msds[m])));
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
                    new MaintainableObject(structureType, processes[p], 
                        SdmxV21StructureReferencesParser.getReferences(processes[p]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, processes[p])));
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
                    new MaintainableObject(structureType, structureSets[c], 
                        SdmxV21StructureReferencesParser.getReferences(structureSets[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, structureSets[c])));
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
                    new MaintainableObject(structureType, rtx[r], 
                        SdmxV21StructureReferencesParser.getReferences(rtx[r]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, rtx[r])));
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
                    new MaintainableObject(structureType, ctg[c], 
                        SdmxV21StructureReferencesParser.getReferences(ctg[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, ctg[c])));
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
                    new MaintainableObject(structureType, provisionAgreements[p], 
                        SdmxV21StructureReferencesParser.getReferences(provisionAgreements[p]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, provisionAgreements[p])));
            }
        }
    };
};

module.exports = SdmxV21StructuresParser;