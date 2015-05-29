/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Types) {
    return {
        schema:
        {
            prt_sheet: { type: Types.ObjectId, ref: 'Sheet', required: true},
            prt_fname: {type: String, required: true},
            prt_lname: {type: String, required: true},
            prt_email: {type: String, required: true},
            prt_share: {type: Number, min: 0, default: 0, required: true}
        },
        priority: 3
    };
};