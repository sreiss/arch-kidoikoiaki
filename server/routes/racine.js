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
    res.send(JSON.stringify({"status":"racine true"}));
});

module.exports = router;