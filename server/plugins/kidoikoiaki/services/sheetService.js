/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Sheet, participantService, qService) {
    return {
        /** Save sheet. */
        saveSheet: function(sheetReference, callback)
        {
            var sheet = new Sheet();

            // Assign data.
            sheet.she_data_reference = sheetReference;

            // Saving sheet.
            sheet.save(function(err, sheet)
            {
                if(err)
                {
                    callback(err, null);
                }

                callback(null, sheet);
            });
        },

        /** Get sheet. */
        getSheet: function(sheetReference)
        {
            var deferred = qService.defer();

            Sheet.findOne({she_data_reference: sheetReference}).exec(function (err, sheet)
            {
                if(err)
                {
                    deferred.reject(err);
                }

                if(sheet == null)
                {
                    deferred.reject(new Error('No sheet matching [SHEET_REFERENCE] : ' + sheetReference + "."));
                }

                deferred.resolve(sheet);
            });

            return deferred.promise;
        },

        /** Get participant. */
        getParticipant: function(sheetReference, participantId, callback)
        {
            // Get participant.
            participantService.getParticipant(sheetReference, participantId).then(function(participant)
            {
                callback(null, participant);
            },
            function(err)
            {
                callback(err, null);
            });
        },

        /** Get participants. */
        getParticipants: function(sheetReference, callback)
        {
            // Get participant.
            participantService.getParticipants(sheetReference).then(function(participants)
            {
                callback(null, participants);
            },
            function(err)
            {
                callback(err, null);
            });
        }
    };
};