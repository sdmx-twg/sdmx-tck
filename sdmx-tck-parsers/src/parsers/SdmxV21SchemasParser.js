var XSDGlobalElement = require('sdmx-tck-api').model.XSDGlobalElement;
var XSDSimpleType = require('sdmx-tck-api').model.XSDSimpleType;
var XSDComplexType = require('sdmx-tck-api').model.XSDComplexType;
var SdmxV21SchemaEnumerationParser = require('./SdmxV21SchemaEnumerationParser.js')
var SdmxV21SchemaFacetsParser = require('./SdmxV21SchemaFacetsParser.js')
var SdmxV21SchemaCompositorsParser = require('./SdmxV21SchemaCompositorsParser.js')
var SdmxV21SchemaAttributeParser = require('./SdmxV21SchemaAttributeParser.js')

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
            SdmxV21SchemasParser.parseComplexTypes(schemaComponents, s);
        }
        return schemaComponents;
    };
    static parseElements(schemaComponents, s) {
        if (s.element) {
            let elements = s.element;
            schemaComponents.set("elements", []);
            for (var e in elements) {
                schemaComponents.get("elements").push(new XSDGlobalElement(elements[e]));
            }
        }
    };
    static parseSimpleTypes(schemaComponents, s) {
        if(s.simpleType){
            let simpleTypes = s.simpleType;
            schemaComponents.set("simpleTypes",[]);
            for (var st in simpleTypes){
                schemaComponents.get("simpleTypes").push(new XSDSimpleType(simpleTypes[st],
                                                        SdmxV21SchemaFacetsParser.getFacets(simpleTypes[st]),
                                                        SdmxV21SchemaEnumerationParser.getEnumerations(simpleTypes[st])));
            }
        }
    };
    static parseComplexTypes(schemaComponents, s) {
        if(s.complexType){
          let complexTypes = s.complexType;
          schemaComponents.set("complexTypes",[]);
          for (var ct in complexTypes){
              schemaComponents.get("complexTypes").push(new XSDComplexType(complexTypes[ct],
                                                      SdmxV21SchemaCompositorsParser.getCompositors(complexTypes[ct]),
                                                      SdmxV21SchemaAttributeParser.getAttributes(complexTypes[ct])));
          }
      }
    };

};

module.exports = SdmxV21SchemasParser;