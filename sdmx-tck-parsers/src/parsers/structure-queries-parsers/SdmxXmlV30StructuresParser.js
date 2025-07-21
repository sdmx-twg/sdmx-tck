var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var MaintainableObject = require('sdmx-tck-api').model.MaintainableObject;
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var DataflowObject = require('sdmx-tck-api').model.DataflowObject;
var ProvisionAgreementObject = require('sdmx-tck-api').model.ProvisionAgreementObject;
var DataStructureObject = require('sdmx-tck-api').model.DataStructureObject;
var ContentConstraintObject = require('sdmx-tck-api').model.ContentConstraintObject;
var RegistrationObject = require('sdmx-tck-api').model.RegistrationObject;
var isDefined = require('sdmx-tck-api').utils.Utils.isDefined;

var SdmxXmlV30ItemsParser = require('./SdmxXmlV30ItemsParser.js');
var SdmxXmlForStubsParser = require('./SdmxXmlForStubsParser.js');
var SdmxXmlV30DsdComponentParser = require('./SdmxXmlV30DsdComponentParser.js')
var SdmxXmlV30DsdGroupParsers = require('./SdmxXmlV30DsdGroupParsers.js') 
var SdmxXmlV21ConstraintParser = require('./SdmxXmlV21ConstraintParser.js')
var SdmxXmlAnnotationParser = require('./SdmxXmlAnnotationParser.js');
var SdmxXmlV30StructureReferencesParser = require('./SdmxXmlV30StructureReferencesParser.js');
var SdmxXmlV21StructureReferencesParser = require('./SdmxXmlV21StructureReferencesParser.js');
var SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;

class SdmxXmlV30StructuresParser {
    
