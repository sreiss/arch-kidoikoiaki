/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var validator = require('validator');
var ArchParameterError = GLOBAL.ArchParameterError;

module.exports = function() {
    return {
        checkSaveParticipant: function(req, res, next)
        {
            // Get participant data.
            var participantData = req.body;

            // Check sheet id.
            var sheetId = participantData.prt_sheet || '';
            if(!validator.isMongoId(sheetId))
            {
                throw new ArchParameterError("Sheet ID isn't a valid MongoId.");
            }

            // Check participant firstname (length >= 3).
            var participantFirstName = participantData.prt_fname || '';
            if(!validator.isLength(participantFirstName, 3))
            {
                throw new ArchParameterError("Participant first name must contain at least 3 chars.")
            }

            // Check participant lastname (length >= 3).
            var participantLastName = participantData.prt_lname || '';
            if(!validator.isLength(participantLastName, 3))
            {
                throw new ArchParameterError("Participant last name must contain at least 3 chars.")
            }

            // Check participant email.
            var participantEmail = participantData.prt_email || '';
            if(!validator.isEmail(participantEmail))
            {
                throw new ArchParameterError("Participant email isn't a valid mail address.")
            }

            // Check participant share.
            var participantShare = participantData.prt_share || '';
            if(!validator.isInt(participantShare) || participantShare <= 0)
            {
                throw new ArchParameterError("Participant share must be an integer greater than 1.")
            }

            next();
        },

        checkUpdateParticipant: function(req, res, next)
        {
            // Get participant data.
            var participantData = req.body.participant;

            // Check sheet id.
            var sheetId = participantData.prt_sheet || '';
            if(!validator.isMongoId(sheetId))
            {
                throw new ArchParameterError("Sheet ID isn't a valid MongoId.");
            }

            // Check participant firstname (length >= 3).
            var participantFirstName = participantData.prt_fname || '';
            if(!validator.isLength(participantFirstName, 3))
            {
                throw new ArchParameterError("Participant first name must contain at least 3 chars.")
            }

            // Check participant lastname (length >= 3).
            var participantLastName = participantData.prt_lname || '';
            if(!validator.isLength(participantLastName, 3))
            {
                throw new ArchParameterError("Participant last name must contain at least 3 chars.")
            }

            // Check participant email.
            var participantEmail = participantData.prt_email || '';
            if(!validator.isEmail(participantEmail))
            {
                throw new ArchParameterError("Participant email isn't a valid mail address.")
            }

            // Check participant share.
            var participantShare = participantData.prt_share || '';
            if(!validator.isInt(participantShare) || participantShare <= 0)
            {
                throw new ArchParameterError("Participant share must be an integer greater than 1.")
            }

            next();
        },

        checkParticipantId: function(req, res, next)
        {
            // Get participant id.
            var participantId = req.params.participantId;
            if(!validator.isMongoId(participantId))
            {
                throw new ArchParameterError("Participant ID isn't a valid MongoId.");
            }

            next();
        }
    };
};
