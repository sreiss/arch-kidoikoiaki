/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Debt, bilanService, debtService, participantsService, transactionsService, qService) {
    return {
        /** Get bilan. */
        getBilan: function(sheetId)
        {
            var deferred = qService.defer();

            console.log('Début de la génération du bilan.');

            bilanService.generateBilan(sheetId).then(function()
            {
                console.log('Fin de la génération du bilan.');

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
                        var tabPersonne = [];
                        var tabTransaction = [];
                        tabPersonne = participants;
                        tabTransaction = transactions;

                        // *******************************************DEBUT ALGO INIT******************************************************************************
                        // *******************************************DEBUT ALGO INIT******************************************************************************
                        // *******************************************DEBUT ALGO INIT******************************************************************************


                        var tabRes1step = new Array();

                        for (var pIncr = 0; pIncr < tabPersonne.length; pIncr++) {
                            var currentPersonne = tabPersonne[pIncr];
                            var give = 0;   //montant dépensée par la personne
                            var take = 0;   //montant gagnée par la personne

                            for (var tIncr = 0; tIncr < tabTransaction.length; tIncr++) {
                                //-----------------------GIVE-------------------------------
                                //si la personne courante est le contributeur alors on ajoute le montant de la transaction
                                //à ce qu'elle a donnée

                                var currentTransaction = tabTransaction[tIncr];

                                if (currentTransaction.trs_contributor._id.equals(currentPersonne._id)) {
                                    give = give + parseFloat(currentTransaction.trs_amount);
                                }

                                //-----------------------TAKE-------------------------------
                                var tabBenef = currentTransaction.trs_beneficiaries; //tab benef de la transaction en cours
                                var totalTransactionWeight = 0;
                                var isAbenef = false;
                                var currentPersonneWeight = 0;

                                for (var bIncr = 0; bIncr < tabBenef.length; bIncr++) {
                                    var currentBenef = tabBenef[bIncr];
                                    if (currentBenef.trs_participant._id.equals(currentPersonne._id)) {
                                        //si la personne courante est un beneficiaire de cette transaction alors on integre le montant dans ce quel recois (take)
                                        isAbenef = true;
                                        //on garde le poids de la personne dans ce quel recois pour le calcul du take
                                        currentPersonneWeight = parseFloat(currentBenef.trs_weight);
                                    }
                                    //on garde le poids total des beneficiaires pour faire la moyenne pour ce que la personne take
                                    totalTransactionWeight = parseFloat(parseFloat(totalTransactionWeight) + parseFloat(currentBenef.trs_weight));
                                }

                                if (isAbenef) {
                                    take = parseFloat(take) + parseFloat((currentTransaction.trs_amount / totalTransactionWeight) * currentPersonneWeight);                 //résultat très proche de la réalité
                                }
                            }

                            tabRes1step.push([currentPersonne, take - give]);     //take-give => si positif alors la personne à plus reçu que dépensée et vis versa
                        }
                        // *******************************************DEBUT ALGO DECISIONEL******************************************************************************
                        // *******************************************DEBUT ALGO DECISIONEL******************************************************************************
                        // *******************************************DEBUT ALGO DECISIONEL******************************************************************************

                        //On fait un sort sur la 2eme collonne du tableau des résultats
                        //pour trier du plus petit au plus grand(par ex : -100, -10, -6.09, 5, 10, 20)
                        //ça n'a pas d'utilité sur l'algo mais cela permet de mieux voir la balance courantes des personnes une fois
                        //les transactions calculer en fonction d'une personne
                        tabRes1stepSorted = tabRes1step.sort(function(a,b) {
                            return a[1] - b[1];
                        });

                        //envoie du tableau de la balance courantes de chaques personnes
                        //res.send(JSON.stringify(tabRes1stepSorted));

                        //séparation des gens qui vont donner et recevoir
                        var GiveTab = [];  //gens qui vont payer
                        var TakeTab = [];  //gens qui vont recevoir des tunes

                        var resultTab = [];    //tableau final qui contiendra les transactions

                        tabRes1stepSorted.forEach(function (res) {
                            if (parseFloat(res[1]) > parseFloat("0")) {
                                GiveTab.push(res);
                            }

                            else if (parseFloat(res[1]) < parseFloat("0")) {
                                TakeTab.push(res);
                            }
                        });

                        var howShouldPayNow = GiveTab[GiveTab.length-1];   //en théorie si le tableau est bien trié le premier résultat est celui de la personne qui a le plus payé                                               // et donc qui devrait payé prochainement

                        bilanService.makeThatClean(GiveTab, TakeTab, sheetId, "test-equal");
                    })
                })
            })
            .catch(function(err)
            {
                deferred.reject(err);
            });

            return deferred.promise;
        },

        makeThatClean: function(given, taken, uri, param){
            give = given;   //très important => permet de définir la variable en global et donc elle ne peut avoir qu'une seul valeur à la fois et partout
            take = taken;   //ce qui permet de terminer chaque fin d'appel de récursivité avec la condition give ou take.length == 0.
                            //si on ne le fait pas, quand on appele la fonction makeThatClean dans la fonction makeThatClean une fois que la récursivité est fini elle continue
                            //avec les tableaux give et take du moment ou la récursivité est faite et donc c'est le bronx.
                            //vous avez qu'a les enlever pour voir.

            if (give.length == 0 || take.length == 0) {
                //calcule terminé : dettes enregistrées
                //c'est un "if" de sécurité, je sais pas si c'est possible de rentré dedans mais si jamais au moins on s'arrete
            }


            //comparaison si dans le tableau de give il y'a une valeur égale a une autre*(-1) dans le tableau de take
            //  si oui on supprime les deux et on recommence
            //  si non on passe au if suivant
            else if (param.localeCompare("test-equal")===0) {
                //ce label permet de casser les deux boucles une fois le résultat désiré obtenu => moins de calcules. On aurait pu rajouter une variable de controle dans le
                //for mais je trouve que cela est plus lisible
                isEqual:
                    for (var i = 0; i < give.length; i++) {
                        for (var u = 0; u < take.length; u++) {
                            if (Math.round(give[i][1]*1000)/1000 == Math.round(take[u][1]*parseFloat("-1")*1000)/1000) {        //égalité au 1000ème près
                                var newDette = new Debt({
                                      dbt_sheet: uri
                                    , dbt_giver: give[i][0]._id
                                    , dbt_taker: take[u][0]._id
                                    , dbt_amount: Math.round(give[i][1]*100)/100
                                });

                                newDette.save(function (err) {});
                                give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                                take.splice(u, 1);    //on enleve aussi le taker car il a recu sa tune

                                if (give.length == 0 || take.length == 0) {
                                    //calcule terminé : dettes enregistrées
                                    //c'est un "if" de pour ne pas passer dans la récursivité
                                }
                                else { bilanService.makeThatClean(give, take, uri, "test-equal"); }

                                break isEqual;
                            }
                        }
                    }

                if (give.length == 0 || take.length == 0) {
                    //calcule terminé : dettes enregistrées
                    //c'est un "if" de pour ne pas passer dans la récursivité
                }
                else { bilanService.makeThatClean(give, take, uri, "test-provide"); }
            }

            // nous entrons ici dans la phase d'optimisation, on va check si a n+1 give < ou > take il est possible qu'ensuite give == take
            else if (param.localeCompare("test-provide")===0) {
                var sauvGive = JSON.parse(JSON.stringify(give));    //javascript de base quand on fait var obj = obj2, fait une référence vers obj2
                var sauvTake = JSON.parse(JSON.stringify(take));    //en C on dira que obj pointe vers obj2. Donc si obj2 change, obj change aussi.
                                                                    //Ce qui n'est justement pas ce qu'on veut ! ici obj est un tableaux 2d, c'est pour cela
                                                                    //que javascript va faire un pointage si on avait pas utilisé cette méthode.

                var status = false;     //explication plus bas

                // dans ce cas la, le label permet de break 4 boucles imbriquées, et donc de gagner beaucoup de calculs
                isEqual:
                    for (var i = 0; i < give.length; i++) {
                        for (var u = 0; u < take.length; u++) {
                            var newDette;

                            if (give[i][1] < take[u][1]*parseFloat("-1")) {
                                newDette = new Debt({
                                      dbt_sheet: uri
                                    , dbt_giver: give[i][0]._id
                                    , dbt_taker: take[u][0]._id
                                    , dbt_amount: Math.round(give[i][1]*100)/100
                                });

                                take[u][1] = take[u][1]+give[i][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                                give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                            }

                            else if (give[i][1] > take[u][1]*parseFloat("-1")) {
                                newDette = new Debt({
                                      dbt_sheet: uri
                                    , dbt_giver: give[i][0]._id
                                    , dbt_taker: take[u][0]._id
                                    , dbt_amount: Math.round(take[u][1]*100)/100*parseInt("-1")
                                });

                                give[i][1] = give[i][1]+take[u][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                                take.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                            }

                            for (var ii = 0; ii < give.length; ii++) {
                                for (var uu = 0; uu < take.length; uu++) {
                                    if (Math.round(give[ii][1]*1000)/1000 == Math.round(take[uu][1]*parseFloat("-1")*1000)/1000) {
                                        status = true;  //pour ne pas rentré dans le prochain if d'en dessous
                                        //si on est dans le if, c'est qu'on a trouvé un couple qui va nous permettre de tombé sur une égalité ensuite
                                        //Donc on sauvegarde la transaction précédente (give > ou < take)
                                        //Et on passe les tableaux en récursivité : le give == take sera supprimé ensuite.
                                        newDette.save(function (err) {});

                                        if (give.length == 0 || take.length == 0) {
                                            //if de sécurité, pour ne pas passer dans la récursivité
                                        }
                                        else {
                                            bilanService.makeThatClean(give, take, uri, "test-equal");   //on envoie une nouvelle récursivité avec les nouveaux tableaux
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
                if (!status) {
                    if (give.length == 0 || take.length == 0) {
                        //if de sécurité, pour ne pas passer dans la récursivité
                    }
                    else {
                        bilanService.makeThatClean(sauvGive, sauvTake, uri, "no-optimisation");
                    }

                }
            }

            else if (param.localeCompare("no-optimisation")===0) {
                noOpti:
                    for (var i = 0; i < give.length; i++) {
                        for (var u = 0; u < take.length; u++) {
                            if (give[i][1] < take[u][1]*parseFloat("-1")) {
                                var newDette = new Debt({
                                      dbt_sheet: uri
                                    , dbt_giver: give[i][0]._id
                                    , dbt_taker: take[u][0]._id
                                    , dbt_amount: Math.round(give[i][1]*100)/100
                                });

                                newDette.save(function (err) {});

                                take[u][1] = take[u][1]+give[i][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                                give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                            }

                            else if (give[i][1] > take[u][1]*parseFloat("-1")) {
                                var newDette = new Debt({
                                      dbt_sheet: uri
                                    , dbt_giver: give[i][0]._id
                                    , dbt_taker: take[u][0]._id
                                    , dbt_amount: Math.round(take[u][1]*100)/100*parseInt("-1")
                                });

                                newDette.save(function (err) {});

                                give[i][1] = give[i][1]+take[u][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                                take.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                            }

                            if (give.length == 0 || take.length == 0) {
                                //if de sécurité, pour ne pas passer dans la récursivité
                            }
                            else {
                                bilanService.makeThatClean(give, take, uri, "test-equal");
                            }

                            break noOpti;
                        }
                    }
            }
        }
    };
};