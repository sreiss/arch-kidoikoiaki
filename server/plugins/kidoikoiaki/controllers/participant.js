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
                res.status(200).json({"count" : 1, "data" : participant});
            },
            function(err)
            {
                throw new ArchSaveError(err.message);
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
                res.status(200).json({"count" : 1, "data" : participant});
            },
            function(err)
            {
                throw new ArchDeleteError(err.message);
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
                res.status(200).json({"count" : 1, "data" : participant});
            },
            function(err)
            {
                throw new ArchFindError(err.message);
            });
        }
    };
};
