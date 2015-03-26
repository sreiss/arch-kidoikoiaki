var path = require('path'),
    ArchError = require(path.join(__dirname, '.', '/ArchError'));

var ArchFindError = function (message, status, type) {
    this.message = message || 'An error occurred while founding element.';
    this.status = status || 400;
    this.type = type || 'ArchFindError';
};
ArchFindError.prototype = Object.create(ArchError.prototype);
ArchFindError.prototype.constructor = ArchFindError;

module.exports = ArchFindError;