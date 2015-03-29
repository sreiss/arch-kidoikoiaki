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

router.get('/:randomid/bilan/create', function(req, res, next) {
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
                
                makeThatClean(GiveTab, TakeTab, req.params.randomid);
                
                console.log("Celui qui devrait payer maintenant est : "+howShouldPayNow[0]);
                    
                res.send(JSON.stringify(tabRes1stepSorted));
            });
        });
    });
});

router.get('/:randomid/bilan', function(req, res, next) {
    detteModel.find({'dtt_uri':req.params.randomid}).populate('dtt_taker dtt_giver').exec(function (err, bilan) {
        if (err) { res.send(JSON.stringify({"status":"bilan.find : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify(bilan)); }
        res.end();
    });
});

function makeThatClean (give, take, uri) {   
    if (give.length == 0 || take.length == 0) {
        console.log("Give de fin : "+give);
        console.log("Take de fin : "+take);
        
        console.log("***********************************************************");
        console.log("***********************************************************");
        console.log("resultat : ");
        console.log("***********************************************************");
        console.log("***********************************************************");
        console.log("DETAILS ---------------------------------------------------");
        console.log("Nombre de transactions finales : ");
        
        // return results;
    }
    
    else {
        console.log("size de give : "+give.length);
        console.log("size de take : "+take.length);
        
        console.log("-----------------------------------------------------------");
        console.log("-----------------------------------------------------------");
        console.log("giveTab    "+give);
        console.log("-----------------------------------------------------------");
        console.log("takeTab    "+take);
        console.log("-----------------------------------------------------------");
        console.log("-----------------------------------------------------------");
        
        for (var i = 0; i < give.length; i++) {
            for (var u = 0; u < take.length; u++) {            
                if (Math.round(give[i][1]*1000)/1000 == Math.round(take[u][1]*parseFloat("-1")*1000)/1000) {
                    var newDette = new detteModel({ 
                        dtt_uri: uri
                      , dtt_giver: give[i][0]._id
                      , dtt_taker: take[u][0]._id
                      , dtt_montant: Math.round(give[i][1]*100)/100
                    });
                    
                    newDette.save(function (err) {
                        // if (err) { res.send(JSON.stringify({"status":"add dette : There was a problem adding the information to the database."})); }
                        // else {     res.send(JSON.stringify({"status":"dette created"})); }
                    });
                    give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                    take.splice(u, 1);    //on enleve aussi le taker car il a recu sa tune
                    console.log("give == take");
                    makeThatClean(give, take, uri);
                }
            }
        }
       
        for (var i = 0; i < give.length; i++) {
            for (var u = 0; u < take.length; u++) {            
                if (give[i][1] < take[u][1]*parseFloat("-1")) {
                    var newDette = new detteModel({ 
                        dtt_uri: uri
                      , dtt_giver: give[i][0]._id
                      , dtt_taker: take[u][0]._id
                      , dtt_montant: Math.round(give[i][1]*100)/100
                    });
                    
                    newDette.save(function (err) {
                        // if (err) { res.send(JSON.stringify({"status":"add dette : There was a problem adding the information to the database."})); }
                        // else {     res.send(JSON.stringify({"status":"dette created"})); }
                    });
                    take[u][1] = take[u][1]+give[i][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                    give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                    console.log("give < take");
                    makeThatClean(give, take, uri);
                }
                
                else if (give[i][1] > take[u][1]*parseFloat("-1")) {
                    var newDette = new detteModel({ 
                        dtt_uri: uri
                      , dtt_giver: give[i][0]._id
                      , dtt_taker: take[u][0]._id
                      , dtt_montant: Math.round(take[u][1]*100)/100*parseInt("-1")
                    });
                    
                    newDette.save(function (err) {
                        // if (err) { res.send(JSON.stringify({"status":"add dette : There was a problem adding the information to the database."})); }
                        // else {     res.send(JSON.stringify({"status":"dette created"})); }
                    });
                    give[i][1] = give[i][1]+take[u][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                    take.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                    console.log("give > take");
                    makeThatClean(give, take, uri);
                }
            }
        }
    }
}

module.exports = router;