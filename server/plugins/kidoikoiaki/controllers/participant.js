/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(participantService) {
    return {
        /** Save participant. */
        saveParticipant: function(req, res)
        {
            // Get participant data.
            var participantData = req.body;

            if(participantData)
            {
                // Saving participant.
                participantService.saveParticipant(participantData).then(function(participant)
                {
                    res.status(200).json({"count" : 1, "data" : participant});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "ParticipantController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "ParticipantController", "status" : 400});
            }
        },

        /** Delete participant. */
        deleteParticipant: function(req, res)
        {
            // Get participantId.
            var participantId = req.params.participantId;

            if(participantId)
            {
                // Saving participant.
                participantService.deleteParticipant(participantId).then(function(participant)
                {
                    res.status(200).json({"count" : 1, "data" : participant});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "ParticipantController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "ParticipantController", "status" : 400});
            }
        },

        /** Get participant. */
        getParticipant: function(req, res)
        {
            // Get participantId.
            var participantId = req.params.participantId;

            if(participantId)
            {
                // Get participant.
                participantService.getParticipant(participantId).then(function(participant)
                {
                    res.status(200).json({"count" : 1, "data" : participant});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "ParticipantController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "ParticipantController", "status" : 400});
            }
        }
    };
};
