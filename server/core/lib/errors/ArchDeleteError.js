var path = require('path'),
    ArchError = require(path.join(__dirname, '.', '/ArchError'));

var ArchDeleteError = function (message, status, type) {
    this.message = message || 'An error occurred while deleting element.';
    this.status = status || 400;
    this.type = type || 'ArchDeleteError';
};
ArchDeleteError.prototype = Object.create(ArchError.prototype);
ArchDeleteError.prototype.constructor = ArchDeleteError;

module.exports = ArchDeleteError;