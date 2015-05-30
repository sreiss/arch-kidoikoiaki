/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(Debt, bilanService, debtService, participantsService, transactionsService) {
    return {
        /** Get bilan. */
        getBilan: function(sheetId)
        {
            var deferred = Q.defer();

            console.log('## Delete previous debts.');
            debtService.deleteDebts(sheetId)
                .then(bilanService.generateBilan(sheetId))
                .then(debtService.getDebts(sheetId))
                .then(function(debts) {
                    deferred.resolve(debts);
                })
                .catch(function(err) {
                    deferred.reject(err);
                });
            /*
            debtService.deleteDebts(sheetId).then(function()
            {
                console.log('## Start generate bilan.');
                bilanService.generateBilan(sheetId).then(function()
                {
                    console.log('## Stop generate bilan.');

                    console.log('## Get all debts.');
                    debtService.getDebts(sheetId).then(function(debts)
                    {
                        deferred.resolve(debts);
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
            */

            return deferred.promise;
        },

        /** Generate bilan. */
        generateBilan: function(sheetId)
        {
            var deferred = Q.defer();

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

                        results.push({participant :currentPersonne, amount : parseFloat(take - give).toFixed(2)});
                    }

                    // Algo #2

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
                    });
                })
            })
            .catch(function(err)
            {
                deferred.reject(err);
            });

            return deferred.promise;
        },

        testEqual: function(givers, takers, uri)
        {
            var deferred = Q.defer();

            for(var i = 0; i < givers.length; i++)
            {
                for(var u = 0; u < takers.length; u++)
                {
                    var giverAmountAbs = Math.abs(parseFloat(givers[i].amount).toFixed(2));
                    var takerAmountAbs = Math.abs(parseFloat(takers[u].amount).toFixed(2));

                    if(giverAmountAbs == takerAmountAbs)
                    {
                        var debt = new Debt(
                        {
                            dbt_sheet: uri,
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
                        });

                        givers.splice(i, 1);
                        takers.splice(u, 1);
                    }
                }
            }

            if(givers.length > 0 || takers.length > 0)
            {
                bilanService.testProvide(givers, takers, uri).then(function()
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

        testProvide: function(givers, takers, uri)
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
                        var giverAmountAbs = Math.abs(parseFloat(givers[i].amount).toFixed(2));
                        var takerAmountAbs = Math.abs(parseFloat(takers[u].amount).toFixed(2));

                        if(giverAmountAbs < takerAmountAbs)
                        {
                            debt.dbt_sheet = uri,
                            debt.dbt_giver = givers[i].participant._id,
                            debt.dbt_taker = takers[u].participant._id;
                            debt.dbt_amount = giverAmountAbs;

                            takers[u].amount = takerAmountAbs - giverAmountAbs;
                            givers.splice(i, 1);
                        }
                        else if(giverAmountAbs > takerAmountAbs)
                        {
                            debt.dbt_sheet = uri,
                            debt.dbt_giver = givers[i].participant._id,
                            debt.dbt_taker = takers[u].participant._id;
                            debt.dbt_amount = takerAmountAbs;

                            givers[u].amount = giverAmountAbs - takerAmountAbs;
                            takers.splice(u, 1);
                        }

                        for(var ii = 0; ii < givers.length; ii++)
                        {
                            for(var uu = 0; uu < takers.length; uu++)
                            {
                                var giverAmountAbs = Math.abs(parseFloat(givers[ii].amount).toFixed(2));
                                var takerAmountAbs = Math.abs(parseFloat(takers[uu].amount).toFixed(2));

                                if(giverAmountAbs == takerAmountAbs)
                                {
                                    status = true;

                                    debt.save(function(err)
                                    {
                                        if(err)
                                        {
                                            deferred.reject(err);
                                        }
                                        else
                                        {
                                            if(givers.length > 0 || takers.length > 0)
                                            {
                                                bilanService.testEqual(givers, takers, uri).then(function(result)
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

            if(!status && (givers.length > 0 || takers.length > 0))
            {
                bilanService.noOptimisation(tmpGivers, tmpTakers, uri).then(function(result)
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

        noOptimisation: function(givers, takers, uri)
        {
            var deferred = Q.defer();

            (function()
            {
                for(var i = 0; i < givers.length; i++)
                {
                    for(var u = 0; u < takers.length; u++)
                    {
                        var giverAmountAbs = Math.abs(parseFloat(givers[ii].amount).toFixed(2));
                        var takerAmountAbs = Math.abs(parseFloat(takers[uu].amount).toFixed(2));

                        if(giverAmountAbs < takerAmountAbs)
                        {
                            var debt = new Debt(
                            {
                                dbt_sheet: uri,
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
                            });

                            takers[u].amount = takerAmountAbs - giverAmountAbs;
                            givers.splice(i, 1);
                        }
                        else if(giverAmountAbs > takerAmountAbs)
                        {
                            var newDebt = new Debt(
                            {
                                dbt_sheet: uri,
                                dbt_giver: givers[i][0]._id,
                                dbt_taker: takers[u][0]._id,
                                dbt_amount: takerAmountAbs
                            });

                            newDebt.save(function(err)
                            {
                                deferred.reject(err);
                            });

                            givers[i].amount = giverAmountAbs - takerAmountAbs;
                            takers.splice(u, 1);
                        }

                        if(givers.length > 0 || takers.length > 0)
                        {
                            bilanService.testEqual(givers, takers, uri).then(function(result)
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
                            return;
                        }
                    }
                }
            })();

            return deferred.promise;
        }
    };
};