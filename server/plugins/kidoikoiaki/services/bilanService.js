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
                        var GiveTab = [];
                        var TakeTab = []; 

                        tabRes1stepSorted.forEach(function (res) 
                        {
                            if(parseFloat(res[1]) > parseFloat("0")) 
                            {
                                GiveTab.push(res);
                            }
                            else if(parseFloat(res[1]) < parseFloat("0")) 
                            {
                                TakeTab.push(res);
                            }
                        });

                        bilanService.generateDebts(GiveTab, TakeTab, sheetId, "test-equal").then(function()
                        {
                            console.log('')
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

        generateDebts: function(given, taken, uri, param)
        {
            var deferred = Q.defer();

            console.log('## Generate debts.');

            give = given;   //très important => permet de définir la variable en global et donc elle ne peut avoir qu'une seul valeur à la fois et partout
            take = taken;   //ce qui permet de terminer chaque fin d'appel de récursivité avec la condition give ou take.length == 0.
                            //si on ne le fait pas, quand on appele la fonction generateDebts dans la fonction generateDebts une fois que la récursivité est fini elle continue
                            //avec les tableaux give et take du moment ou la récursivité est faite et donc c'est le bronx.
                            //vous avez qu'a les enlever pour voir.

            //comparaison si dans le tableau de give il y'a une valeur égale a une autre*(-1) dans le tableau de take
            //  si oui on supprime les deux et on recommence
            //  si non on passe au if suivant
            if(param.localeCompare("test-equal"))
            {
                isEqual:
                    for(var i = 0; i < give.length; i++) 
                    {
                        for(var u = 0; u < take.length; u++)
                        {
                            if(Math.round(give[i][1]*1000)/1000 == Math.round(take[u][1]*parseFloat("-1")*1000)/1000)
                            {
                                var newDebt = new Debt(
                                {
                                    dbt_sheet: uri,
                                    dbt_giver: give[i][0]._id,
                                    dbt_taker: take[u][0]._id,
                                    dbt_amount: Math.round(give[i][1]*100)/100
                                });

                                newDebt.save(function (err) {});
                                give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                                take.splice(u, 1);    //on enleve aussi le taker car il a recu sa tune

                                if(give.length > 0 || take.length > 0)
                                {
                                    bilanService.generateDebts(give, take, uri, "test-equal").then(function()
                                    {
                                        deferred.resolve(true);
                                    });
                                }

                                break isEqual;
                            }
                        }
                    }

                    if(give.length > 0 || take.length > 0)
                    {
                        bilanService.generateDebts(give, take, uri, "test-provide").then(function()
                        {
                            deferred.resolve(true);
                        });
                    }
            }
            // Optmization : check if n+1 give < ou > take -> give == take
            else if(param.localeCompare("test-provide"))
            {
                var sauvGive = JSON.parse(JSON.stringify(give));
                var sauvTake = JSON.parse(JSON.stringify(take));
                var status = false;

                // dans ce cas la, le label permet de break 4 boucles imbriquées, et donc de gagner beaucoup de calculs
                isEqual:
                    for(var i = 0; i < give.length; i++)
                    {
                        for(var u = 0; u < take.length; u++)
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
                                give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
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
                                take.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                            }

                            for(var ii = 0; ii < give.length; ii++)
                            {
                                for(var uu = 0; uu < take.length; uu++)
                                {
                                    if(Math.round(give[ii][1]*1000)/1000 == Math.round(take[uu][1]*parseFloat("-1")*1000)/1000)
                                    {
                                        status = true;  //pour ne pas rentré dans le prochain if d'en dessous
                                        //si on est dans le if, c'est qu'on a trouvé un couple qui va nous permettre de tombé sur une égalité ensuite
                                        //Donc on sauvegarde la transaction précédente (give > ou < take)
                                        //Et on passe les tableaux en récursivité : le give == take sera supprimé ensuite.
                                        newDebt.save(function (err) {});

                                        if(give.length > 0 || take.length > 0)
                                        {
                                            bilanService.generateDebts(give, take, uri, "test-equal");   //on envoie une nouvelle récursivité avec les nouveaux tableaux
                                        }

                                        break isEqual;  // et on break les 4 boucles
                                    }
                                }
                            }

                            // si on arrive ici c'est qu'on a pas trouvé d'optimisation pour give[i] et les valeurs du tableau de take
                            // donc on remets les tableaux a neufs et on recommence pour give[i+1]
                            give = JSON.parse(JSON.stringify(sauvGive));
                            take = JSON.parse(JSON.stringify(sauvTake));
                        }
                    }

                //si status reste false cela veut dire que l'optimisation n'est pas possible et qu'on doit faire partir une valeur au hasard
                //avec une simple comparaison give > ou < take
                if(!status)
                {
                    if(give.length > 0 || take.length > 0)
                    {
                        bilanService.generateDebts(sauvGive, sauvTake, uri, "no-optimisation").then(function()
                        {
                            deferred.resolve(true);
                        });
                    }
                }
            }
            else if(param.localeCompare("no-optimisation"))
            {
                noOpti:
                    for(var i = 0; i < give.length; i++)
                    {
                        for(var u = 0; u < take.length; u++)
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
                                give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
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
                                take.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                            }

                            if(give.length > 0 || take.length > 0)
                            {
                                bilanService.generateDebts(give, take, uri, "test-equal").then(function()
                                {
                                    deferred.resolve(true);
                                });
                            }

                            break noOpti;
                        }
                    }
            }

            return deferred.promise;
        }
    };
};