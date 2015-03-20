/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Participant, qService) {
    return {
        /** Save participant. */
        saveParticipant: function(participantData, callback)
        {
            var deferred = qService.defer();
            var participant = new Participant();

            // Assign data.
            participant.prt_uri = participantData.prt_uri;
            participant.prt_fname = participantData.prt_fname;
            participant.prt_lname = participantData.prt_lname;
            participant.prt_email = participantData.prt_email;
            participant.prt_share = participantData.prt_share;

            participant.save(function(err)
            {
                if(err)
                {
                    callback(err, null);
                }

                callback(null, participant);
            });
        },

        /** Delete participant. */
        deleteParticipant: function(participantId)
        {
            var deferred = qService.defer();

            Participant.findOneAndRemove({participantId: participantId}, function(err, participant)
            {
                if(err)
                {
                    deferred.reject(err);
                }

                if (participant == null)
                {
                    deferred.reject(new Error('No participant matching [PARTICIPANT_ID] : ' + participantId + "."));
                }

                deferred.resolve(participant);
            });

            return deferred.promise;
        },

        /** Get participant. */
        getParticipant: function(sheetReference, participantId)
        {
            var deferred = qService.defer();

            Participant.findOne({_id: participantId, prt_uri: sheetReference}).exec(function (err, participant)
            {
                if(err)
                {
                    deferred.reject(err);
                }

                if (participant == null)
                {
                    deferred.reject(new Error('No participant matching [PARTICIPANT_ID] : ' + participantId + "."));
                }

                deferred.resolve(participant);
            });

            return deferred.promise;
        },

        /** Get all participants. */
        getParticipants: function(sheetReference)
        {
            var deferred = qService.defer();

            Participant.find({prt_uri: sheetReference}).exec(function (err, participants)
            {
                if(err)
                {
                    deferred.reject(err);
                }

                if (participants.length == 0)
                {
                    deferred.reject(new Error('No participants found.'));
                }

                deferred.resolve(participants);
            });

            return deferred.promise;
        }
    };
};