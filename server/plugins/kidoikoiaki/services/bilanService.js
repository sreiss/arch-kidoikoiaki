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

            console.log('## Start generate bilan.');

            bilanService.generateBilan(sheetId).then(function()
            {
                console.log('## Stop generate bilan.');

                Debt.find({dbt_sheet: sheetId}).populate('dbt_giver dbt_taker').exec(function (err, debts)
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

            })
            .catch(function(err)
            {
                deferred.reject(err);
            });

            return deferred.promise;
        },

        /** Generate bilan. */
        generateBilan: function(sheetId)
        {
            var deferred = Q.defer();

            // Remove previous debts.
            debtService.deleteDebts(sheetId).then(function(debts)
            {
                console.log("Delete previous debts : " + debts);

                // Get participants.
                participantsService.getParticipants(sheetId).then(function(participants)
                {
                    console.log("Participants found : " + participants.length);

                    // Get transactions.
                    transactionsService.getTransactions(sheetId).then(function(transactions)
                    {
                        // Algo #1
                        console.log("Transactions found : " + transactions.length);
                        
                        var tabPersonne = participants;
                        var tabTransaction = transactions;
                        var tabRes1step = new Array();

                        for(var pIncr = 0; pIncr < tabPersonne.length; pIncr++) 
                        {
                            var currentPersonne = tabPersonne[pIncr];
                            var give = 0; // Montant dépensée par la personne courante.
                            var take = 0; // Montant gagnée par la personne courante.

                            for(var tIncr = 0; tIncr < tabTransaction.length; tIncr++) 
                            {
                                var currentTransaction = tabTransaction[tIncr];

                                // currentPersonne == currentContributor -> sum amount.
                                if(currentTransaction.trs_contributor._id.equals(currentPersonne._id)) 
                                {
                                    give = give + parseFloat(currentTransaction.trs_amount);
                                }

                                var tabBenef = currentTransaction.trs_beneficiaries;
                                var totalTransactionWeight = 0;
                                var isAbenef = false;
                                var currentPersonneWeight = 0;

                                for(var bIncr = 0; bIncr < tabBenef.length; bIncr++) 
                                {
                                    var currentBenef = tabBenef[bIncr];
                                    
                                    // currentPersonne == currentBeneficiary -> sum amount.
                                    if(currentBenef.trs_participant._id.equals(currentPersonne._id)) 
                                    {
                                        isAbenef = true;
                                        currentPersonneWeight = parseFloat(currentBenef.trs_weight);
                                    }
                                    
                                    // Keep current weigh (calc. weight average).
                                    totalTransactionWeight = parseFloat(parseFloat(totalTransactionWeight) + parseFloat(currentBenef.trs_weight));
                                }

                                if(isAbenef) 
                                {
                                    take = parseFloat(take) + parseFloat((currentTransaction.trs_amount / totalTransactionWeight) * currentPersonneWeight);                 //résultat très proche de la réalité
                                }
                            }

                            tabRes1step.push([currentPersonne, take - give]);
                        }
                        
                        // Algo #2

                        // Useless to sort ?
                        tabRes1stepSorted = tabRes1step.sort(function(a,b) 
                        {
                            return a[1] - b[1];
                        });

                        // Distinct giver & taker.
                        var givers = new Array();
                        var takers = new Array();

                        tabRes1stepSorted.forEach(function (res) 
                        {
                            if(parseFloat(res[1]) > parseFloat("0")) 
                            {
                                givers.push(res);
                            }
                            else if(parseFloat(res[1]) < parseFloat("0")) 
                            {
                                takers.push(res);
                            }
                        });

                        bilanService.testEqual(givers, takers, sheetId).then(function()
                        {
                           deferred.resolve(true);
                        });
                    })
                })
            })
            .catch(function(err)
            {
                deferred.reject(err);
            });

            return deferred.promise;
        },

        testEqual: function(given, taken, uri)
        {
            var deferred = Q.defer();

            for(var i = 0; i < given.length; i++)
            {
                for(var u = 0; u < taken.length; u++)
                {
                    if(Math.round(given[i][1]*1000)/1000 == Math.round(taken[u][1]*parseFloat("-1")*1000)/1000)
                    {
                        var newDebt = new Debt(
                        {
                            dbt_sheet: uri,
                            dbt_giver: given[i][0]._id,
                            dbt_taker: taken[u][0]._id,
                            dbt_amount: Math.round(given[i][1]*100)/100
                        });

                        newDebt.save(function (err) {});
                        given.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                        taken.splice(u, 1);    //on enleve aussi le taker car il a recu sa tune

                        if(given.length > 0 || taken.length > 0)
                        {
                            bilanService.testEqual(given, taken, uri).then(function()
                            {
                                deferred.resolve(true);
                            })
                            .catch(function(err)
                            {
                                deferred.reject(err);
                            });
                        }

                        break;
                    }
                }
            }

            if(given.length > 0 || taken.length > 0)
            {
                bilanService.testProvide(given, taken, uri).then(function()
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

        testProvide: function(given, taken, uri)
        {
            var deferred = Q.defer();

            var sauvGive = JSON.parse(JSON.stringify(give));
            var sauvTake = JSON.parse(JSON.stringify(take));
            var status = false;

            for(var i = 0; i < given.length; i++)
            {
                    for(var u = 0; u < taken.length; u++)
                    {
                        var newDebt;

                        if(give[i][1] < take[u][1]*parseFloat("-1"))
                        {
                            newDebt = new Debt(
                                {
                                    dbt_sheet: uri,
                                    dbt_giver: give[i][0]._id,
                                    dbt_taker: take[u][0]._id,
                                    dbt_amount: Math.round(give[i][1]*100)/100
                                });

                            take[u][1] = take[u][1]+give[i][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                            given.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                        }
                        else if(give[i][1] > take[u][1]*parseFloat("-1"))
                        {
                            newDebt = new Debt(
                                {
                                    dbt_sheet: uri,
                                    dbt_giver: give[i][0]._id,
                                    dbt_taker: take[u][0]._id,
                                    dbt_amount: Math.round(take[u][1]*100)/100*parseInt("-1")
                                });

                            give[i][1] = give[i][1]+take[u][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                            taken.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                        }

                        for(var ii = 0; ii < given.length; ii++)
                        {
                            for(var uu = 0; uu < taken.length; uu++)
                            {
                                if(Math.round(give[ii][1]*1000)/1000 == Math.round(take[uu][1]*parseFloat("-1")*1000)/1000)
                                {
                                    status = true;  //pour ne pas rentré dans le prochain if d'en dessous
                                    //si on est dans le if, c'est qu'on a trouvé un couple qui va nous permettre de tombé sur une égalité ensuite
                                    //Donc on sauvegarde la transaction précédente (give > ou < take)
                                    //Et on passe les tableaux en récursivité : le give == take sera supprimé ensuite.
                                    newDebt.save(function (err) {});

                                    if(given.length > 0 || taken.length > 0)
                                    {
                                        bilanService.generateDebts(given, taken, uri, "test-equal");   //on envoie une nouvelle récursivité avec les nouveaux tableaux
                                    }

                                    return;  // et on break les 4 boucles
                                }
                            }
                        }

                        // si on arrive ici c'est qu'on a pas trouvé d'optimisation pour give[i] et les valeurs du tableau de take
                        // donc on remets les tableaux a neufs et on recommence pour give[i+1]
                        given = JSON.parse(JSON.stringify(sauvGive));
                        taken = JSON.parse(JSON.stringify(sauvTake));
                    }
            }

            //si status reste false cela veut dire que l'optimisation n'est pas possible et qu'on doit faire partir une valeur au hasard
            //avec une simple comparaison give > ou < take
            if(!status)
            {
                if(given.length > 0 || taken.length > 0)
                {
                    bilanService.noOptimisation(sauvGive, sauvTake, uri).then(function()
                    {
                        deferred.resolve(true);
                    })
                    .catch(function(err)
                    {
                        deferred.reject(err);
                    });
                }
            }
            else
            {
                deferred.resolve(true);
            }

            return deferred.promise;
        },

        noOptimisation: function(given, taken, uri)
        {
            var deferred = Q.defer();
            loop1:
            for(var i = 0; i < given.length; i++)
            {
                for(var u = 0; u < taken.length; u++)
                {
                    if(give[i][1] < take[u][1]*parseFloat("-1"))
                    {
                        var newDebt = new Debt(
                            {
                                dbt_sheet: uri,
                                dbt_giver: give[i][0]._id,
                                dbt_taker: take[u][0]._id,
                                dbt_amount: Math.round(give[i][1]*100)/100
                            });

                        newDebt.save(function (err) {});

                        take[u][1] = take[u][1]+give[i][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                        given.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                    }
                    else if(give[i][1] > take[u][1]*parseFloat("-1"))
                    {
                        var newDebt = new Debt(
                            {
                                dbt_sheet: uri,
                                dbt_giver: give[i][0]._id,
                                dbt_taker: take[u][0]._id,
                                dbt_amount: Math.round(take[u][1]*100)/100*parseInt("-1")
                            });

                        newDebt.save(function (err) {});

                        give[i][1] = give[i][1]+take[u][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                        taken.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                    }

                    if(given.length > 0 || taken.length > 0)
                    {
                        bilanService.testEqual(given, taken, uri).then(function()
                        {
                            deferred.resolve(true);
                        })
                        .catch(function(err)
                        {
                            reject(err);
                        });
                    }

                    break loop1;
                }
            }

            return deferred.promise;
        }
    };
};