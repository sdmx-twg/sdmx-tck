const RegistrationTestsDataBuilder = require('../src/builders/registry-queries-builders/RegistrationTestsDataBuilder.js');
const assert = require("assert");

describe('Tests prerequisites for all data registration tests', function () {
    context('With api version v2.0.0', function () {
        let endpoint = "https://demo11.metadatatechnology.com/FusionRegistry/sdmx/v2";
        let apiVersion = "v2.0.0";
        describe('Tests structure refs', function () {
            it('It should assert structure refs', async () => {
                let data = await RegistrationTestsDataBuilder.buildData(endpoint, apiVersion);
                console.log("data=", data)
                if (data && data.provisionagreement && data.dataflow && data.datastructure) {
                    assert.ok(true);
                } else {
                    assert.ok(false);
                }
            });
        });
    });
});