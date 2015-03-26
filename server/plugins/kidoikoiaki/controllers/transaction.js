/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(transactionService) {
    return {
        /** Save transaction. */
        saveTransaction: function(req, res)
        {
            // Get transaction data.
            var transactionData = req.body;

            if(transactionData)
            {
                // Saving transaction.
                transactionService.saveTransaction(transactionData).then(function(transaction)
                {
                    res.status(200).json({"count" : 1, "data" : transaction});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "TransactionController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "TransactionController", "status" : 400});
            }
        },

        /** Delete transaction. */
        deleteTransaction: function(req, res)
        {
            // Get transactionId.
            var transactionId = req.params.transactionId;

            if(transactionId)
            {
                // Saving transaction.
                transactionService.deleteTransaction(transactionId).then(function(transaction)
                {
                    res.status(200).json({"count" : 1, "data" : transaction});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "TransactionController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "TransactionController", "status" : 400});
            }
        },

        /** Get transaction. */
        getTransaction: function(req, res)
        {
            // Get transactionId.
            var transactionId = req.params.transactionId;

            if(transactionId)
            {
                // Get transaction.
                transactionService.getTransaction(transactionId).then(function(transaction)
                {
                    res.status(200).json({"count" : 1, "data" : transaction});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "TransactionController", "status" : 400});
                });
            }
            else
            {
                // Get categories.
                transactionService.getCategories().then(function(categories)
                {
                    res.status(200).json({"count" : categories.length, "data" : categories});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "TransactionController", "status" : 400});
                });
            }
        }
    };
};
