const crypto = require('crypto');
const SALT = 'ifjvs489fh3q44t3utwqasf20d3aef';
module.exports = (toBeHashed) => {
    return crypto.pbkdf2Sync(toBeHashed, SALT, 200, 64, `sha512`).toString(`hex`);
}