    static parseMessage(sdmxJsonObjects) {
       
        if (sdmxJsonObjects === null || sdmxJsonObjects === undefined) {
            throw new Error("Missing mandatory parameter.");
        }
        let structures = new Map();

        if (sdmxJsonObjects && sdmxJsonObjects.Structure && sdmxJsonObjects.Structure.Structures[0]) {
            let s = sdmxJsonObjects.Structure.Structures[0];

            SdmxXmlV30StructuresParser.parseAgencySchemes(structures, s); // updated
            SdmxXmlV30StructuresParser.parseOrganisationUnitSchemes(structures, s); // updated
            SdmxXmlV30StructuresParser.parseDataProviderSchemes(structures, s); // updated
            SdmxXmlV30StructuresParser.parseDataConsumerSchemes(structures, s); // updated
            
            SdmxXmlV30StructuresParser.parseDataConstraints(structures, s);
            SdmxXmlV30StructuresParser.parseMetadataConstraints(structures, s);

            SdmxXmlV30StructuresParser.parseCategorySchemes(structures, s);
            SdmxXmlV30StructuresParser.parseCodelists(structures, s);
            SdmxXmlV30StructuresParser.parseGeographicCodelists(structures, s);
            SdmxXmlV30StructuresParser.parseGeoGridCodelists(structures, s);
            SdmxXmlV30StructuresParser.parseConceptSchemes(structures, s); // updated
            SdmxXmlV30StructuresParser.parseDataflows(structures, s);
            SdmxXmlV30StructuresParser.parseDataStructures(structures, s);
            SdmxXmlV30StructuresParser.parseMetadataflows(structures, s);
            SdmxXmlV30StructuresParser.parseMetadataStructures(structures, s);
            SdmxXmlV30StructuresParser.parseProcesses(structures, s);
            SdmxXmlV30StructuresParser.parseReportingTaxonomies(structures, s);
            SdmxXmlV30StructuresParser.parseCategorisations(structures, s);
            SdmxXmlV30StructuresParser.parseProvisionAgreements(structures, s);

            SdmxXmlV30StructuresParser.parseValueLists(structures, s);
            SdmxXmlV30StructuresParser.parseHierarchies(structures, s);
            SdmxXmlV30StructuresParser.parseHierarchyAssociations(structures, s);
            SdmxXmlV30StructuresParser.parseMetadataProviderSchemes(structures, s);
            SdmxXmlV30StructuresParser.parseMetadataProvisionAgreements(structures, s);
            SdmxXmlV30StructuresParser.parseOrganisationSchemeMaps(structures, s);
            SdmxXmlV30StructuresParser.parseCategorySchemeMaps(structures, s);
            SdmxXmlV30StructuresParser.parseConceptSchemeMaps(structures, s);
            SdmxXmlV30StructuresParser.parseReportingTaxonomyMaps(structures, s);
            SdmxXmlV30StructuresParser.parseRepresentationMaps(structures, s);
            SdmxXmlV30StructuresParser.parseStructureMaps(structures, s);
        } else if (sdmxJsonObjects
            && sdmxJsonObjects.RegistryInterface
            && sdmxJsonObjects.RegistryInterface.QueryRegistrationResponse[0]) {
            let s = sdmxJsonObjects.RegistryInterface.QueryRegistrationResponse[0];
            SdmxXmlV30StructuresParser.parseRegistrations(structures, s);
        }
        return new SdmxStructureObjects(structures);
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
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c])
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
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c])
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
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c])
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
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c])
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
                structures.get(structureType).push(
                    new ContentConstraintObject(structureType, { ...constraints[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(constraints[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, constraints[c]),
                        SdmxXmlV21ConstraintParser.getCubeRegions(constraints[c]),
                        SdmxXmlV21ConstraintParser.getDataKeySets(constraints[c]),
                        null, // ReferencePeriod no longer exists in SDMX 3.0
                        SdmxXmlAnnotationParser.getAnnotations(constraints[c])));
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
                    new ContentConstraintObject(structureType, { ...constraints[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(constraints[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, constraints[c]),
                        SdmxXmlV21ConstraintParser.getCubeRegions(constraints[c]), //TODO
                        SdmxXmlV21ConstraintParser.getDataKeySets(constraints[c]), //TODO
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
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c])
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
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseGeographicCodelists(structures, s) {
        if (s.GeographicCodelists && s.GeographicCodelists[0] && s.GeographicCodelists[0].GeographicCodelist) {
            let schemes = s.GeographicCodelists[0].GeographicCodelist;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.CODE_LIST.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c])
                    )
                );
            }
        }
    };
    static parseGeoGridCodelists(structures, s) {
        if (s.GeoGridCodelists && s.GeoGridCodelists[0] && s.GeoGridCodelists[0].GeoGridCodelist) {
            let schemes = s.GeoGridCodelists[0].GeoGridCodelist;
            for (var c in schemes) {
                let structureType = SDMX_STRUCTURE_TYPE.CODE_LIST.key;
                let array = structures.get(structureType);
                if (array === null || array === undefined) {
                    structures.set(structureType, []);
                }
                structures.get(structureType).push(
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c])
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
                    new ItemSchemeObject(structureType, { ...conceptScheme, ...conceptScheme.$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(conceptScheme),
                        SdmxXmlForStubsParser.getDetail(structureType, conceptScheme),
                        SdmxXmlV30ItemsParser.getItems(structureType, conceptScheme)
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
                        SdmxXmlV30StructureReferencesParser.getReferences(dataflow),
                        SdmxXmlForStubsParser.getDetail(structureType, dataflow)));
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
                        SdmxXmlV30DsdComponentParser.getComponents(dsd),
                        SdmxXmlV30DsdGroupParsers.getGroups(dsd),
                        SdmxXmlV30StructureReferencesParser.getReferences(dsd),
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
                        SdmxXmlV30StructureReferencesParser.getReferences(metadataflows[m]),
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
                        SdmxXmlV30StructureReferencesParser.getReferences(msds[m]),
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
                        SdmxXmlV30StructureReferencesParser.getReferences(processes[p]),
                        SdmxXmlForStubsParser.getDetail(structureType, processes[p])));
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
                        SdmxXmlV30StructureReferencesParser.getReferences(rtx[r]),
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
                        SdmxXmlV30StructureReferencesParser.getReferences(ctg[c]),
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
                        SdmxXmlV30StructureReferencesParser.getReferences(provisionAgreements[p]),
                        SdmxXmlForStubsParser.getDetail(structureType, provisionAgreements[p])));
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
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c]))
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
                    new MaintainableObject(structureType, { ...hierarchy.$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(hierarchy),
                        SdmxXmlForStubsParser.getDetail(structureType, hierarchy))
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
                    new MaintainableObject(structureType, { ...association.$ }, 
                        SdmxXmlV30StructureReferencesParser.getReferences(association),
                        SdmxXmlForStubsParser.getDetail(structureType, association)));
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
                    new ItemSchemeObject(structureType, { ...schemes[c], ...schemes[c].$ },
                        SdmxXmlV30StructureReferencesParser.getReferences(schemes[c]),
                        SdmxXmlForStubsParser.getDetail(structureType, schemes[c]),
                        SdmxXmlV30ItemsParser.getItems(structureType, schemes[c])
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
                    new MaintainableObject(structureType, { ...metaAgreement.$ }, 
                        SdmxXmlV30StructureReferencesParser.getReferences(metaAgreement),
                        SdmxXmlForStubsParser.getDetail(structureType, metaAgreement)));
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
                new MaintainableObject(structureType, { ...maintainable.$ }, 
                    SdmxXmlV30StructureReferencesParser.getReferences(maintainable),
                    SdmxXmlForStubsParser.getDetail(structureType, maintainable)));
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
                    let children = SdmxXmlV30StructureReferencesParser.getReferences(registration);
                    //TODO: check this
                    if (children.length == 0) {
                        children = SdmxXmlV21StructureReferencesParser.getReferences(registration);
                    }

                    structures.get(structureType).push(new RegistrationObject(props, children));
                }
            }
        }
    };
};

module.exports = SdmxXmlV30StructuresParser;