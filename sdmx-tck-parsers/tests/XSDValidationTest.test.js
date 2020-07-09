var SdmxXmlParser = require('../src/parsers/SdmxXmlParser.js');
const validator = require('@authenio/xsd-schema-validator');

const fs = require('fs');

const {
    validateXML,
    validateXMLWithDTD,
    validateXMLWithXSD 
  } = require("validate-with-xmllint");

describe('Tests SdmxObjects class', function () {
    it('It should return a random structure', async () => {
        
        var xmlMessage = await fs.readFileSync('./tests/resources/testXsd.xsd');
        //console.log(await validateXML("<hello>world!</hello>"));
        // validator.validateXML(xmlMessage, 'src/schema/XMLSchema.xsd', function (err, data) {      
           
        //     if (err !== null) {
        //         throw new Error("An error occurred during the XML Schema Validation.");
        //     }
        //     console.log(data)
        //     return data;
        // });
        // validateXMLWithXSD(xmlMessage,"src/schema/XMLSchema.xsd").then(
        //     (result) => {
        //     console.log(result)
        //     //resolve(result)
        // }).catch((err) => {
        //     //reject(err)
        // })
           let v= await new SdmxXmlParser().schemaValidation(xmlMessage);
           console.log(v)


     
    });
});