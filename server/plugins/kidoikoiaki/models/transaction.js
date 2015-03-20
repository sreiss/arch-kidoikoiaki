/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Types) {
    return {
        schema: {
            trs_uri: {type: String, required: true},
            trs_description: {type: String},
            trs_amount: {type: Number, min: 0, default: 0, required: true},
            trs_contributor: {type: Types.ObjectId, ref: 'Participant', required: true},
            trs_beneficiary: { type: Types.ObjectId, ref: 'Beneficiary', required: true},
            trs_creation_date: {type: Date, default: Date.now, required: true},
            trs_categorie: {type: Types.ObjectId, ref: 'Category', required: true}
        }
    };
};