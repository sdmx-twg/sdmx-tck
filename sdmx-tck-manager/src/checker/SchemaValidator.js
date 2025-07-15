const validator = require('@authenio/xsd-schema-validator');

class SchemaValidator {
    // Validates the an XSD string against the XMLSchema files
    schemaValidation(xsdMessage) {
        return new Promise((resolve, reject) => {
            validator.validateXML(xsdMessage, 'schemas/XMLSchema.xsd', function (err, data) {
                if (err !== null) {
                    reject("An error occurred during the XSD Validation.");
                }
                resolve(data);
            });
        });
    };
};
module.exports = SchemaValidator;