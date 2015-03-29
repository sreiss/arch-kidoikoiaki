/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Types) {
    return {
        schema: {
            dbt_sheet : { type: Types.ObjectId, ref: 'Sheet', required: true},
            dbt_giver : { type: Types.ObjectId, ref: 'Participant', required: true},
            dbt_taker : { type: Types.ObjectId, ref: 'Participant', required: true},
            dbt_amount : {type: Number, min: 0, default: 0}
        }
    };
};