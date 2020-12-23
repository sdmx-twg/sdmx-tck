var DateTransformations = require('sdmx-tck-api').utils.DateTransformations;


describe('Tests Date Transformations', function () {
    it('It should print date period for weeks of a year', async () => {
       console.log(DateTransformations._getFullDateFromWeeks('2012',5))
    });

    it('It should print date period for quarters of a year', async () => {
        console.log(DateTransformations._getFullDateFromQuarter('2012',3))
    });

    it('It should print date period for semiannual of a year', async () => {
    console.log(DateTransformations._getFullDateFromSemiannual('2012',2))
    });

    it('It should print the last day of date', async () => {
        console.log(DateTransformations.getLastDayOfDate('2012'))
    });
});