var path = require('path'),
    ArchError = require(path.join(__dirname, '.', '/ArchError'));

var ArchSaveError = function (message, status, type) {
    this.message = message || 'An error occurred while saving element.';
    this.status = status || 400;
    this.type = type || 'ArchSaveError';
};
ArchSaveError.prototype = Object.create(ArchError.prototype);
ArchSaveError.prototype.constructor = ArchSaveError;

module.exports = ArchSaveError;