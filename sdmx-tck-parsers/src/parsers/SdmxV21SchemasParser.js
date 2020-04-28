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

var XSDElement = require('sdmx-tck-api').model.XSDElement;
var XSDSimpleType = require('sdmx-tck-api').model.XSDSimpleType;
var SdmxV21SchemaEnumerationParser = require('./SdmxV21SchemaEnumerationParser.js')
class SdmxV21SchemasParser {
    static parseXSD(sdmxJsonObjects) {
       
        if (sdmxJsonObjects === null || sdmxJsonObjects === undefined) {
            throw new Error("Missing mandatory parameter.");
        }
        let schemaComponents = new Map();

        if (sdmxJsonObjects && sdmxJsonObjects.schema) {
            let s = sdmxJsonObjects.schema;
            //console.log(s)
            SdmxV21SchemasParser.parseElements(schemaComponents, s);
            SdmxV21SchemasParser.parseSimpleTypes(schemaComponents, s);
            // SdmxV21SchemasParser.parseComplexTypes(schemaComponents, s);
        }
        return schemaComponents;
    };
    static parseElements(schemaComponents, s) {
        if (s.element) {
            let elements = s.element;
            schemaComponents.set("elements", []);
            for (var e in elements) {
                schemaComponents.get("elements").push(new XSDElement(elements[e]));
            }
        }
    };
    static parseSimpleTypes(schemaComponents, s) {
        if(s.simpleType){
              //console.log(s.simpleType[0].$)
              //console.log(s.simpleType[0].restriction[0].enumeration[0])
            let simpleTypes = s.simpleType;
            schemaComponents.set("simpleTypes",[]);
            for (var st in simpleTypes){
                console.log(simpleTypes[st])
                schemaComponents.get("simpleTypes").push(new XSDSimpleType(simpleTypes[st], 
                                                         SdmxV21SchemaEnumerationParser.getEnumerations(simpleTypes[st])));
            }
        }
        // if (s.OrganisationSchemes && s.OrganisationSchemes[0] && s.OrganisationSchemes[0].OrganisationUnitScheme) {
        //     let schemes = s.OrganisationSchemes[0].OrganisationUnitScheme;
        //     for (var c in schemes) {
        //         let structureType = SDMX_STRUCTURE_TYPE.ORGANISATION_UNIT_SCHEME.key;
        //         let array = structures.get(structureType);
        //         if (array === null || array === undefined) {
        //             structures.set(structureType, []);
        //         }
        //         structures.get(structureType).push(
        //             new ItemSchemeObject(structureType, schemes[c],
        //                 SdmxV21StructureReferencesParser.getReferences(schemes[c]),
        //                 SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
        //                 SdmxV21JsonItemsParser.getItems(structureType, schemes[c])
        //             )
        //         );
        //     }
        // }
    };
    static parseComplexTypes(schemaComponents, s) {
        // if (s.OrganisationSchemes && s.OrganisationSchemes[0] && s.OrganisationSchemes[0].DataProviderScheme) {
        //     let schemes = s.OrganisationSchemes[0].DataProviderScheme;
        //     for (var c in schemes) {
        //         let structureType = SDMX_STRUCTURE_TYPE.DATA_PROVIDER_SCHEME.key;
        //         let array = structures.get(structureType);
        //         if (array === null || array === undefined) {
        //             structures.set(structureType, []);
        //         }
        //         structures.get(structureType).push(
        //             new ItemSchemeObject(structureType, schemes[c],
        //                 SdmxV21StructureReferencesParser.getReferences(schemes[c]),
        //                 SdmxV21JsonForStubsParser.getDetail(structureType, schemes[c]),
        //                 SdmxV21JsonItemsParser.getItems(structureType, schemes[c])
        //             )
        //         );
        //     }
        // }
    };

};

module.exports = SdmxV21SchemasParser;