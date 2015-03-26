/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Types) {
    return {
        schema: {
            she_reference: {type: String, unique: true, required: true},
            she_creation_date: {type: Date, default: Date.now, required: true}
        }
    };
};