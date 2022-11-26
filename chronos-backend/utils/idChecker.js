const CustomError = require('../models/errors.js');
const idChecker = (id, errCode) => {
    if (!id || id === null || isNaN(id))
        throw new CustomError(errCode)
}
module.exports = idChecker;