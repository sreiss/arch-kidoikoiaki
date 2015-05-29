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

            // Sheet reference not empty.
            var sheetReference = sheet.she_reference || '';
            if(!validator.isLength(sheetReference, 5))
            {
                throw new ArchParameterError("Sheet reference must contain at least 5 chars.")
            }

            // Sheet email must valid.
            var sheetEmail = sheet.she_email || '';
            if(!validator.isEmail(sheetEmail))
            {
                throw new ArchParameterError("Sheet contact email isn't a valid mail address.")
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

            // Sheet reference not empty.
            var sheetReference = sheet.she_reference || '';
            if(!validator.isLength(sheetReference, 5))
            {
                throw new ArchParameterError("Sheet reference must contain at least 5 chars.")
            }

            // Sheet email must valid.
            var sheetEmail = sheet.she_email || '';
            if(!validator.isEmail(sheetEmail))
            {
                throw new ArchParameterError("Sheet contact email isn't a valid mail address.")
            }

            next();
        }
    };
};
