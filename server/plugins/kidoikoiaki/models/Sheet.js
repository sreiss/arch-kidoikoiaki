/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function() {
    return {
        schema:
        {
            she_name: {type:String},
            she_reference_private: {type: String, unique: true, required: true},
            she_reference_public: {type: String, unique: true, required: true},
            she_email: {type: String, required: true},
            she_ip: {type: String, required: true},
            she_creation_date: {type: Date, default: Date.now, required: true},
            she_last_visit: {type: Date, default: Date.now, required: true}
        },
        priority: 1
    };
};