/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(Transaction) {
    return {
        /** Save transaction. */
        saveTransaction: function(transactionData)
        {
            var deferred = Q.defer();

            var transaction = new Transaction();
            transaction.trs_sheet = transactionData.trs_sheet;
            transaction.trs_description = transactionData.trs_description;
            transaction.trs_amount = transactionData.trs_amount;
            transaction.trs_contributor = transactionData.trs_contributor._id;
            transaction.trs_beneficiaries = transactionData.trs_beneficiaries;
            transaction.trs_category = transactionData.trs_category._id;

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

        /** Update transaction. */
        updateTransaction: function(transactionData)
        {
            var deferred = Q.defer();

            Transaction.update({_id: transactionData._id},
            {
                trs_description : transactionData.trs_description,
                trs_amount : transactionData.trs_amount,
                trs_contributor : transactionData.trs_contributor._id,
                trs_beneficiaries : transactionData.trs_beneficiaries,
                trs_category : transactionData.trs_category._id
            },
            function(err, result)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        },

        /** Delete transaction. */
        deleteTransaction: function(transactionId)
        {
            var deferred = Q.defer();

            Transaction.findOneAndRemove({_id: transactionId}, function(err, transaction)
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

        /** Get transaction. */
        getTransaction: function(transactionId)
        {
            var deferred = Q.defer();

            Transaction.findOne({_id: transactionId}).populate('trs_contributor trs_beneficiaries.trs_participant trs_category').exec(function (err, transaction)
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
        }
    };
};