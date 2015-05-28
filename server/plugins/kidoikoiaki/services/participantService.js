/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(Participant) {
    return {
        /** Save participant. */
        saveParticipant: function(participantData)
        {
            var deferred = Q.defer();

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

        /** Update participant. */
        updateParticipant: function(participantData)
        {
            var deferred = Q.defer();

            Participant.update({_id: participantData._id},
            {
                prt_fname : participantData.prt_fname,
                prt_lname : participantData.prt_lname,
                prt_email : participantData.prt_email,
                prt_share : participantData.prt_share
            },
            function(err, result)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        },

        /** Delete participant. */
        deleteParticipant: function(participantId)
        {
            var deferred = Q.defer();

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
            var deferred = Q.defer();

            Participant.findOne({_id: participantId}).exec(function (err, participant)
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