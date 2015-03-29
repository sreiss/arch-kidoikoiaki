/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Debt, qService) {
    return {
        /** Delete debts. */
        deleteDebts: function(sheetId)
        {
            var deferred = qService.defer();

            Debt.find({dbt_sheet: sheetId}).remove().exec(function(err, debts)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(debts);
                }
            });

            return deferred.promise;
        }
    };
};