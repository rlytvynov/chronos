const CustomError = require('../models/errors.js');
function insertionProtector(obj) {
    // Run object entries for Not allowed symbols
    for(const [key, value] of Object.entries(obj)) {
        if(/['"$%^*&=\+*?!,#\\\/\|]/.test(value))
            throw new CustomError(1021, key);    
    }
    return;
};

module.exports = insertionProtector;