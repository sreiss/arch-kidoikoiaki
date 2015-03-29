/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Debt, bilanService, debtService, participantsService, transactionsService, qService) {
    return {
        /** Generate bilan. */
        generateBilan: function(sheetId)
        {
            var deferred = qService.defer();

            // Remove previous debts.
            debtService.deleteDebts(sheetId).then(function(debts)
            {
                console.log("Delete previous debts : " + debts);

                // Get transactions.
                participantsService.getParticipants(sheetId).then(function(participants)
                {
                    console.log("Participants found : " + participants.length);

                    // Get transactions.
                    transactionsService.getTransactions(sheetId).then(function(transactions)
                    {
                        console.log("Transactions found : " + transactions.length);

                        // ADD ALGO HERE !

                    })
                    .catch(function(err)
                    {
                        deferred.reject(err);
                    })
                })
                .catch(function(err)
                {
                    deferred.reject(err);
                })
            })
            .catch(function(err)
            {
                deferred.reject(err);
            });

            return deferred.promise;
        },

        /** Get bilan. */
        getBilan: function(sheetId)
        {
            var deferred = qService.defer();

            Debt.find({dbt_sheet: sheetId}).exec(function (err, debts)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else if(debts.length == 0)
                {
                    bilanService.generateBilan(sheetId).then(function(debts)
                    {
                        deferred.resolve(debts);
                    })
                    .catch(function(err)
                    {
                        deferred.reject(err);
                    });
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