const bcrypt = require('bcryptjs');

/**
 * Creates a hash based on the input given.
 * @param {*} the_input the input requested to be hashed.
 * @returns {*} the generated hash.
 */
exports.createHash = input => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(input, salt);
    return hash;
}

/**
 * Compares the input to the requested hash
 * @param {*} input the user's input that will be compared to the hash
 * @param {*} hash the hashed password that will be compared to the user's input.
 * @returns {*} a boolean value on whether the inputs match or not.
 */
exports.compareToHash = (input, hash) => {
    return bcrypt.compareSync(input, hash);
}