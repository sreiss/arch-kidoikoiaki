/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var ArchSaveError = GLOBAL.ArchSaveError;
var ArchFindError = GLOBAL.ArchFindError;

module.exports = function(sheetService)
{
    return {
        /** Save sheet. */
        saveSheet: function(req, res)
        {
            // Get sheetData.
            var sheetData = req.body;

            // Saving sheet.
            sheetService.saveSheet(sheetData).then(function(sheet)
            {
                res.status(200).json({"count" : (sheet ? 1 : 0), "data" : sheet});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchSaveError(err.message)});
            });
        },

        /** Update sheet. */
        updateSheet: function(req, res)
        {
            // Get sheet data.
            var sheetData = req.body.sheet;

            // Saving participant.
            sheetService.updateSheet(sheetData).then(function(result)
            {
                res.status(200).json({"count" : result.ok, "data" : result});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchSaveError(err.message)});
            });
        },

        /** Get sheet. */
        getSheet: function(req, res)
        {
            // Get sheetReference.
            var sheetReference = req.params.sheetReference;

            // Get sheet.
            sheetService.getSheet(sheetReference).then(function(sheet)
            {
                res.status(200).json({"count" : (sheet ? 1 : 0), "data" : sheet});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchFindError(err.message)});
            });
        }
    };
};
