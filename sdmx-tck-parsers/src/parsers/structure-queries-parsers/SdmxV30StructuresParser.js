var MaintainableObject = require('sdmx-tck-api').model.MaintainableObject;
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var DataflowObject = require('sdmx-tck-api').model.DataflowObject;
var DataStructureObject = require('sdmx-tck-api').model.DataStructureObject;
var ContentConstraintObject = require('sdmx-tck-api').model.ContentConstraintObject;
var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;

var SdmxV30JsonItemsParser = require('./SdmxV30JsonItemsParser.js');
var SdmxV21JsonForStubsParser = require('./SdmxV21JsonForStubsParser.js');
var SdmxV21JsonCubeRegionParser = require('./SdmxV21JsonCubeRegionParser.js')
var SdmxV21JsonDataKeySetParser = require('./SdmxV21JsonDataKeySetParser.js')
var SdmxV30JsonDsdComponentParser= require('./SdmxV30JsonDsdComponentParser.js')
var SdmxV21DsdGroupParsers = require('./SdmxV21DsdGroupParsers.js') 
var SdmxV21JsonReferencePeriodParser = require('./SdmxV21JsonReferencePeriodParser.js')
var SdmxV21JsonAnnotationParser = require('./SdmxV21JsonAnnotationParser.js');
var SdmxV30StructureReferencesParser = require('./SdmxV30StructureReferencesParser.js');

class SdmxV30StructuresParser {
    
    static parseStructures(sdmxJsonObjects) {
       
        if (sdmxJsonObjects === null || sdmxJsonObjects === undefined) {
            throw new Error("Missing mandatory parameter.");
        }
        let structures = new Map();

        if (sdmxJsonObjects && sdmxJsonObjects.Structure && sdmxJsonObjects.Structure.Structures[0]) {
            let s = sdmxJsonObjects.Structure.Structures[0];

            SdmxV30StructuresParser.parseAgencySchemes(structures, s); // updated
            SdmxV30StructuresParser.parseOrganisationUnitSchemes(structures, s); // updated
            SdmxV30StructuresParser.parseDataProviderSchemes(structures, s); // updated
            SdmxV30StructuresParser.parseDataConsumerSchemes(structures, s); // updated
            
            SdmxV30StructuresParser.parseDataConstraints(structures, s);
            SdmxV30StructuresParser.parseMetadataConstraints(structures, s);

            SdmxV30StructuresParser.parseCategorySchemes(structures, s);
            SdmxV30StructuresParser.parseCodelists(structures, s);
            SdmxV30StructuresParser.parseConceptSchemes(structures, s); // updated
            SdmxV30StructuresParser.parseDataflows(structures, s);
            SdmxV30StructuresParser.parseDataStructures(structures, s);
            SdmxV30StructuresParser.parseMetadataflows(structures, s);
            SdmxV30StructuresParser.parseMetadataStructures(structures, s);
            SdmxV30StructuresParser.parseProcesses(structures, s);
            SdmxV30StructuresParser.parseReportingTaxonomies(structures, s);
            SdmxV30StructuresParser.parseCategorisations(structures, s);
            SdmxV30StructuresParser.parseProvisionAgreements(structures, s);

            SdmxV30StructuresParser.parseValueLists(structures, s);
            SdmxV30StructuresParser.parseHierarchies(structures, s);
            SdmxV30StructuresParser.parseHierarchyAssociations(structures, s);
            SdmxV30StructuresParser.parseMetadataProviderSchemes(structures, s);
            SdmxV30StructuresParser.parseMetadataProvisionAgreements(structures, s);
            SdmxV30StructuresParser.parseOrganisationSchemeMaps(structures, s);
            SdmxV30StructuresParser.parseCategorySchemeMaps(structures, s);
            SdmxV30StructuresParser.parseConceptSchemeMaps(structures, s);
            SdmxV30StructuresParser.parseReportingTaxonomyMaps(structures, s);
            SdmxV30StructuresParser.parseRepresentationMaps(structures, s);
            SdmxV30StructuresParser.parseStructureMaps(structures, s);
        }
        return structures;
    };
    
