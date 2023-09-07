var Utils = require('../utils/Utils.js');

const EXPORT_FORMATS = {
    EXCEL:"EXCEL",
    XML:"XML",
    JSON:"JSON",

    getValues() {
        let formats = Object.values(this).filter((value) => {
            return typeof value !== 'function';
        });
        return formats;
    },

    isValidFormat(format){
        return Utils.isDefined(Object.values(this).filter(v =>{v===format})) 
    }
}

module.exports.EXPORT_FORMATS = Object.freeze(EXPORT_FORMATS)