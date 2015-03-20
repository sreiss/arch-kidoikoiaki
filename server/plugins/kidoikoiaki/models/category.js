/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Types) {
    return {
        schema: {
            ctg_name: {type: String, required: true},
            ctg_description: {type: String}
        }
    };
};