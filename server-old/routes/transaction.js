var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var linkTo = 'localhost:3000/';
var mongoose = require('mongoose');

// Set our collection
var sheetModel =  mongoose.model('kid_sheet');
var participantModel =  mongoose.model('kid_participant');
var categorieModel =  mongoose.model('kid_categorie');
var transactionModel =  mongoose.model('kid_transaction');

/* Return the transactions from the sheet */
router.get('/:randomid/transactions', function(req, res, next) {    
    addSheetIfNotExist(req.params.randomid);
    
    transactionModel.find({'trs_uri':req.params.randomid}).populate('trs_categorie trs_contributor trs_beneficiary.trs_participant').exec(function (err, transactions) {
        if (err) { res.send(JSON.stringify({"status":"transactionModel.find : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify(transactions)); }
        res.end();
    });
});

/* Return the transactions from the sheet by id  */
router.get('/:randomid/transaction/:idtransaction', function(req, res, next) {    
    addSheetIfNotExist(req.params.randomid);
    
    transactionModel.find({'trs_uri':req.params.randomid, '_id':req.params.idtransaction}).populate('trs_categorie trs_contributor trs_beneficiary.trs_participant').exec(function (err, transactions) {
        if (err) { res.send(JSON.stringify({"status":"transactionModel.find par id : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify(transactions)); }
        res.end();
    });
});

/* Return the transactions from the sheet by categorie */
router.get('/:randomid/categorie/:idcategorie/transactions', function(req, res, next) {    
    addSheetIfNotExist(req.params.randomid);
    
    transactionModel.find({'trs_uri':req.params.randomid, 'trs_categorie':req.params.idcategorie}).populate('trs_categorie trs_contributor trs_beneficiary.trs_participant').exec(function (err, transactions) {
        if (err) { res.send(JSON.stringify({"status":"transactionModel.find par categ : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify(transactions)); }
        res.end();
    });
});

/* add a transaction in the sheet */
router.post('/:randomid/func-add-transaction', function(req, res, next) {
    addSheetIfNotExist(req.params.randomid);
    
    var description = req.body.desc;
    var aamount = req.body.amount; 
    var contributor = req.body.contrib;
    var beneficiary = req.body.benef;
    var categorie = req.body.categ;
    
    console.log("contrib : "+contributor);
    console.log("benef : "+beneficiary);
    
    var newTransaction = new transactionModel({ 
        trs_uri: req.params.randomid
      , trs_description: description
      , trs_amount: aamount
      , trs_contributor: contributor    //ids fk participant
      , trs_beneficiary: beneficiary   //ids fk participant
      , trs_creation_date: getFullDate()
      , trs_categorie : categorie
    });
       
    newTransaction.save(function (err) {
        if (err) {  res.send(JSON.stringify({"status":"add transaction : There was a problem adding the information to the database."+err})); }
        else {      res.send(JSON.stringify({"status":"transaction created"})); }
    });
});

/* edit a transaction in the sheet */
router.post('/:randomid/func-edit-transaction/:transactionid', function(req, res, next) {   
    addSheetIfNotExist(req.params.randomid);
    
    var description = req.body.desc;
    var aamount = req.body.amount;
    var contributor = req.body.contrib;
    var beneficiary = req.body.benef
    var categorie = req.body.categ;
    
    console.log("contrib : "+contributor);
    console.log("benef : "+beneficiary);
       
    var query = {"_id": req.params.transactionid, "trs_uri": req.params.randomid};
    var update = {
        trs_description: description
      , trs_amount: aamount
      , trs_contributor: contributor    //ids fk participant
      , trs_beneficiary: beneficiary    //ids fk participant
      , trs_categorie: categorie
    };
    var options = {new: false}; //true to return the modified document rather than the original
    
    transactionModel.findOneAndUpdate(query, update, options, function(err, transaction) {
        if (err) { res.send(JSON.stringify({"status":"edit transaction : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify({"status":"transaction edited"})); }
    });
});

/* delete a transaction in the sheet */
router.get('/:randomid/func-delete-transaction/:transactionid', function(req, res, next) {       
    var query = {"_id": req.params.transactionid, "trs_uri": req.params.randomid};
    
    transactionModel.findOneAndRemove(query, function(err, transaction) {
        if (err) { res.send(JSON.stringify({"status":"delete transaction : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify({"status":"transaction deleted"})); }
    });
});

function getFullDate() {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    
    return day+"-"+month+"-"+year;
}

function addSheetIfNotExist(uri) {
    sheetModel.find({'she_data_reference':uri}, function (err, newSheet) {
        if (newSheet.length==0) {
            var newSheet = new sheetModel({ 
                  she_data_reference: uri
                , she_creation_date: getFullDate()
            });
            newSheet.save(function (err) { 
                if (err) { res.send(JSON.stringify({"status":"newSheet.save : There was a problem adding the information to the database."})); }
            });
        }
    });
}

module.exports = router;