var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var linkTo = 'localhost:3000/';
var mongoose = require('mongoose')

// Set our collection
var sheetModel = mongoose.model('kid_sheet');
var participantModel = mongoose.model('kid_participant');
var transactionModel = mongoose.model('kid_transaction');
var detteModel =  mongoose.model('kid_dette');

router.get('/:randomid/bilanComplex/create', function(req, res, next) {
    var tabPersonne = [];
    var tabTransaction = [];
    
    detteModel.remove({'dtt_uri':req.params.randomid}, function(err) { 
        participantModel.find({'prt_uri':req.params.randomid}, function (err, participants) {
            tabPersonne = participants;
            
            transactionModel.find({'trs_uri':req.params.randomid}).populate('trs_categorie trs_contributor trs_beneficiary.trs_participant').exec(function (err, transactions) {
                tabTransaction = transactions;
                
                // *******************************************DEBUT ALGO INIT******************************************************************************
                // *******************************************DEBUT ALGO INIT******************************************************************************
                // *******************************************DEBUT ALGO INIT******************************************************************************
                var pIncr = 0;
                var tabRes1step = new Array();
                for (pIncr = 0; pIncr < tabPersonne.length; pIncr++) {
                    var currentPersonne = tabPersonne[pIncr];
                    var tIncr = 0;  //incrémentation sur le tab de transaction
                    var give = 0;   //montant dépensée par la personne
                    var take = 0;   //montant gagnée par la personne
                    
                    for (tIncr = 0; tIncr < tabTransaction.length; tIncr++) {
                        //-----------------------GIVE-------------------------------
                        //si la personne courante est le contributeur alors on ajoute le montant de la transaction
                        //à ce qu'elle a donnée
                        var currentTransaction = tabTransaction[tIncr];

                        if (currentTransaction.trs_contributor[0]._id.equals(currentPersonne._id)) {
                            give = give+parseFloat(currentTransaction.trs_amount);
                            console.log("give de "+currentPersonne+ " : "+give);
                        }
                        
                        //-----------------------TAKE-------------------------------
                        var bIncr = 0;  //incrémentation sur le tab de benef de la transaction en cours
                        var tabBenef = currentTransaction.trs_beneficiary; //tab benef de la transaction en cours
                        var totalTransactionWeight = 0;
                        var isAbenef = false;
                        var currentPersonneWeight = 0;
                        for (bIncr = 0; bIncr < tabBenef.length; bIncr++) {
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
                            take = parseFloat(take) + parseFloat((currentTransaction.trs_amount/totalTransactionWeight)*currentPersonneWeight);                 //résultat très proche de la réalité
                        }
                    }
                    console.log("take de "+currentPersonne+" : "+take);
                    
                    tabRes1step.push([currentPersonne, take-give]);     //take-give => si positif alors la personne à plus reçu que dépensée et vis versa
                }
                
                
                
                // *******************************************DEBUT ALGO DECISIONEL******************************************************************************
                // *******************************************DEBUT ALGO DECISIONEL******************************************************************************
                // *******************************************DEBUT ALGO DECISIONEL******************************************************************************
               
                //On fait un sort sur la 2eme collonne du tableau des résultats
                tabRes1stepSorted = tabRes1step.sort(function(a,b) {
                    return a[1] - b[1];
                });
                
                console.log(" ");
                console.log("Result sorted : ");
                console.log(tabRes1stepSorted);
                                  
                res.send(JSON.stringify(tabRes1stepSorted));
                
                //séparation des gens qui vont donner et recevoire
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
                
                var howShouldPayNow = GiveTab[GiveTab.length-1];   //en théorie si le tableau est bien trié le premier résultat est celui de la personne qui a le plus reçu                                               // et donc qui devrait payé prochainement
                
                makeThatClean(GiveTab, TakeTab, req.params.randomid, "test-equal");
                
                console.log("Celui qui devrait payer maintenant est : "+howShouldPayNow[0]);
            });
        });
    });
});

router.get('/:randomid/bilanComplex', function(req, res, next) {
    detteModel.find({'dtt_uri':req.params.randomid}).populate('dtt_taker dtt_giver').exec(function (err, bilan) {
        if (err) { res.send(JSON.stringify({"status":"bilan.find : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify(bilan)); }
        res.end();
    });
    
    detteModel.count({}, function(err, c) { 
        console.log("Nombre de transactions finales : "+c);
    });
});

function makeThatClean (given, taken, uri, param) {   
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
                    var newDette = new detteModel({ 
                        dtt_uri: uri
                      , dtt_giver: give[i][0]._id
                      , dtt_taker: take[u][0]._id
                      , dtt_montant: Math.round(give[i][1]*100)/100
                    });
                    
                    newDette.save(function (err) {});
                    give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                    take.splice(u, 1);    //on enleve aussi le taker car il a recu sa tune
                    
                    if (give.length == 0 || take.length == 0) {
                        //calcule terminé : dettes enregistrées
                        //c'est un "if" de pour ne pas passer dans la récursivité
                    }
                    else { makeThatClean(give, take, uri, "test-equal"); }
                    
                    break isEqual;
                }
            }
        }

        if (give.length == 0 || take.length == 0) {
            //calcule terminé : dettes enregistrées
            //c'est un "if" de pour ne pas passer dans la récursivité
        }
        else { makeThatClean(give, take, uri, "test-provide"); }
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
                    newDette = new detteModel({ 
                        dtt_uri: uri
                      , dtt_giver: give[i][0]._id
                      , dtt_taker: take[u][0]._id
                      , dtt_montant: Math.round(give[i][1]*100)/100
                    });

                    take[u][1] = take[u][1]+give[i][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                    give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                }
                
                else if (give[i][1] > take[u][1]*parseFloat("-1")) {
                    newDette = new detteModel({ 
                        dtt_uri: uri
                      , dtt_giver: give[i][0]._id
                      , dtt_taker: take[u][0]._id
                      , dtt_montant: Math.round(take[u][1]*100)/100*parseInt("-1")
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
                                makeThatClean(give, take, uri, "test-equal");   //on envoie une nouvelle récursivité avec les nouveaux tableaux
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
                makeThatClean(sauvGive, sauvTake, uri, "no-optimisation"); 
            }
            
        }
    }
    
    else if (param.localeCompare("no-optimisation")===0) {
        noOpti:
        for (var i = 0; i < give.length; i++) {
            for (var u = 0; u < take.length; u++) {            
                if (give[i][1] < take[u][1]*parseFloat("-1")) {
                    var newDette = new detteModel({ 
                        dtt_uri: uri
                      , dtt_giver: give[i][0]._id
                      , dtt_taker: take[u][0]._id
                      , dtt_montant: Math.round(give[i][1]*100)/100
                    });
                    
                    newDette.save(function (err) {});

                    take[u][1] = take[u][1]+give[i][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                    give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                }
                
                else if (give[i][1] > take[u][1]*parseFloat("-1")) {
                    var newDette = new detteModel({ 
                        dtt_uri: uri
                      , dtt_giver: give[i][0]._id
                      , dtt_taker: take[u][0]._id
                      , dtt_montant: Math.round(take[u][1]*100)/100*parseInt("-1")
                    });
                    
                    newDette.save(function (err) {});

                    give[i][1] = give[i][1]+take[u][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                    take.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                }
                
                if (give.length == 0 || take.length == 0) {
                    //if de sécurité, pour ne pas passer dans la récursivité
                }
                else {
                    makeThatClean(give, take, uri, "test-equal"); 
                }
                
                break noOpti;
            }
        }
    }
}

module.exports = router;






