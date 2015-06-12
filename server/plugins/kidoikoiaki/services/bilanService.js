/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(Debt, bilanService, debtService, participantsService, transactionsService) {
    return {
        /** Generate bilan. */
        generateBilan: function(sheetId)
        {
            var deferred = Q.defer();

            console.log('## Start generate bilan.');

            // Get participants.
            participantsService.getParticipants(sheetId).then(function(participants)
            {
                console.log("Participants found : " + participants.length);

                // Get transactions.
                transactionsService.getTransactions(sheetId).then(function(transactions)
                {
                    // Algo #1
                    console.log("Transactions found : " + transactions.length);

                    var results = new Array();

                    for(var pIncr = 0; pIncr < participants.length; pIncr++)
                    {
                        var currentPersonne = participants[pIncr];
                        var give = 0;
                        var take = 0;

                        for(var tIncr = 0; tIncr < transactions.length; tIncr++)
                        {
                            var currentTransaction = transactions[tIncr];

                            // currentPersonne == currentContributor -> sum amount.
                            if(currentTransaction.trs_contributor._id.equals(currentPersonne._id))
                            {
                                give = parseFloat(give) + parseFloat(currentTransaction.trs_amount);
                            }

                            var totalTransactionWeight = 0;
                            var currentPersonneWeight = 0;
                            var isAbenef = false;

                            for(var bIncr = 0; bIncr < currentTransaction.trs_beneficiaries.length; bIncr++)
                            {
                                var currentBenef = currentTransaction.trs_beneficiaries[bIncr];

                                // currentPersonne == currentBeneficiary -> sum amount.
                                if(currentBenef.trs_participant._id.equals(currentPersonne._id))
                                {
                                    isAbenef = true;
                                    currentPersonneWeight = parseFloat(currentBenef.trs_weight);
                                }

                                // Keep current weight (calc. weight average).
                                totalTransactionWeight = parseFloat(totalTransactionWeight) + parseFloat(currentBenef.trs_weight);
                            }

                            if(isAbenef)
                            {
                                take = parseFloat(take) + parseFloat((currentTransaction.trs_amount / totalTransactionWeight) * currentPersonneWeight);
                            }
                        }

                        results.push({participant :currentPersonne, amount : parseFloat(take - give)});
                    }

                    // Useless to sort ?
                    results = results.sort(function(a,b)
                    {
                        return a.amount - b.amount;
                    });

                    // Distinct giver & taker.
                    var givers = new Array();
                    var takers = new Array();

                    results.forEach(function(result)
                    {
                        if(result.amount > 0)
                        {
                            givers.push(result);
                        }
                        else if(result.amount < 0)
                        {
                            takers.push(result);
                        }
                    });

                    bilanService.testEqual(givers, takers, sheetId).then(function()
                    {
                       deferred.resolve(true);
                    })
                    .catch(function(err)
                    {
                        deferred.reject(err);
                    });
                })
                .catch(function(err)
                {
                    deferred.reject(err);
                });
            })
            .catch(function(err)
            {
                deferred.reject(err);
            });

            return deferred.promise;
        },

        testEqual: function(givers, takers, sheetId)
        {
            var deferred = Q.defer();

            for(var i = 0; i < givers.length; i++)
            {
                for(var u = 0; u < takers.length; u++)
                {
                    var giverAmountAbs = Math.abs(parseFloat(givers[i].amount));
                    var takerAmountAbs = Math.abs(parseFloat(takers[u].amount));

                    if(giverAmountAbs == takerAmountAbs)
                    {
                        var debt = new Debt(
                        {
                            dbt_sheet: sheetId,
                            dbt_giver: givers[i].participant._id,
                            dbt_taker: takers[u].participant._id,
                            dbt_amount: giverAmountAbs
                        });

                        debt.save(function(err)
                        {
                            if(err)
                            {
                                deferred.reject(err);
                            }
                            else
                            {
                                console.log('New debt saved (' + debt.dbt_amount + '€)');
                            }
                        });

                        givers.splice(i, 1);
                        takers.splice(u, 1);
                    }
                }
            }

            if(givers.length > 0 && takers.length > 0)
            {
                bilanService.testProvide(givers, takers, sheetId).then(function()
                {
                    deferred.resolve(true);
                })
                .catch(function(err)
                {
                    deferred.reject(err);
                });
            }
            else
            {
                deferred.resolve(true);
            }

            return deferred.promise;
        },

        testProvide: function(givers, takers, sheetId)
        {
            var deferred = Q.defer();

            var status = false;
            var tmpGivers = givers;
            var tmpTakers = takers;

            (function()
            {
                for(var i = 0; i < givers.length; i++)
                {
                    for(var u = 0; u < takers.length; u++)
                    {
                        var debt = new Debt();
                        var giverAmountAbs = Math.abs(parseFloat(givers[i].amount));
                        var takerAmountAbs = Math.abs(parseFloat(takers[u].amount));

                        if(giverAmountAbs < takerAmountAbs)
                        {
                            debt.dbt_sheet = sheetId,
                            debt.dbt_giver = givers[i].participant._id,
                            debt.dbt_taker = takers[u].participant._id;
                            debt.dbt_amount = giverAmountAbs;

                            takers[u].amount = takerAmountAbs - giverAmountAbs;
                            givers.splice(i, 1);
                        }
                        else if(giverAmountAbs > takerAmountAbs)
                        {
                            debt.dbt_sheet = sheetId,
                            debt.dbt_giver = givers[i].participant._id,
                            debt.dbt_taker = takers[u].participant._id;
                            debt.dbt_amount = takerAmountAbs;

                            givers[i].amount = giverAmountAbs - takerAmountAbs;
                            takers.splice(u, 1);
                        }

                        for(var ii = 0; ii < givers.length; ii++)
                        {
                            for(var uu = 0; uu < takers.length; uu++)
                            {
                                var giverAmountAbs = Math.abs(parseFloat(givers[ii].amount));
                                var takerAmountAbs = Math.abs(parseFloat(takers[uu].amount));

                                if(giverAmountAbs == takerAmountAbs)
                                {
                                    status = true;

                                    debt.save(function(err)
                                    {
                                        if(err)
                                        {
                                            deferred.reject(err);
                                            return;
                                        }
                                        else
                                        {
                                            console.log('New debt saved (' + debt.dbt_amount + '€)');

                                            if(givers.length > 0 && takers.length > 0)
                                            {
                                                bilanService.testEqual(givers, takers, sheetId).then(function(result)
                                                {
                                                    deferred.resolve(result);
                                                    return;
                                                })
                                                .catch(function(err)
                                                {
                                                    deferred.reject(err);
                                                    return;
                                                });
                                            }
                                            else
                                            {
                                              return;
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            })();

            if(!status && (givers.length > 0 && takers.length > 0))
            {
                bilanService.noOptimisation(tmpGivers, tmpTakers, sheetId).then(function(result)
                {
                    deferred.resolve(result);
                })
                .catch(function(err)
                {
                    deferred.reject(err);
                });
            }
            else
            {
                deferred.resolve(true);
            }

            return deferred.promise;
        },

        noOptimisation: function(givers, takers, sheetId)
        {
            var deferred = Q.defer();

            (function()
            {
                for(var i = 0; i < givers.length; i++)
                {
                    for(var u = 0; u < takers.length; u++)
                    {
                        var giverAmountAbs = Math.abs(parseFloat(givers[i].amount));
                        var takerAmountAbs = Math.abs(parseFloat(takers[u].amount));

                        if(giverAmountAbs < takerAmountAbs)
                        {
                            var debt = new Debt(
                            {
                                dbt_sheet: sheetId,
                                dbt_giver: givers[i].participant._id,
                                dbt_taker: takers[u].participant._id,
                                dbt_amount: giverAmountAbs
                            });

                            debt.save(function(err)
                            {
                                if(err)
                                {
                                    deferred.reject(err);
                                }
                                else
                                {
                                    console.log('New debt saved (' + debt.dbt_amount + '€)');
                                }
                            });

                            takers[u].amount = takerAmountAbs - giverAmountAbs;
                            givers.splice(i, 1);
                        }
                        else if(giverAmountAbs > takerAmountAbs)
                        {
                            var debt = new Debt(
                            {
                                dbt_sheet: sheetId,
                                dbt_giver: givers[i].participant._id,
                                dbt_taker: takers[u].participant._id,
                                dbt_amount: takerAmountAbs
                            });

                            debt.save(function(err)
                            {
                                if(err)
                                {
                                    deferred.reject(err);
                                }
                                else
                                {
                                    console.log('New debt saved (' + debt.dbt_amount + '€)');
                                }
                            });

                            givers[i].amount = giverAmountAbs - takerAmountAbs;
                            takers.splice(u, 1);
                        }
                    }
                }
            })();

            if(givers.length > 0 && takers.length > 0)
            {
                bilanService.testEqual(givers, takers, sheetId).then(function(result)
                {
                    deferred.resolve(result);
                })
                .catch(function(err)
                {
                    deferred.reject(err);
                });
            }
            else
            {
                deferred.resolve(true);
            }

            return deferred.promise;
        }
    };
};