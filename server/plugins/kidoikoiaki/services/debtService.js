/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(Debt) {
    return {
        /** Get debts. */
        getDebts: function(sheetId)
        {
            var deferred = Q.defer();

            Debt.find({dbt_sheet: sheetId}).populate('dbt_giver dbt_taker').exec(function(err, debts)
            {
                if(err)
                {
                    console.log('## Get new debts (fail).');
                    deferred.reject(err);
                }
                else
                {
                    console.log('## Get new debts (success).');
                    deferred.resolve(debts);
                }
            });

            return deferred.promise;
        },

        /** Delete debts. */
        deleteDebts: function(sheetId)
        {
            var deferred = Q.defer();

            Debt.find({dbt_sheet: sheetId}).remove().exec(function(err, debts)
            {
                if(err)
                {
                    console.log('## Delete previous debts (fail).');
                    deferred.reject(err);
                }
                else
                {
                    console.log('## Delete previous debts (success).');
                    deferred.resolve(debts);
                }
            });

            return deferred.promise;
        }
    };
};