    static parseAgencySchemes(structures, s) {
        // AgencySchemes as top element (instead of OrganisationSchemes)
        if (s.AgencySchemes && s.AgencySchemes[0] && s.AgencySchemes[0].AgencyScheme) {
            let schemes = s.AgencySchemes[0].AgencyScheme;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV30JsonItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseOrganisationUnitSchemes(structures, s) {
        // OrganisationUnitSchemes as top element (instead of OrganisationSchemes)
        if (s.OrganisationUnitSchemes && s.OrganisationUnitSchemes[0] && s.OrganisationUnitSchemes[0].OrganisationUnitScheme) {
            let schemes = s.OrganisationUnitSchemes[0].OrganisationUnitScheme;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV30JsonItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseDataProviderSchemes(structures, s) {
        // DataProviderSchemes as top element (instead of OrganisationSchemes)
        if (s.DataProviderSchemes && s.DataProviderSchemes[0] && s.DataProviderSchemes[0].DataProviderScheme) {
            let schemes = s.DataProviderSchemes[0].DataProviderScheme;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV30JsonItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseDataConsumerSchemes(structures, s) {
        // DataConsumerSchemes as top element (instead of OrganisationSchemes)
        if (s.DataConsumerSchemes && s.DataConsumerSchemes[0] && s.DataConsumerSchemes[0].DataConsumerScheme) {
            let schemes = s.DataConsumerSchemes[0].DataConsumerScheme;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV30JsonItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseDataConstraints(structures, s) {
        // Top element updated
        if (s.DataConstraints && s.DataConstraints[0] && s.DataConstraints[0].DataConstraint) {
            let constraints = s.DataConstraints[0].DataConstraint; //TODO DataConstraing
            for (let c in constraints) {
                let structureType = SDMX_STRUCTURE_TYPE.DATA_CONSTRAINT.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                //console.log(constraints[c].DataKeySet[0].Key[0].KeyValue[0].Value)
                structures.get(structureType).push(
                    new ContentConstraintObject(structureType, constraints[c],
                        SdmxV30StructureReferencesParser.getReferences(constraints[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, constraints[c]),
                        SdmxV21JsonCubeRegionParser.getCubeRegions(constraints[c]),
                        SdmxV21JsonDataKeySetParser.getDataKeySets(constraints[c]),
                        SdmxV21JsonReferencePeriodParser.getReferencePeriod(constraints[c]),
                        SdmxV21JsonAnnotationParser.getAnnotations(constraints[c])));
            }
        }
    };
    static parseMetadataConstraints(structures, s) {
        if (s.MetadataConstraints && s.MetadataConstraints[0] && s.MetadataConstraints[0].MetadataConstraint) {
            let constraints = s.MetadataConstraints[0].MetadataConstraint; //TODO MetadataConstraing
            for (let c in constraints) {
                let structureType = SDMX_STRUCTURE_TYPE.METADATA_CONSTRAINT.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ContentConstraintObject(structureType, constraints[c],
                        SdmxV30StructureReferencesParser.getReferences(constraints[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, constraints[c]),
                        SdmxV21JsonCubeRegionParser.getCubeRegions(constraints[c]), //TODO
                        SdmxV21JsonDataKeySetParser.getDataKeySets(constraints[c]), //TODO
                        SdmxV21JsonReferencePeriodParser.getReferencePeriod(constraints[c]),
                        SdmxV21JsonAnnotationParser.getAnnotations(constraints[c])));
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
                        SdmxV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV30JsonItemsParser.getItems(structureType, schemes[c])
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
                        SdmxV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV30JsonItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseConceptSchemes(structures, s) {
        // ConceptSchemes as top element (instead of Concepts)
        if (s.ConceptSchemes && s.ConceptSchemes[0] && s.ConceptSchemes[0].ConceptScheme) {
            for (var c in s.ConceptSchemes[0].ConceptScheme) {
                var conceptScheme = s.ConceptSchemes[0].ConceptScheme[c];
                let structureType = SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, conceptScheme,
                        SdmxV30StructureReferencesParser.getReferences(conceptScheme),
                        SdmxV21JsonForStubsParser.getDetail(structureType, conceptScheme),
                        SdmxV30JsonItemsParser.getItems(structureType, conceptScheme)
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
                        SdmxV30StructureReferencesParser.getReferences(dataflow),
                        SdmxV21JsonForStubsParser.getDetail(structureType, dataflow)));
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
                    new DataStructureObject(dsd,
                        SdmxV30JsonDsdComponentParser.getComponents(dsd),
                        SdmxV21DsdGroupParsers.getGroups(dsd),
                        SdmxV30StructureReferencesParser.getReferences(dsd),
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
                        SdmxV30StructureReferencesParser.getReferences(metadataflows[m]),
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
                        SdmxV30StructureReferencesParser.getReferences(msds[m]),
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
                        SdmxV30StructureReferencesParser.getReferences(processes[p]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, processes[p])));
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
                        SdmxV30StructureReferencesParser.getReferences(rtx[r]),
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
                        SdmxV30StructureReferencesParser.getReferences(ctg[c]),
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
                        SdmxV30StructureReferencesParser.getReferences(provisionAgreements[p]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, provisionAgreements[p])));
            }
        }
    };
    static parseValueLists(structures, s) {
        if (s.ValueLists && s.ValueLists[0] && s.ValueLists[0].ValueList) {
            let schemes = s.ValueLists[0].ValueList;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.VALUE_LIST.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV30JsonItemsParser.getItems(structureType, schemes[c]))
                );
            }
        }
    };
    static parseHierarchies(structures, s) {
        if (s.Hierarchies && s.Hierarchies[0] && s.Hierarchies[0].Hierarchy) {
            let hierarchies = s.Hierarchies[0].Hierarchy;
            for (var c in hierarchies) {
                var hierarchy = hierarchies[c];
                let structureType = SDMX_STRUCTURE_TYPE.HIERARCHY.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new MaintainableObject(structureType, hierarchy,
                        SdmxV30StructureReferencesParser.getReferences(hierarchy),
                        SdmxV21JsonForStubsParser.getDetail(structureType, hierarchy))
                );
            }
        }
    };
    static parseHierarchyAssociations(structures, s) {
        if (s.HierarchyAssociations && s.HierarchyAssociations[0] && s.HierarchyAssociations[0].HierarchyAssociation) {
            let associations = s.HierarchyAssociations[0].HierarchyAssociation;
            for (var c in associations) {
                let association = associations[c];
                let structureType = SDMX_STRUCTURE_TYPE.HIERARCHY_ASSOCIATION.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new MaintainableObject(structureType, association, 
                        SdmxV30StructureReferencesParser.getReferences(association),
                        SdmxV21JsonForStubsParser.getDetail(structureType, association)));
            }
        }
    };
    static parseMetadataProviderSchemes(structures, s) {
        if (s.MetadataProviderSchemes && s.MetadataProviderSchemes[0] && s.MetadataProviderSchemes[0].MetadataProviderScheme) {
            let schemes = s.MetadataProviderSchemes[0].MetadataProviderScheme;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.METADATA_PROVIDER_SCHEME.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, schemes[c],
                        SdmxV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxV30JsonItemsParser.getItems(structureType, schemes[c])
                    ));
            }
        }
    };
    static parseMetadataProvisionAgreements(structures, s) {
        if (s.MetadataProvisionAgreements && s.MetadataProvisionAgreements[0] && s.MetadataProvisionAgreements[0].MetadataProvisionAgreement) {
            let mprovisionAgreements = s.MetadataProvisionAgreements[0].MetadataProvisionAgreement;
            for (var c in mprovisionAgreements) {
                let metaAgreement = mprovisionAgreements[c];
                let structureType = SDMX_STRUCTURE_TYPE.METADATA_PROVISION_AGREEMENT.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new MaintainableObject(structureType, metaAgreement, 
                        SdmxV30StructureReferencesParser.getReferences(metaAgreement),
                        SdmxV21JsonForStubsParser.getDetail(structureType, metaAgreement)));
            }
        }
    };
    static parseOrganisationSchemeMaps(structures, s) {
        if (s.OrganisationSchemeMaps && s.OrganisationSchemeMaps[0] && s.OrganisationSchemeMaps[0].OrganisationSchemeMap) {
            let maps = s.OrganisationSchemeMaps[0].OrganisationSchemeMap;
            this.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.ORGANISATION_SCHEME_MAP.key);
        }
    };
    static parseCategorySchemeMaps(structures, s) {
        if (s.CategorySchemeMaps && s.CategorySchemeMaps[0] && s.CategorySchemeMaps[0].CategorySchemeMap) {
            let maps = s.CategorySchemeMaps[0].CategorySchemeMap;
            this.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME_MAP.key);
        }
    };
    static parseConceptSchemeMaps(structures, s) {
        if (s.ConceptSchemeMaps && s.ConceptSchemeMaps[0] && s.ConceptSchemeMaps[0].ConceptSchemeMap) {
            let maps = s.ConceptSchemeMaps[0].ConceptSchemeMap;
            this.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME_MAP.key);
        }
    };
    static parseReportingTaxonomyMaps(structures, s) {
        if (s.ReportingTaxonomyMaps && s.ReportingTaxonomyMaps[0] && s.ReportingTaxonomyMaps[0].ReportingTaxonomyMap) {
            let maps = s.ReportingTaxonomyMaps[0].ReportingTaxonomyMap;
            this.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY_MAP.key);
        }
    };
    static parseRepresentationMaps(structures, s) {
        if (s.RepresentationMaps && s.RepresentationMaps[0] && s.RepresentationMaps[0].RepresentationMap) {
            let maps = s.RepresentationMaps[0].RepresentationMap;
            this.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.REPRESENTATION_MAP.key);
        }
    };
    static parseStructureMaps(structures, s) {
        if (s.StructureMaps && s.StructureMaps[0] && s.StructureMaps[0].StructureMap) {
            let maps = s.StructureMaps[0].StructureMap;
            this.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.STRUCTURE_MAP.key);
        }
    };
    static parseMaintainable(structures, maintainables, structureType) {
        for (var c in maintainables) {
            let maintainable = maintainables[c];
            let array = structures.get(structureType);
            if (array === null || array === undefined) {
                structures.set(structureType, []);
            }
            structures.get(structureType).push(
                new MaintainableObject(structureType, maintainable, 
                    SdmxV30StructureReferencesParser.getReferences(maintainable),
                    SdmxV21JsonForStubsParser.getDetail(structureType, maintainable)));
        }
    };

};

module.exports = SdmxV30StructuresParser;