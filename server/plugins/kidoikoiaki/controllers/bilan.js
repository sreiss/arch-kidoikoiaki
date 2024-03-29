/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var ArchSaveError = GLOBAL.ArchSaveError;
var ArchFindError = GLOBAL.ArchFindError;

module.exports = function(bilanService)
{
    return {
        /** Generate bilan. */
        generateBilan: function(req, res)
        {
            // Get sheetReference.
            var sheetId = req.params.sheetId;

            // Get bilan.
            bilanService.generateBilan(sheetId).then(function(debts)
            {
                res.status(200).json({"count" : debts.length, "data" : debts});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchFindError(err.message)});
            });
        }
    };
};
