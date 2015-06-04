/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var ArchSaveError = GLOBAL.ArchSaveError;
var ArchDeleteError = GLOBAL.ArchDeleteError;
var ArchFindError = GLOBAL.ArchFindError;

module.exports = function(debtService)
{
    return {
        /** Get debts. */
        getDebts: function(req, res)
        {
            // Get sheetId.
            var sheetId = req.params.sheetId;

            // Get participant.
            debtService.getDebts(sheetId).then(function(debts)
            {
                res.status(200).json({"count" : debts.length, "data" : debts});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchFindError(err.message)});
            });
        },

        /** Delete debts. */
        deleteDebts: function(req, res)
        {
            // Get sheetId.
            var sheetId = req.params.sheetId;

            // Saving category.
            debtService.deleteDebts(sheetId).then(function(result)
            {
                res.status(200).json({"count" : (result ? 1 : 0), "data" : result});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchDeleteError(err.message)});
            });
        }
    };
};
