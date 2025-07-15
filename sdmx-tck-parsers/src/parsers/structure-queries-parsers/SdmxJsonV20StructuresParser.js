var SDMX_STRUCTURE_TYPE = require('sdmx-tck-api').constants.SDMX_STRUCTURE_TYPE;
var MaintainableObject = require('sdmx-tck-api').model.MaintainableObject;
var ItemSchemeObject = require('sdmx-tck-api').model.ItemSchemeObject;
var DataflowObject = require('sdmx-tck-api').model.DataflowObject;
var ProvisionAgreementObject = require('sdmx-tck-api').model.ProvisionAgreementObject;
var DataStructureObject = require('sdmx-tck-api').model.DataStructureObject;
var ContentConstraintObject = require('sdmx-tck-api').model.ContentConstraintObject;
var SdmxStructureObjects = require('sdmx-tck-api').model.SdmxStructureObjects;

var SdmxJsonV20ItemsParser = require('./SdmxJsonV20ItemsParser.js');
var SdmxJsonV20ForStubsParser = require('./SdmxJsonV20ForStubsParser.js');
var SdmxJsonV20DsdComponentParser= require('./SdmxJsonV20DsdComponentParser.js')
var SdmxJsonV20DsdGroupParsers = require('./SdmxJsonV20DsdGroupParsers.js') 
var SdmxJsonV20ConstraintParser = require('./SdmxJsonV20ConstraintParser.js')
var SdmxJsonV20AnnotationParser = require('./SdmxJsonV20AnnotationParser.js');
var SdmxJsonV20StructureReferencesParser = require('./SdmxJsonV20StructureReferencesParser.js');

class SdmxJsonV20StructuresParser {

