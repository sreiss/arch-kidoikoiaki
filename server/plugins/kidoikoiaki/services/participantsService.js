/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(Participant) {
    return {
        /** Get all participants. */
        getParticipants: function(sheetId)
        {
            var deferred = Q.defer();

            Participant.find({prt_sheet: sheetId}).populate('prt_sheet').exec(function (err, participants)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(participants);
                }
            });

            return deferred.promise;
        }
    };
};