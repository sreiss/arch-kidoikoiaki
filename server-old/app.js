var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

// db connect
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kidoikoiaki_database');

//test db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("co BDD reussi");
});

//create the mongoose schema
var basicSheetModel = Schema({
    she_data_reference: String
  , she_creation_date: String
});

var basicParticipantModel = Schema({
   prt_uri: String
  , prt_fname: String
  , prt_lname: String
  , prt_email: String
  , prt_share: {type: Number, min: 0}
});

var basicCategorieModel = Schema({
    ctg_name : String
  , ctg_description : String
});

var basicTransactionModel = Schema({
    trs_uri: String
  , trs_description: String
  , trs_amount: {type: Number, min: 0}
  , trs_contributor: [{ type: Schema.Types.ObjectId, ref: 'kid_participant' }] //prt_id from basicParticipantModel
  , trs_beneficiary: [{
        trs_participant : { type: Schema.Types.ObjectId, ref: 'kid_participant' }  //prt_id from basicParticipantModel
       ,trs_share : {type: Number, min: 0}
  }] 
  , trs_creation_date: String
  , trs_categorie : [{ type: Schema.Types.ObjectId, ref: 'kid_categorie' }]
});

// Set our collection
var sheetModel =  mongoose.model('kid_sheet', basicSheetModel);
var participantModel =  mongoose.model('kid_participant', basicParticipantModel);
var categorieModel =  mongoose.model('kid_categorie', basicCategorieModel);
var transactionModel =  mongoose.model('kid_transaction', basicTransactionModel);

//set the route
var rRacine = require('./routes/racine');
var rCategorie = require('./routes/categorie');
var rSheet = require('./routes/sheet');
var rParticipant = require('./routes/participant');
var rTransaction = require('./routes/transaction');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// sanitize params for prevent XSS
app.use(function(req,res,next){
    // req.body = req.body.replace(/<|>|;|(|)/gi, "");
    // req.body.
    next();
});

app.use('/', rRacine);
app.use('/sheet/', rCategorie);
app.use('/sheet/', rSheet);
app.use('/sheet/', rParticipant);
app.use('/sheet/', rTransaction);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
