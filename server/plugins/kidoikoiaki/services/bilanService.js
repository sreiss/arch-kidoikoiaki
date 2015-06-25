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
                    console.log("Transactions found : " + transactions.length);

                    var moneyers = new Array();
                    var givers = new Array();
                    var takers = new Array();

                    for(var pIncr = 0; pIncr < participants.length; pIncr++)
                    {
                        var give = 0;
                        var take = 0;

                        for(var tIncr = 0; tIncr < transactions.length; tIncr++)
                        {
                            // currentPersonne == currentContributor -> sum amount.
                            if(transactions[tIncr].trs_contributor._id.equals(participants[pIncr]._id))
                            {
                                give = parseFloat(give) + parseFloat(transactions[tIncr].trs_amount);
                            }

                            var totalTransactionWeight = 0;
                            var currentPersonneWeight = 0;
                            var isAbenef = false;

                            for(var bIncr = 0; bIncr < transactions[tIncr].trs_beneficiaries.length; bIncr++)
                            {
                                // currentPersonne == currentBeneficiary.
                                if(transactions[tIncr].trs_beneficiaries[bIncr].trs_participant._id.equals(participants[pIncr]._id))
                                {
                                    isAbenef = true;
                                    currentPersonneWeight = parseInt(transactions[tIncr].trs_beneficiaries[bIncr].trs_weight);
                                }

                                // Sum beneficiaries weights.
                                totalTransactionWeight = parseInt(totalTransactionWeight) + parseInt(transactions[tIncr].trs_beneficiaries[bIncr].trs_weight);
                            }

                            if(isAbenef)
                            {
                                take = parseFloat(take) + parseFloat((transactions[tIncr].trs_amount / totalTransactionWeight) * currentPersonneWeight);
                            }
                        }

                        moneyers.push({participant : participants[pIncr], amount : parseFloat(take - give), consumed : false});
                    }

                    moneyers.sort(function(a, b)
                    {
                       return b.amount - a.amount;
                    });

                    for(var i = 0; i < moneyers.length; i++)
                    {
                        if(moneyers[i].amount > 0)
                        {
                            givers.push(moneyers[i]);
                        }
                        else if(amount < 0)
                        {
                            takers.push(moneyers[i]);
                        }
                    }

                    bilanService.testEqual(givers, takers, sheetId).then(function()
                    {
                       deferred.resolve('END_TEST_EQUAL');
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
                if(givers[i].consumed === false)
                {
                    for(var u = 0; u < takers.length; u++)
                    {
                        if(takers[u].consumed === false)
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
                                        console.log('New debt saved (' + debt.dbt_amount + '€) - TEST_EQUAL');
                                    }
                                });

                                givers[i].consumed = true;
                                takers[u].consumed = true;
                            }
                        }
                    }
                }
            }

            if(this.notConsumedLeft(givers) && this.notConsumedLeft(takers))
            {
                bilanService.testProvide(givers, takers, sheetId).then(function()
                {
                    deferred.resolve('END_TEST_PROVIDE');
                })
                .catch(function(err)
                {
                    deferred.reject(err);
                });
            }
            else
            {
                deferred.resolve('END_TEST_EQUAL');
            }

            return deferred.promise;
        },

        testProvide: function(givers, takers, sheetId)
        {
            var deferred = Q.defer();

            var status = false;
            var tmpGivers = JSON.parse(JSON.stringify(givers));
            var tmpTakers = JSON.parse(JSON.stringify(takers));

            (function()
            {
                for(var i = 0; i < givers.length; i++)
                {
                    if(givers[i].consumed === false)
                    {
                        for(var u = 0; u < takers.length; u++)
                        {
                            if(takers[u].consumed === false)
                            {
                                var consumedPersonne = {};
                                var giverAmountAbs = Math.abs(parseFloat(givers[i].amount));
                                var takerAmountAbs = Math.abs(parseFloat(takers[u].amount));

                                var debt = new Debt(
                                {
                                    dbt_sheet : sheetId,
                                    dbt_giver : givers[i].participant._id,
                                    dbt_taker : takers[u].participant._id
                                });

                                if(giverAmountAbs < takerAmountAbs)
                                {
                                    consumedPersonne = givers[i];
                                    debt.dbt_amount = giverAmountAbs;
                                    takers[u].amount = takerAmountAbs - giverAmountAbs;
                                }
                                else if(giverAmountAbs > takerAmountAbs)
                                {
                                    consumedPersonne = takers[u];
                                    debt.dbt_amount = takerAmountAbs;
                                    givers[i].amount = giverAmountAbs - takerAmountAbs;
                                }
                                else
                                {
                                    continue;
                                }

                                for(var ii = 0; ii < givers.length; ii++)
                                {
                                    if(givers[ii].consumed === false)
                                    {
                                        for(var uu = 0; uu < takers.length; uu++)
                                        {
                                            if(takers[uu].consumed === false)
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
                                                            console.log('New debt saved (' + debt.dbt_amount + '€) - TEST_PROVIDE');
                                                            consumedPersonne.consumed = true;
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })();


            if(this.notConsumedLeft(givers) && this.notConsumedLeft(takers))
            {
                if(status === false)
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
                    bilanService.testEqual(givers, takers, sheetId).then(function(result)
                    {
                        deferred.resolve(result);
                    })
                    .catch(function(err)
                    {
                        deferred.reject(err);
                    });
                }
            }
            else
            {
                deferred.resolve('END_TEST_PROVIDE');
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
                    if(givers[i].consumed === false)
                    {
                        for(var u = 0; u < takers.length; u++)
                        {
                            if(takers[u].consumed === false)
                            {
                                var giverAmountAbs = Math.abs(parseFloat(givers[i].amount));
                                var takerAmountAbs = Math.abs(parseFloat(takers[u].amount));

                                var debt = new Debt(
                                {
                                    dbt_sheet: sheetId,
                                    dbt_giver: givers[i].participant._id,
                                    dbt_taker: takers[u].participant._id,
                                });

                                if(giverAmountAbs < takerAmountAbs)
                                {
                                    debt.dbt_amount = giverAmountAbs;
                                    takers[u].amount = takerAmountAbs - giverAmountAbs;
                                    givers[i].consumed = true;
                                }
                                else if(giverAmountAbs > takerAmountAbs)
                                {
                                    debt.dbt_amount = takerAmountAbs;
                                    givers[i].amount = giverAmountAbs - takerAmountAbs;
                                    takers[u].consumed = true;
                                }

                                debt.save(function(err)
                                {
                                    if(err)
                                    {
                                        deferred.reject(err);
                                    }
                                    else
                                    {
                                        console.log('New debt saved (' + debt.dbt_amount + '€) - NO_OPTIMISATION');
                                    }
                                });
                            }
                        }
                    }
                }
            })();

            if(this.notConsumedLeft(givers) && this.notConsumedLeft(takers))
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
                deferred.resolve('END_NO_OPTIMISATION');
            }

            return deferred.promise;
        },

        notConsumedLeft: function(participants)
        {
            for(var i = 0; i < participants.length; i++)
            {
                if(participants[i].consumed === false)
                {
                    return true;
                }
            }

            return false;
        }
    };
};