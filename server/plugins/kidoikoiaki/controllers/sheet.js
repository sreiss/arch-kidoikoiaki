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
                res.status(200).json({"count" : 1, "data" : sheet});
            },
            function(err)
            {
                throw new ArchSaveError(err.message);
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
                res.status(200).json({"count" : 1, "data" : sheet});
            },
            function(err)
            {
                throw new ArchFindError(err.message);
            });
        }
    };
};
