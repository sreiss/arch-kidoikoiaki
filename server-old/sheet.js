var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var linkTo = 'localhost:3000/';
var mongoose = require('mongoose');
var ical = require('ics');

// Set our collection
var sheetModel = mongoose.model('kid_sheet');
var participantModel = mongoose.model('kid_participant');
var transactionModel = mongoose.model('kid_transaction');

/* Create new sheet in database and redirect to this sheet */
router.get('/create', function(req, res, next) {
    // Generate a v4 (random) id
    var newSheetUri = uuid.v4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
    
    var newSheet = new sheetModel({ 
         she_data_reference: newSheetUri
        ,she_creation_date: getFullDate()
    });
    
    newSheet.save(function (err) {
        if (err) { res.send(JSON.stringify({"status":"There was a problem adding the information to the database."+err})); }
        else {     res.send(JSON.stringify({"status":"sheet created"})); }
        res.end();
    });
});

/* Fonction temporaire pour voir tout les sheets */
router.get('/findAll', function(req, res, next) {
    sheetModel.find({}, function (err, sheets) {
        if (err) { res.send(JSON.stringify({"status":"participantModel.find : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify(sheets)); }
        res.end();
    });
});

/* test ical */
router.get('/ical', function(req, res, next) {       
    var options = {
      eventName: 'Fingerpainting lessons',
      fileName: 'event.ics',
      dtstart: 'Sat Nov 02 2014 13:15:00 GMT-0700 (PDT)',
      email: {
        name: 'Isaac Asimov',
        email: 'isaac@asimov.com'
      }
    };
     
    ical.createEvent(options, null, function(err, success) {
      if (err) {
        console.log(err);
        res.send(JSON.stringify({"status":"ical : There was a problem."}));
      }
     
      console.log(success); // returns filepath 
      res.send(JSON.stringify(success));
      
    });
    
});

function getFullDate () {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    
    return day+"-"+month+"-"+year;
}

module.exports = router;