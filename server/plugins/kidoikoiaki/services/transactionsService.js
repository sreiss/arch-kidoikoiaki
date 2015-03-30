/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Transaction, qService) {
    return {
        /** Get all transactions. */
        getTransactions: function(sheetId)
        {
            var deferred = qService.defer();

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