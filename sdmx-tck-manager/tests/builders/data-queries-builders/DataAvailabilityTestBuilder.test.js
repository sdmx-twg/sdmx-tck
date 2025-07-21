var DataAvailabilityTestBuilder = require('./../../../src/builders/data-queries-builders/DataAvailabilityTestBuilder.js')
var assert = require('assert');

describe('Check list of data availability tests', function () {
    it('It should return 16 tests for API versions < v2.0.0', async () => {
        let index = 'Data';
        let x = {numOfTests: 0};
        let apiVersion = 'v1.4.0';

        const tests = DataAvailabilityTestBuilder.getTests(index, x, apiVersion);
        assert.equal(x.numOfTests, 16, "16 tests are expected to be created.");
    });

    it('It should return 48 tests for API versions >= v2.0.0', async () => {
        let index = 'Data';
        let x = {numOfTests: 0};
        let apiVersion = 'v2.0.0';

        const tests = DataAvailabilityTestBuilder.getTests(index, x, apiVersion);
        assert.equal(x.numOfTests, 48, "48 tests are expected to be created.");
    });
});