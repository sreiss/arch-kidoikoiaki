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
            if(!validator.isLength(sheetReference, 1))
            {
                throw new ArchParameterError("Sheet reference can't be empty.")
            }

            next();
        },

        checkSaveSheet: function(req, res, next)
        {
            // Get sheet reference.
            var sheet = req.body || {};

            // Sheet name not empty.
            var sheetName = sheet.she_name || '';
            if(!validator.isLength(sheetName, 1))
            {
                throw new ArchParameterError("Sheet name can't be empty.")
            }

            // Define sheet ip.
            req.body.she_ip = req.connection.remoteAddress;

            next();
        },

        checkUpdateSheet: function(req, res, next)
        {
            // Get sheet reference.
            var sheet = req.body.sheet || {};

            // Sheet name not empty.
            var sheetName = sheet.she_name || '';
            if(!validator.isLength(sheetName, 1))
            {
                throw new ArchParameterError("Sheet name can't be empty.")
            }

            next();
        }
    };
};
