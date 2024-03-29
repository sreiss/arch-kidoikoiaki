/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var ArchSaveError = GLOBAL.ArchSaveError;
var ArchDeleteError = GLOBAL.ArchDeleteError;
var ArchFindError = GLOBAL.ArchFindError;

module.exports = function(participantService) {
    return {
        /** Save participant. */
        saveParticipant: function(req, res)
        {
            // Get participant data.
            var participantData = req.body;

            // Saving participant.
            participantService.saveParticipant(participantData).then(function(participant)
            {
                res.status(200).json({"count" : (participant ? 1 : 0), "data" : participant});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchSaveError(err.message)});
            });
        },

        /** Update participant. */
        updateParticipant: function(req, res)
        {
            // Get participant data.
            var participantData = req.body.participant;

            // Saving participant.
            participantService.updateParticipant(participantData).then(function(result)
            {
                res.status(200).json({"count" : result.ok, "data" : result});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchSaveError(err.message)});
            });
        },

        /** Delete participant. */
        deleteParticipant: function(req, res)
        {
            // Get participantId.
            var participantId = req.params.participantId;

            // Saving participant.
            participantService.deleteParticipant(participantId).then(function(participant)
            {
                res.status(200).json({"count" : (participant ? 1 : 0), "data" : participant});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchDeleteError(err.message)});
            });
        },

        /** Get participant. */
        getParticipant: function(req, res)
        {
            // Get participantId.
            var participantId = req.params.participantId;

            // Get participant.
            participantService.getParticipant(participantId).then(function(participant)
            {
                res.status(200).json({"count" : (participant ? 1 : 0), "data" : participant});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchFindError(err.message)});
            });
        }
    };
};
