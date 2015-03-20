/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Types) {
    return {
        schema: {
            bnf_participant : { type: Types.ObjectId, ref: 'Participant', required: true},
            bnf_share : {type: Number, min: 0, default: 0}
        }
    };
};