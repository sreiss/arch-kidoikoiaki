var path = require('path'),
    ArchError = require(path.join(__dirname, '.', '/ArchError'));

var ArchParameterError = function (message, status, type) {
    this.message = message || 'Missing parameter.';
    this.status = status || 400;
    this.type = type || 'ArchParameterError';
};
ArchParameterError.prototype = Object.create(ArchError.prototype);
ArchParameterError.prototype.constructor = ArchParameterError;

module.exports = ArchParameterError;