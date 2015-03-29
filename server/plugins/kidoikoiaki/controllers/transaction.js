/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var ArchSaveError = GLOBAL.ArchSaveError;
var ArchDeleteError = GLOBAL.ArchDeleteError;
var ArchFindError = GLOBAL.ArchFindError;

module.exports = function(transactionService) {
    return {
        /** Save transaction. */
        saveTransaction: function(req, res)
        {
            // Get transaction data.
            var transactionData = req.body;

            // Saving transaction.
            transactionService.saveTransaction(transactionData).then(function(transaction)
            {
                res.status(200).json({"count" : (transaction ? 1 : 0), "data" : transaction});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchSaveError(err.message)});
            });
        },

        /** Delete transaction. */
        deleteTransaction: function(req, res)
        {
            // Get transactionId.
            var transactionId = req.params.transactionId;

            // Saving transaction.
            transactionService.deleteTransaction(transactionId).then(function(transaction)
            {
                res.status(200).json({"count" : (transaction ? 1 : 0), "data" : transaction});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchDeleteError(err.message)});
            });
        },

        /** Get transaction. */
        getTransaction: function(req, res)
        {
            // Get transactionId.
            var transactionId = req.params.transactionId;

            // Get transaction.
            transactionService.getTransaction(transactionId).then(function(transaction)
            {
                res.status(200).json({"count" : (transaction ? 1 : 0), "data" : transaction});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchFindError(err.message)});
            });
        }
    };
};
