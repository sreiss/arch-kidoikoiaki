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
        checkSheetReference: function(req, res, next)
        {
            // Get sheet reference.
            var sheetReference = req.params.sheetReference || '';

            if(!validator.isLength(sheetReference, 5))
            {
                throw new ArchParameterError("Sheet reference must contain at least 5 chars.")
            }

            next();
        },

        checkUpdateSheet: function(req, res, next)
        {
            // Get sheet reference.
            var sheet = req.body.sheet || {};

            if(!validator.isLength(sheet.she_name, 5))
            {
                throw new ArchParameterError("Sheet name must contain at least 5 chars.")
            }

            if(!validator.isLength(sheet.she_reference, 5))
            {
                throw new ArchParameterError("Sheet reference must contain at least 5 chars.")
            }

            next();
        }
    };
};
