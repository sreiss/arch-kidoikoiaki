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
    give = given;
    take = taken;
    console.log("|||||||||||||||||BLOCK|||||||||||||||||");
    console.log("size de give : "+give.length);
    console.log("size de take : "+take.length);
    
    if (give.length == 0 || take.length == 0) {
        console.log("Give de fin : "+give);
        console.log("Take de fin : "+take);
        
        console.log("***********************************************************");
        console.log("***********************************************************");
        console.log("resultat : ");
        console.log("***********************************************************");
        console.log("***********************************************************");
        console.log("DETAILS ---------------------------------------------------");
        
        // return results;
    }
    
    else if (param.localeCompare("test-equal")===0) {
        console.log("TEST EQUAL - test si deux opposes sont egaux");
        isEqual:
        for (var i = 0; i < give.length; i++) {
            for (var u = 0; u < take.length; u++) {            
                if (Math.round(give[i][1]*1000)/1000 == Math.round(take[u][1]*parseFloat("-1")*1000)/1000) {
                    var newDette = new detteModel({ 
                        dtt_uri: uri
                      , dtt_giver: give[i][0]._id
                      , dtt_taker: take[u][0]._id
                      , dtt_montant: Math.round(give[i][1]*100)/100
                    });
                    
                    newDette.save(function (err) {});
                    give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                    take.splice(u, 1);    //on enleve aussi le taker car il a recu sa tune
                    console.log("give == take");
                    
                    if (give.length == 0 || take.length == 0) {
                        console.log("terminééééééééééééééééééééééééééééééHHHUOIUUTYIOUUIIY");
                    }
                    else {
                        makeThatClean(give, take, uri, "test-equal");
                    }
                    break isEqual;
                }
            }
        }
        console.log("Aucun couple d'opposes egal");
        if (give.length == 0 || take.length == 0) {
            console.log("terminééééééééééééééééééééééééééééééHHHEEEEEEEEEEEEEEEEEEE");
        }
        else {
            makeThatClean(give, take, uri, "test-provide");
        }
    }
    
    else if (param.localeCompare("test-provide")===0) {
        console.log("TEST PROVIDE - Test d'optimisation complexe 1");
        
        var sauvGive = JSON.parse(JSON.stringify(give));
        var sauvTake = JSON.parse(JSON.stringify(take));
        
        var status = false;
        
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
                    
                    console.log("on test un give < take : "+give[i][1]+" < "+take[u][1]*parseFloat("-1")); 
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
                    
                    console.log("on test un give > take : "+give[i][1]+" > "+take[u][1]*parseFloat("-1"));
                    give[i][1] = give[i][1]+take[u][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                    take.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                }
                
                for (var ii = 0; ii < give.length; ii++) {
                    for (var uu = 0; uu < take.length; uu++) {            
                        if (Math.round(give[ii][1]*1000)/1000 == Math.round(take[uu][1]*parseFloat("-1")*1000)/1000) {                            
                            newDette.save(function (err) {});
                            console.log("Test OK => Prevu : give == take : "+Math.round(give[ii][1]*1000)/1000+" == "+Math.round(take[uu][1]*parseFloat("-1")*1000)/1000);
                            if (give.length == 0 || take.length == 0) {
                                console.log("terminééééééééééééééééééééééééééééééTARARARARARA");
                            }
                            else {
                                makeThatClean(give, take, uri, "test-equal");
                            }
                            
                            status = true;
                            break isEqual;
                        }
                        else {
                            console.log("pas de test == prevu : "+Math.round(give[ii][1]*1000)/1000+" != "+Math.round(take[uu][1]*parseFloat("-1")*1000)/1000); }
                    }
                }
                give = JSON.parse(JSON.stringify(sauvGive));
                take = JSON.parse(JSON.stringify(sauvTake));
            }
        }
        
        if (!status) { 
            console.log("Pas d'optimisation");
            if (give.length == 0 || take.length == 0) {
                console.log("terminééééééééééééééééééééééééééééééLLLAAAAAAAAAAAAAAAAAA");
            }
            else {
                makeThatClean(sauvGive, sauvTake, uri, "no-optimisation"); 
            }
            
        }
    }
    
    else if (param.localeCompare("no-optimisation")===0) {
        console.log("NO OPTIMISATION");
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
                    
                    console.log("give < take");
                    console.log(take[u][1]+" + "+give[i][1]);
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
                    
                    console.log("give > take");
                    console.log(give[i][1]+" + "+take[u][1]);
                    give[i][1] = give[i][1]+take[u][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                    take.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                }
                
                if (give.length == 0 || take.length == 0) {
                    console.log("terminééééééééééééééééééééééééééééééICIIIIIIIIIIII");
                }
                else {
                    makeThatClean(give, take, uri, "test-equal"); 
                }
                
                console.log("break noOpti");
                break noOpti;
            }
        }
    }
}

module.exports = router;






