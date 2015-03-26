/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(participantsService) {
    return {
        /** Get participants. */
        getParticipants: function(req, res)
        {
            // Get sheetId.
            var sheetId = req.params.sheetId;

            if(sheetId)
            {
                // Get participant.
                participantsService.getParticipants(sheetId).then(function(participants)
                {
                    res.status(200).json({"count" : participants.length, "data" : participants});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "ParticipantsController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "ParticipantsController", "status" : 400});
            }
        }
    };
};
