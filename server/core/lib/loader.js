var Q = require('q'),
    fs = require('fs'),
    path = require('path');

module.exports = {
    name: 'arch-loader',
    attach: function(options) {
        var app = this;

        var arch = app.arch;
        var config = arch.config;

        var plugins = arch.plugins = {};
        var pluginsDir = config.get('pluginsDir');

        var loadPlugins = function() {
            var deferred = Q.defer();

            var foundPluginNames = fs.readdirSync(pluginsDir);

            foundPluginNames.forEach(function(pluginName) {
                var plugin = plugins[pluginName] = {
                    _name: pluginName,
                    _path: path.join(pluginsDir, pluginName)
                }

                // We get the plugin descriptor if there is any and set the default values if they miss.
                var pluginDescriptor = {};
                try {
                    pluginDescriptor = require(path.join(plugin._path, 'plugin'));
                    if (!pluginDescriptor.dependencies) {
                        pluginDescriptor.dependencies = [];
                    }
                } catch(err) {
                    pluginDescriptor = {
                        dependencies: []
                    };
                }

                // Then we wire the descriptor informations to the plugin itself.
                plugin._dependencies = pluginDescriptor.dependencies;
            });
            deferred.resolve();

            return deferred.promise;
        };

        var loadType = function(loadOptions) {
            var deferred = Q.defer();

            if (!loadOptions.type) {
                deferred.reject(new Error('Please provide a type to load.'))
            }

            if (!loadOptions.pluginName) {
                deferred.reject(new Error('Please provide a pluginName to load for ' + options.type + ' type.'));
            }

            if (!plugins[options.pluginName]) {
                deferred.reject(new Error("The plugin " + options.pluginName + " doesn't exist."));
            }

            var typePath = path.join(pluginsDir, options.pluginName, options.type);

            return deferred.promise;
        };

        var loadPlugin = function(pluginName) {
            var deferred = Q.defer();

            return deferred.promise;
        };

        arch.loader = {
            load: function() {
                loadPlugins().then(function() {
                   console.log('plugins loaded');
                });
            }
        };
    },
    init: function(done) {
        return done();
    }

};