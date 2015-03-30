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
        checkSheet: function(req, res, next)
        {
            // Get sheet data.
            var sheetData = req.body;

            // Check sheet reference.
            var sheetReference = sheetData.she_reference || '';
            if(!validator.isLength(sheetReference, 5))
            {
                throw new ArchParameterError("Sheet reference must contain at least 5 chars.")
            }

            next();
        },

        checkSheetReference: function(req, res, next)
        {
            // Get sheet reference.
            var sheetReference = req.params.sheetReference || '';

            if(!validator.isLength(sheetReference, 5))
            {
                throw new ArchParameterError("Sheet reference must contain at least 5 chars.")
            }

            next();
        }
    };
};