    static parseMessage(sdmxJsonObjects) {
        if (sdmxJsonObjects === null || sdmxJsonObjects === undefined) {
            throw new Error("Missing mandatory parameter.");
        }
        let structures = new Map();

        if (sdmxJsonObjects && sdmxJsonObjects.data) {
            let s = sdmxJsonObjects.data;

            SdmxJsonV20StructuresParser.parseAgencySchemes(structures, s);
            SdmxJsonV20StructuresParser.parseOrganisationUnitSchemes(structures, s);
            SdmxJsonV20StructuresParser.parseDataProviderSchemes(structures, s);
            SdmxJsonV20StructuresParser.parseDataConsumerSchemes(structures, s);
            SdmxJsonV20StructuresParser.parseDataConstraints(structures, s);
            SdmxJsonV20StructuresParser.parseMetadataConstraints(structures, s);
            SdmxJsonV20StructuresParser.parseCategorySchemes(structures, s);
            SdmxJsonV20StructuresParser.parseCodelists(structures, s);
            SdmxJsonV20StructuresParser.parseGeographicCodelists(structures, s);
            SdmxJsonV20StructuresParser.parseGeoGridCodelists(structures, s);
            SdmxJsonV20StructuresParser.parseConceptSchemes(structures, s);
            SdmxJsonV20StructuresParser.parseDataflows(structures, s);
            SdmxJsonV20StructuresParser.parseDataStructures(structures, s);
            SdmxJsonV20StructuresParser.parseMetadataflows(structures, s);
            SdmxJsonV20StructuresParser.parseMetadataStructures(structures, s);
            SdmxJsonV20StructuresParser.parseProcesses(structures, s);
            SdmxJsonV20StructuresParser.parseReportingTaxonomies(structures, s);
            SdmxJsonV20StructuresParser.parseCategorisations(structures, s);
            SdmxJsonV20StructuresParser.parseProvisionAgreements(structures, s);
            SdmxJsonV20StructuresParser.parseValueLists(structures, s);
            SdmxJsonV20StructuresParser.parseHierarchies(structures, s);
            SdmxJsonV20StructuresParser.parseHierarchyAssociations(structures, s);
            SdmxJsonV20StructuresParser.parseMetadataProviderSchemes(structures, s);
            SdmxJsonV20StructuresParser.parseMetadataProvisionAgreements(structures, s);
            SdmxJsonV20StructuresParser.parseOrganisationSchemeMaps(structures, s);
            SdmxJsonV20StructuresParser.parseCategorySchemeMaps(structures, s);
            SdmxJsonV20StructuresParser.parseConceptSchemeMaps(structures, s);
            SdmxJsonV20StructuresParser.parseReportingTaxonomyMaps(structures, s);
            SdmxJsonV20StructuresParser.parseRepresentationMaps(structures, s);
            SdmxJsonV20StructuresParser.parseStructureMaps(structures, s);
        }
        return new SdmxStructureObjects(structures);
    };
    static parseAgencySchemes(structures, s) {
        let schemes = s.agencySchemes;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.AGENCY_SCHEME.key);
    };
    static parseOrganisationUnitSchemes(structures, s) {
        let schemes = s.organisationUnitSchemes;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key);
    };
    static parseDataProviderSchemes(structures, s) {
        let schemes = s.dataProviderSchemes;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key);
    };
    static parseDataConsumerSchemes(structures, s) {
        let schemes = s.dataConsumerSchemes;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.DATA_CONSUMER_SCHEME.key);
    };
    static parseDataConstraints(structures, s) {
        let constraints = s.dataConstraints;
        SdmxJsonV20StructuresParser.parseConstraint(structures, constraints, SDMX_STRUCTURE_TYPE.DATA_CONSTRAINT.key);
    };
    static parseMetadataConstraints(structures, s) {
        let constraints = s.metadataConstraints;
        SdmxJsonV20StructuresParser.parseConstraint(structures, constraints, SDMX_STRUCTURE_TYPE.METADATA_CONSTRAINT.key);
    };
    static parseCategorySchemes(structures, s) {
        let schemes = s.categorySchemes;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME.key);
    };
    static parseCodelists(structures, s) {
        let schemes = s.codelists;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.CODE_LIST.key);
    };
    static parseGeographicCodelists(structures, s) {
        let schemes = s.geographicCodelists;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.CODE_LIST.key);
    };
    static parseGeoGridCodelists(structures, s) {
        let schemes = s.geoGridCodelists;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.CODE_LIST.key);
    };
    static parseConceptSchemes(structures, s) {
        let schemes = s.conceptSchemes;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME.key);
    };
    static parseDataflows(structures, s) {
        let dataflows = s.dataflows;
        if (dataflows) {
            for (let dataflow of dataflows) {
                let structureType = SDMX_STRUCTURE_TYPE.DATAFLOW.key;
                SdmxJsonV20StructuresParser._addStructure(structures, structureType,
                    new DataflowObject(dataflow,
                        SdmxJsonV20StructureReferencesParser.getReferences(dataflow, structureType),
                        SdmxJsonV20ForStubsParser.getDetail(structureType, dataflow)
                    )
                );
            }
        }
    };
    static parseDataStructures(structures, s) {
        let datastructures = s.dataStructures;
        if (datastructures) {
            for (let dsd of datastructures) {
                let structureType = SDMX_STRUCTURE_TYPE.DSD.key;
                SdmxJsonV20StructuresParser._addStructure(structures, structureType,
                    new DataStructureObject(dsd,
                        SdmxJsonV20DsdComponentParser.getComponents(dsd),
                        SdmxJsonV20DsdGroupParsers.getGroups(dsd),
                        SdmxJsonV20StructureReferencesParser.getReferences(dsd, structureType),
                        SdmxJsonV20ForStubsParser.getDetail(structureType, dsd)
                    )
                );
            }
        }
    };
    static parseMetadataflows(structures, s) {
        let metadataflows = s.metadataflows;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, metadataflows, SDMX_STRUCTURE_TYPE.METADATA_FLOW.key);
    };
    static parseMetadataStructures(structures, s) {
        let metadatastructures = s.metadataStructures;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, metadatastructures, SDMX_STRUCTURE_TYPE.MSD.key);
    };
    static parseProcesses(structures, s) {
        let processes = s.processes;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, processes, SDMX_STRUCTURE_TYPE.PROCESS.key);
    };
    static parseReportingTaxonomies(structures, s) {
        let taxonomies = s.reportingTaxonomies;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, taxonomies, SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY.key);
    };
    static parseCategorisations(structures, s) {
        let categorisations = s.categorisations;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, categorisations, SDMX_STRUCTURE_TYPE.CATEGORISATION.key);
    };
    static parseProvisionAgreements(structures, s) {
        let provisionAgreements = s.provisionAgreements;
        if (provisionAgreements) {
            for (let pra of provisionAgreements) {
                let structureType = SDMX_STRUCTURE_TYPE.PROVISION_AGREEMENT.key;
                SdmxJsonV20StructuresParser._addStructure(structures, structureType,
                    new ProvisionAgreementObject(pra, 
                        SdmxJsonV20StructureReferencesParser.getReferences(pra, structureType),
                        SdmxJsonV20ForStubsParser.getDetail(structureType, pra)
                    )
                );
            }
        }
    };
    static parseValueLists(structures, s) {
        let schemes = s.valueLists;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.VALUE_LIST.key);
    };
    static parseHierarchies(structures, s) {
        let hierarchies = s.hierarchies;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, hierarchies, SDMX_STRUCTURE_TYPE.HIERARCHY.key);
    };
    static parseHierarchyAssociations(structures, s) {
        let associations = s.hierarchyAssociations;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, associations, SDMX_STRUCTURE_TYPE.HIERARCHY_ASSOCIATION.key);
    };
    static parseMetadataProviderSchemes(structures, s) {
        let schemes = s.metadataProviderSchemes;
        SdmxJsonV20StructuresParser.parseItemScheme(structures, schemes, SDMX_STRUCTURE_TYPE.METADATA_PROVIDER_SCHEME.key);
    };
    static parseMetadataProvisionAgreements(structures, s) {
        let provisionagreements = s.metadataProvisionAgreements;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, provisionagreements, SDMX_STRUCTURE_TYPE.METADATA_PROVISION_AGREEMENT.key);
    };
    static parseOrganisationSchemeMaps(structures, s) {
        let maps = s.organisationSchemeMaps;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.ORGANISATION_SCHEME_MAP.key);
    };
    static parseCategorySchemeMaps(structures, s) {
        let maps = s.categorySchemeMaps;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.CATEGORY_SCHEME_MAP.key);
    };
    static parseConceptSchemeMaps(structures, s) {
        let maps = s.conceptSchemeMaps;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.CONCEPT_SCHEME_MAP.key);
    };
    static parseReportingTaxonomyMaps(structures, s) {
        let maps = s.reportingTaxonomyMaps;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.REPORTING_TAXONOMY_MAP.key);
    };
    static parseRepresentationMaps(structures, s) {
        let maps = s.representationMaps;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.REPRESENTATION_MAP.key);
    };
    static parseStructureMaps(structures, s) {
        let maps = s.structureMaps;
        SdmxJsonV20StructuresParser.parseMaintainable(structures, maps, SDMX_STRUCTURE_TYPE.STRUCTURE_MAP.key);
    };
    static parseConstraint(structures, constraints, structureType) {
        if (constraints) {
            for (let constraint of constraints) {
                SdmxJsonV20StructuresParser._addStructure(structures, structureType,
                    new ContentConstraintObject(structureType, constraint,
                        SdmxJsonV20StructureReferencesParser.getReferences(constraint, structureType),
                        SdmxJsonV20ForStubsParser.getDetail(structureType, constraint),
                        SdmxJsonV20ConstraintParser.getCubeRegions(constraint),
                        SdmxJsonV20ConstraintParser.getDataKeySets(constraint),
                        SdmxJsonV20ConstraintParser.getReferencePeriod(constraint),
                        SdmxJsonV20AnnotationParser.getAnnotations(constraint)
                    )
                );
            }
        }
    }
    static parseItemScheme(structures, schemes, structureType) {
        if (schemes) {
            for (let scheme of schemes) {
                SdmxJsonV20StructuresParser._addStructure(structures, structureType,
                    new ItemSchemeObject(structureType, scheme,
                        SdmxJsonV20StructureReferencesParser.getReferences(scheme, structureType),
                        SdmxJsonV20ForStubsParser.getDetail(structureType, scheme),                        
                        SdmxJsonV20ItemsParser.getItems(structureType, scheme)
                    )
                );
            }
        }
    }
    static parseMaintainable(structures, maintainables, structureType) {
        if (maintainables) {
            for (let maintainable of maintainables) {
                SdmxJsonV20StructuresParser._addStructure(structures, structureType,
                    new MaintainableObject(structureType, maintainable, 
                        SdmxJsonV20StructureReferencesParser.getReferences(maintainable, structureType),
                        SdmxJsonV20ForStubsParser.getDetail(structureType, maintainable)
                    )
                );
            }
        }
    };
    static _addStructure(structures, structureType, structureObject) {
        let array = structures.get(structureType);
        if (array === null || array === undefined) {
            structures.set(structureType, []);
        }
        structures.get(structureType).push(structureObject);
    };
};

module.exports = SdmxJsonV20StructuresParser;