/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(transactionsService) {
    return {
        /** Get transactions. */
        getTransactions: function(req, res)
        {
            // Get sheetId.
            var sheetId = req.params.sheetId;

            if(sheetId)
            {
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
            else
            {
                throw({"message" : "Missing parameters.", "type" : "TransactionsController", "status" : 400});
            }
        }
    };
};
