/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var ArchFindError = GLOBAL.ArchFindError;

module.exports = function(transactionsService) {
    return {
        /** Get transactions. */
        getTransactions: function(req, res)
        {
            // Get sheetId.
            var sheetId = req.params.sheetId;

            // Get transaction.
            transactionsService.getTransactions(sheetId).then(function(transactions)
            {
                res.status(200).json({"count" : transactions.length, "data" : transactions});
            },
            function(err)
            {
                throw({"message" : err.message, "type" : "TransactionsController", "status" : 400});
            });
        }
    };
};
