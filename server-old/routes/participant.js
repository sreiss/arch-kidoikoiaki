var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var linkTo = 'localhost:3000/';
var mongoose = require('mongoose');

// Set our collection
var sheetModel = mongoose.model('kid_sheet');
var participantModel = mongoose.model('kid_participant');
var transactionModel = mongoose.model('kid_transaction');

/* Return the participants from the sheet */
router.get('/:randomid/participants', function(req, res, next) {    
    addSheetIfNotExist(req.params.randomid);
    
    participantModel.find({'prt_uri':req.params.randomid}, function (err, participants) {
        if (err) { res.send(JSON.stringify({"status":"participantModel.find : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify(participants)); }
        res.end();
    });
});

/* add a participant in the sheet */
router.post('/:randomid/func-add-participant', function(req, res, next) {
    addSheetIfNotExist(req.params.randomid);
    
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var share = req.body.share;
    
    var newParticipator = new participantModel({ 
        prt_uri: req.params.randomid
      , prt_fname: fname
      , prt_lname: lname
      , prt_email: email
      , prt_share: share
    });
    
    newParticipator.save(function (err) {
        if (err) { res.send(JSON.stringify({"status":"add participant : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify({"status":"Participant created"})); }
    });
});

/* edit a participant in the sheet */
router.post('/:randomid/func-edit-participant/:participantid', function(req, res, next) {   
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var share = req.body.share;
    
    var query = {"_id": req.params.participantid, "prt_uri": req.params.randomid};
    var update = {
        prt_fname: fname
      , prt_lname: lname
      , prt_email: email
      , prt_share: share
    };
    var options = {new: true}; //true to return the modified document rather than the original
    
    participantModel.findOneAndUpdate(query, update, options, function(err, participant) {
        if (err) { res.send(JSON.stringify({"status":"edit participant : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify({"status":"Participant edited"})); }
    });
});

/* delete a participant in the sheet */
router.get('/:randomid/func-delete-participant/:participantid', function(req, res, next) {       
    var query = {"_id": req.params.participantid, "prt_uri": req.params.randomid};
    
    participantModel.findOneAndRemove(query, function(err, participant) {
        if (err) { res.send(JSON.stringify({"status":"delete participant : There was a problem adding the information to the database."})); }
        else {     res.send(JSON.stringify({"status":"Participant deleted"})); }
    });
});

function getFullDate () {
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