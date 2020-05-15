var XSDGlobalElement = require('sdmx-tck-api').model.XSDGlobalElement;
var XSDSimpleType = require('sdmx-tck-api').model.XSDSimpleType;
var XSDComplexType = require('sdmx-tck-api').model.XSDComplexType;
const XSD_COMPONENTS_TYPES = require('sdmx-tck-api').constants.XSD_COMPONENTS_TYPES;
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
            SdmxV21SchemasParser.parseGlobalElements(schemaComponents, s);
            SdmxV21SchemasParser.parseSimpleTypes(schemaComponents, s);
            SdmxV21SchemasParser.parseComplexTypes(schemaComponents, s);
        }
        return schemaComponents;
    };
    static parseGlobalElements(schemaComponents, s) {
        if (s.element) {
            let elements = s.element;
            let xsdComponentType = XSD_COMPONENTS_TYPES.GLOBAL_ELEMENT;
            schemaComponents.set(xsdComponentType, []);
            for (var e in elements) {
                schemaComponents.get(xsdComponentType).push(new XSDGlobalElement(elements[e]));
            }
        }
    };
    static parseSimpleTypes(schemaComponents, s) {
        if(s.simpleType){
            let simpleTypes = s.simpleType;
            let xsdComponentType = XSD_COMPONENTS_TYPES.SIMPLE_TYPE;
            schemaComponents.set(xsdComponentType,[]);
            for (var st in simpleTypes){
                schemaComponents.get(xsdComponentType).push(new XSDSimpleType(simpleTypes[st],
                                                        SdmxV21SchemaFacetsParser.getFacets(simpleTypes[st]),
                                                        SdmxV21SchemaEnumerationParser.getEnumerations(simpleTypes[st])));
            }
        }
    };
    static parseComplexTypes(schemaComponents, s) {
        if(s.complexType){
          let complexTypes = s.complexType;
          let xsdComponentType = XSD_COMPONENTS_TYPES.COMPLEX_TYPE;
          schemaComponents.set(xsdComponentType,[]);
          for (var ct in complexTypes){
              schemaComponents.get(xsdComponentType).push(new XSDComplexType(complexTypes[ct],
                                                      SdmxV21SchemaCompositorsParser.getCompositors(complexTypes[ct]),
                                                      SdmxV21SchemaAttributeParser.getAttributes(complexTypes[ct])));
          }
      }
    };

};

module.exports = SdmxV21SchemasParser;