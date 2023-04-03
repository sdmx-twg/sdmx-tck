var DateTransformations = require('../src/utils/DateTransformations.js');


describe('Tests Date Transformations', function () {
    it('It should assert date period for weeks of a year', async () => {
       console.assert(DateTransformations._getFullDateFromWeeks('2012',5).from === '2012-01-29')
       console.assert(DateTransformations._getFullDateFromWeeks('2012',5).until === '2012-02-04')
    });

    it('It should assert date period for quarters of a year', async () => {

        console.assert(DateTransformations._getFullDateFromQuarter('2012',3).from === '2012-07-01')
        console.assert(DateTransformations._getFullDateFromQuarter('2012',3).until === '2012-09-30')
    });

    it('It should assert date period for semiannual of a year', async () => {

        console.assert(DateTransformations._getFullDateFromSemiannual('2012',2).from === '2012-07-01')
        console.assert(DateTransformations._getFullDateFromSemiannual('2012',2).until === '2012-12-31')
    });

    it('It should assert the last day of date', async () => {
        console.assert(DateTransformations.getLastDayOfDate('2012').toString() == new Date(Date.UTC(2012, 11, 31)).toString())
    });
});