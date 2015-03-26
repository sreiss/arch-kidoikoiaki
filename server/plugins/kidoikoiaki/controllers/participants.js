/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var ArchFindError = GLOBAL.ArchFindError;

module.exports = function(participantsService)
{
    return {
        /** Get participants. */
        getParticipants: function(req, res)
        {
            // Get sheetId.
            var sheetId = req.params.sheetId;

            // Get participant.
            participantsService.getParticipants(sheetId).then(function(participants)
            {
                res.status(200).json({"count" : participants.length, "data" : participants});
            },
            function(err)
            {
                throw new ArchFindError(err.message);
            });
        }
    };
};
