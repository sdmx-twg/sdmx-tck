const TEST_INDEX = require('sdmx-tck-api').constants.TEST_INDEX;

let Requestor = require('./Requestor');
let RegistrationRequestor = require('./RegistrationRequestor');

class RequestorFactory {
    static getRequestor(index) {
        if (index === TEST_INDEX.Registration) {
            return RegistrationRequestor;
        } else {
            return Requestor;
        }
    }
};
module.exports = RequestorFactory;