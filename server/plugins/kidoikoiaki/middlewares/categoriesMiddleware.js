/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var validator = require('validator');
var ArchParameterError = GLOBAL.ArchParameterError;

module.exports = function() {
    return {
        checkSheetId: function(req, res, next)
        {
            // Get shet id.
            var sheetId = req.params.sheetId || '';

            if(!validator.isMongoId(sheetId))
            {
                throw new ArchParameterError("Sheet ID isn't a valid MongoId.");
            }

            next();
        }
    };
};
