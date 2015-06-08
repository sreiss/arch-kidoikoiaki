var express = require('express'),
    logger = require('morgan'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http');

exports.name = 'arch-http';

exports.attach = function(opts)
{
    var app = this;
    var expressApp = app.arch.expressApp = express();
    var config = app.arch.config;

    expressApp.set('views', path.join(__dirname, '..', 'views'));
    expressApp.set('view engine', 'jade');

    expressApp.use(logger('dev'));
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({extended: false}));
    expressApp.use(cookieParser());
    //expressApp.use(express.static(path.join(__dirname, '..', 'public')));
    expressApp.use('/', express.static(path.join(__dirname, '..', '..', 'public')));

    var allowedOrigins = config.get('http:allowedOrigins');
    expressApp.use(function(req, res, next) {
        var origin = req.headers.origin;
        if (allowedOrigins.indexOf(origin) > -1) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', true);
        }

        return next();
    });
};

exports.init = function (done)
{
    return done();
};
