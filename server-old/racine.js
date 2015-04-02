var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var linkTo = 'localhost:3000/';
var mongoose = require('mongoose');

// Set our collection
var sheetModel = mongoose.model('kid_sheet');
var participantModel = mongoose.model('kid_participant');
var transactionModel = mongoose.model('kid_transaction');

router.get('/', function(req, res, next) {
    
    // var j = "J";
    // var e = "E";
    // var c = "C";
    // var m = "M";
    // var t = "T";
    // var tabPersonne = [j,e,c,m,t];

 
    // var tr1 = new Object();
    // tr1.contrib = j;
    // tr1.montant = "9";
    // tr1.benef = [[c,1], [e,1], [j,1]];

    // var tr2 = new Object();
    // tr2.contrib = m;
    // tr2.montant = "6";
    // tr2.benef = [[e,1], [m,1]];

    // var tr3 = new Object();
    // tr3.contrib = e;
    // tr3.montant = "18";
    // tr3.benef = [[t,1], [e,1]];

    // var tabTransaction = [tr1, tr2, tr3];
    
    var personne = 100;
    var transaction = 100;
    var montant = 50;
    var poids = 10;
    
    var tabPersonne = [];
    var tabTransaction = [];
    
    for (var i = 0; i < personne; i++) {
        var text = "";
        var possible = "azertyuiopmlkjhgfdsqwxcvbnAZERTYUIOPMLKJHGFDSQWXCVBN1234567890";

        for( var u=0; u < 5; u++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        
        tabPersonne.push(text);
    }
    
    for (var i = 0; i < transaction; i++) {
        var tr = new Object();
        tr.contrib = tabPersonne[Math.floor((Math.random() * personne))];
        tr.montant = Math.round(Math.random()*montant*100)/100;      //montants décimaux
        // tr.montant = Math.round(Math.random()*montant);                //montants entiers
        
        tr.benef = [];
        var arr = new Array();
        for (var u = 0; u < Math.floor((Math.random() * personne)+1); u++) {        //+1 pour au moins un benef
            var p = tabPersonne[Math.floor((Math.random() * personne))];
            while (arr.indexOf(p) != parseInt("-1")) {
                p = tabPersonne[Math.floor((Math.random() * personne))];
            }
            arr.push(p);
            
            var pd = Math.floor((Math.random() * poids)+1);                         //+1 pour que le poids soit de 1 au moins
            tr.benef.push([p,pd]);
        }
        
        tabTransaction.push(tr);
    }

    console.log(tabPersonne);
    console.log(tabTransaction);
    
    res.send(JSON.stringify(tabTransaction));

    // *******************************************DEBUT ALGO******************************************************************************
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
            if (tabTransaction[tIncr].contrib === tabPersonne[pIncr]) {
                give = give+parseFloat(tabTransaction[tIncr].montant);
                console.log("give de "+currentPersonne+ " : "+give);
            }
            
            //-----------------------TAKE-------------------------------
            var bIncr = 0;  //incrémentation sur le tab de benef de la transaction en cours
            var tabBenef = tabTransaction[tIncr].benef; //tab benef de la transaction en cours
            var totalTransactionWeight = 0;
            var isAbenef = false;
            var currentPersonneWeight = 0;
            for (bIncr = 0; bIncr < tabBenef.length; bIncr++) {
                if (tabBenef[bIncr][0] === currentPersonne) {
                    //si la personne courante est un beneficiaire de cette transaction alors on integre le montant dans ce quel recois (take)
                    isAbenef = true; 
                    //on garde le poids de la personne dans ce quel recois pour le calcul du take
                    currentPersonneWeight = parseFloat(tabBenef[bIncr][1]);
                }
                //on garde le poids total des beneficiaires pour faire la moyenne pour ce que la personne take
                totalTransactionWeight = parseFloat(parseFloat(totalTransactionWeight) + parseFloat(tabBenef[bIncr][1]));
            }
            
            if (isAbenef) {
                take = parseFloat(take) + parseFloat((tabTransaction[tIncr].montant/totalTransactionWeight)*currentPersonneWeight);                 //résultat très proche de la réalité
                // take = Math.round(parseFloat(take) + parseFloat((tabTransaction[tIncr].montant/totalTransactionWeight)*currentPersonneWeight));  //résultat plus approximatif
            }
        }
        console.log("take de "+currentPersonne+" : "+take);
        
        tabRes1step.push([currentPersonne, take-give]);     //take-give => si positif alors la personne à plus reçu que dépensée et vis versa
    }
    
    
    //début algo décisionnelle
    
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
    
    for (incrTab = 0; incrTab < tabRes1stepSorted.length; incrTab++) {
        if (parseFloat(tabRes1stepSorted[incrTab][1]) > parseFloat("0")) {
            GiveTab.push(tabRes1stepSorted[incrTab]);
        }
        
        else if (parseFloat(tabRes1stepSorted[incrTab][1]) < parseFloat("0")) {
            TakeTab.push(tabRes1stepSorted[incrTab]);
        }
    }
    
    var howShouldPayNow = GiveTab[GiveTab.length-1];   //en théorie si le tableau est bien trié le premier résultat est celui de la personne qui a le plus reçu
                                        //et donc qui devrait payé prochainement
    
    makeThatClean(GiveTab, TakeTab, resultTab);
    
    console.log("Celui qui devrait payer maintenant est : "+howShouldPayNow[0]);
        
    // res.send(JSON.stringify({"status":"racine true"}));
});

function makeThatClean (give, take, results) {   
    if (give.length == 0 || take.length == 0) {
        console.log("Give de fin : "+give);
        console.log("Take de fin : "+take);
        
        console.log("***********************************************************");
        console.log("***********************************************************");
        console.log("resultat : "+results);
        console.log("***********************************************************");
        console.log("***********************************************************");
        console.log("DETAILS ---------------------------------------------------");
        console.log("Nombre de transactions finales : "+results.length);
        
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
                if (Math.round(give[i][1]*10)/10 == Math.round(take[u][1]*parseFloat("-1")*10)/10) {
                    results.push(""+give[i][0]+" doit à "+take[u][0]+" "+Math.round(give[i][1]*100)/100+"€");   //écriture de la transaction
                    give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                    take.splice(u, 1);    //on enleve aussi le taker car il a recu sa tune
                    console.log("give == take");
                    makeThatClean(give, take, results);
                }
            }
        }

        for (var i = 0; i < give.length; i++) {
            for (var u = 0; u < take.length; u++) {            
                if (give[i][1] < take[u][1]*parseFloat("-1")) {
                    results.push(""+give[i][0]+" doit à "+take[u][0]+" "+Math.round(give[i][1]*100)/100+"€");   //écriture de la transaction
                    take[u][1] = take[u][1]+give[i][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                    give.splice(i, 1);    //on enleve le giver car pour lui plus de transaction
                    console.log("give < take");
                    makeThatClean(give, take, results);
                }
                
                else if (give[i][1] > take[u][1]*parseFloat("-1")) {
                    results.push(""+give[i][0]+" doit à "+take[i][0]+" "+Math.round(take[u][1]*100)/100*parseInt("-1")+"€");   //écriture de la transaction
                    give[i][1] = give[i][1]+take[u][1]; //on soustrait ce que donne la personne a l'autre (si on donne a l'autre 4e et qu'il en attend 5e, il en attendra plus que 1e)
                    take.splice(u, 1);    //on enleve le giver car pour lui plus de transaction
                    console.log("give > take");
                    makeThatClean(give, take, results);
                }
            }
        }
    }
}         
 

module.exports = router;