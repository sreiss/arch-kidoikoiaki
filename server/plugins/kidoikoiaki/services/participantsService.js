/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Participant, qService) {
    return {
        /** Get all participants. */
        getParticipants: function(sheetId)
        {
            var deferred = qService.defer();

            Participant.find({prt_sheet: sheetId}).exec(function (err, participants)
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