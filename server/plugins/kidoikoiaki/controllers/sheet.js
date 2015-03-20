/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(sheetService) {
    return {
        /** Save sheet. */
        saveSheet: function(req, res)
        {
            // Get sheetReference.
            var sheetReference = req.body.sheetReference;

            if(sheetReference)
            {
                // Saving sheet.
                sheetService.saveSheet(sheetReference, function (err, result)
                {
                    if(err)
                    {
                        res.status(500).json({"message": "An error occurred while saving sheet.", "data": err.message});
                    }
                    else
                    {
                        res.status(200).json({"message": "Sheet saved successfully.", "data": result});
                    }
                });
            }
            else
            {
                res.status(500).json({"message": "Missing parameters.", "data": false});
            }
        },

        /** Get sheet.. */
        getSheet: function(req, res)
        {
            // Get sheetReference.
            var sheetReference = req.params.sheetReference;

            if(sheetReference)
            {
                // Get sheet.
                sheetService.getSheet(sheetReference).then(function(sheet)
                {
                    res.status(200).json({"message" : "Sheet found successfully.", "data" : sheet});
                },
                function(err)
                {
                    res.status(500).json({"message" : "An error occurred while founding sheet.", "data" : err.message});
                });
            }
            else
            {
                res.status(500).json({"message": "Missing parameters.", "data": false});
            }
        },

        /** Save participant. */
        saveParticipant: function(req, res)
        {
            // Get sheetReference.
            var participant = req.body;

            if(participant)
            {
                // Saving participant.
                sheetService.saveParticipant(participant, function (err, result)
                {
                    if(err)
                    {
                        res.status(500).json({"message": "An error occurred while saving participant.", "data": err.message});
                    }
                    else
                    {
                        res.status(200).json({"message": "Participant saved successfully.", "data": result});
                    }
                });
            }
            else
            {
                res.status(500).json({"message": "Missing parameters.", "data": false});
            }
        },

        /** Get participant(s). */
        getParticipant: function(req, res)
        {
            // Get participantId.
            var participantId = req.params.participantId;
            var sheetReference = req.params.sheetReference;

            if(participantId)
            {
                // Get participant.
                sheetService.getParticipant(sheetReference, participantId, function(err, result)
                {
                    if(err)
                    {
                        res.status(500).json({"message" : "An error occurred while founding participant.", "data" : err.message});
                    }
                    else
                    {
                        res.status(200).json({"message": "Participant found successfully.", "data": result});
                    }
                });
            }
            else
            {
                // Get all participants.
                sheetService.getParticipants(sheetReference, function(err, result)
                {
                    if(err)
                    {
                        res.status(500).json({"message" : "An error occurred while founding participants.", "data" : err.message});
                    }
                    else
                    {
                        res.status(200).json({"message" : "Participants found successfully.", "data" : result});
                    }
                });
            }
        }
    };
};
