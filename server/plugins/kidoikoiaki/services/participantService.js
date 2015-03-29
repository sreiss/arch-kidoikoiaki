/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Participant, qService) {
    return {
        /** Save participant. */
        saveParticipant: function(participantData)
        {
            var deferred = qService.defer();

            var participant = new Participant();
            participant.prt_sheet = participantData.prt_sheet;
            participant.prt_fname = participantData.prt_fname;
            participant.prt_lname = participantData.prt_lname;
            participant.prt_email = participantData.prt_email;
            participant.prt_share = participantData.prt_share;

            participant.save(function(err)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(participant);
                }
            });

            return deferred.promise;
        },

        /** Delete participant. */
        deleteParticipant: function(participantId)
        {
            var deferred = qService.defer();

            Participant.findOneAndRemove({_id: participantId}, function(err, participant)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else if(!participant)
                {
                    deferred.reject(new Error('No participant matching [PARTICIPANT_ID] : ' + participantId + "."));
                }
                else
                {
                    deferred.resolve(participant);
                }
            });

            return deferred.promise;
        },

        /** Get participant. */
        getParticipant: function(participantId)
        {
            var deferred = qService.defer();

            Participant.findOne({_id: participantId}).populate('prt_sheet').exec(function (err, participant)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(participant);
                }
            });

            return deferred.promise;
        }
    };
};