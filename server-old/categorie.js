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

/* Return the categorie , only temporary */
router.get('/categories', function(req, res, next) {        
    categorieModel.find().exec(function (err, categories) {
        if (err) { res.send(JSON.stringify({"status":"categories.find : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify(categories)); }
        res.end();
    });
});

/* add a categorie , only temporary */
router.post('/func-add-categorie', function(req, res, next) {  
    var name = req.body.name;
    var description = req.body.desc;
    
    var newCateg = new categorieModel({ 
        ctg_name : name
      , ctg_description : description
    });
       
    newCateg.save(function (err) {
        if (err) {  res.send(JSON.stringify({"status":"add categorie : There was a problem adding the information to the database."+err})); }
        else {      res.send(JSON.stringify({"status":"categorie created"})); }
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