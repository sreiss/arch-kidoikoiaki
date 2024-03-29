/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(Transaction) {
    return {
        /** Get all transactions. */
        getTransactions: function(sheetId)
        {
            var deferred = Q.defer();

            Transaction.find({trs_sheet: sheetId}).populate('trs_sheet trs_contributor trs_beneficiaries.trs_participant trs_category').exec(function (err, transactions)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(transactions);
                }
            });

            return deferred.promise;
        }
    };
};