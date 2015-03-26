var path = require('path'),
    fs = require('fs'),
    config = require(path.join(__dirname, 'lib', 'config')),
    utils = require(path.join(__dirname, 'lib', 'utils')),
    expressApp = require(path.join(__dirname, 'lib', 'expressApp')),
    server = require(path.join(__dirname, 'lib', 'server')),
    controllersLoader = require(path.join(__dirname, 'lib', 'loaders', 'controllersLoader')),
    errorsLoader = require(path.join(__dirname, 'lib', 'loaders', 'errorsLoader')),
    routesLoader = require(path.join(__dirname, 'lib', 'loaders', 'routesLoader')),
    modelsLoader = require(path.join(__dirname, 'lib', 'loaders', 'modelsLoader')),
    middlewaresLoader = require(path.join(__dirname, 'lib', 'loaders', 'middlewaresLoader')),
    db = require(path.join(__dirname, 'lib', 'db', 'db')),
    types = require(path.join(__dirname, 'lib', 'db', 'types')),
    servicesLoader = require(path.join(__dirname, 'lib', 'loaders', 'servicesLoader')),
    pluginLoader = require(path.join(__dirname, 'lib', 'loaders', 'pluginLoader'));

exports.name = 'arch';

exports.attach = function(opts) {
    var app = this;

    app.arch = {};
    app.arch.plugins = {};

    app.use(utils);
    app.use(config);
    app.use(db);
    app.use(types);
    app.use(pluginLoader);
    app.use(expressApp);
    app.use(server);
    app.use(modelsLoader);
    app.use(servicesLoader);
    app.use(errorsLoader);
    app.use(middlewaresLoader);
    app.use(controllersLoader);
    app.use(routesLoader);
};

exports.init = function(done) {
    var app = this;

    var config = app.arch.config;
    var port = config.get('http:port');

    app.arch.server.listen(port);

    return done();
};