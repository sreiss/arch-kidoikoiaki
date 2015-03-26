/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Transaction, qService) {
    return {
        /** Save transaction. */
        saveTransaction: function(transactionData)
        {
            var deferred = qService.defer();

            var transaction = new Transaction();
            transaction.trs_sheet = transactionData.trs_sheet;
            transaction.trs_description = transactionData.trs_description;
            transaction.trs_amount = transactionData.trs_amount;
            transaction.trs_contributor = transactionData.trs_contributor;
            transaction.trs_beneficiaries = [];
            transaction.trs_category = transactionData.trs_category;

            for(var i = 0; i < transactionData.trs_beneficiaries.length; i++)
            {
               transaction.trs_beneficiaries.push(transactionData.trs_beneficiaries[i]);
            };

            transaction.save(function(err)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(transaction);
                }
            });

            return deferred.promise;
        },

        /** Delete transaction. */
        deleteTransaction: function(transactionId)
        {
            var deferred = qService.defer();

            Transaction.findOneAndRemove({_id: transactionId}, function(err, transaction)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else if(transaction == null)
                {
                    deferred.reject(new Error('No transaction matching [TRANSACTION_ID] : ' + transactionId + "."));
                }
                else
                {
                    deferred.resolve(transaction);
                }
            });

            return deferred.promise;
        },

        /** Get transaction. */
        getTransaction: function(transactionId)
        {
            var deferred = qService.defer();

            Transaction.findOne({_id: transactionId}).exec(function (err, transaction)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else if(!transaction)
                {
                    deferred.reject(new Error('No transaction matching [TRANSACTION_ID] : ' + transactionId + "."));
                }
                else
                {
                    deferred.resolve(transaction);
                }
            });

            return deferred.promise;
        }
    };
};