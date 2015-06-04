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
        checkSaveTransaction: function(req, res, next)
        {
            // Get transaction data.
            var transactionData = req.body;

            // Check sheet id.
            var transactionSheetId = transactionData.trs_sheet || '';
            if(!validator.isMongoId(transactionSheetId))
            {
                throw new ArchParameterError("Sheet ID isn't a valid MongoId.");
            }

            // Check transaction amount.
            var transactionAmount = transactionData.trs_amount = parseFloat(transactionData.trs_amount || 0).toFixed(2);
            if(transactionAmount > 0 && !validator.isFloat(transactionAmount))
            {
                throw new ArchParameterError("Transaction amount must be numeric and greater than 0.")
            }

            // Check transaction contributor id.
            var transactionContributorId = transactionData.trs_contributor._id || '';
            if(!validator.isMongoId(transactionContributorId))
            {
                throw new ArchParameterError("Contributor ID isn't a valid MongoId.");
            }

            // Check transaction beneficiaries.
            var transactionBeneficiaries = transactionData.trs_beneficiaries || [];
            for(var i = 0; i < transactionBeneficiaries.length; i++)
            {
                if(!validator.isMongoId(transactionBeneficiaries[i].trs_participant))
                {
                    throw new ArchParameterError("Beneficiary ID isn't a valid MongoId.");
                }

                if(!validator.isNumeric(transactionBeneficiaries[i].trs_weight) && transactionBeneficiaries[i].trs_weight > 0)
                {
                    throw new ArchParameterError("Beneficiary weight must be numeric and greater than 0 (default 1).")
                }
            }

            next();
        },

        checkUpdateTransaction: function(req, res, next)
        {
            // Get transaction data.
            var transactionData = req.body.transaction;

            // Check sheet id.
            var transactionSheetId = transactionData.trs_sheet || '';
            if(!validator.isMongoId(transactionSheetId))
            {
                throw new ArchParameterError("Sheet ID isn't a valid MongoId.");
            }

            // Check transaction amount.
            var transactionAmount = transactionData.trs_amount = parseFloat(transactionData.trs_amount || 0).toFixed(2);
            if(transactionAmount > 0 && !validator.isFloat(transactionAmount))
            {
                throw new ArchParameterError("Transaction amount must be numeric and greater than 0.")
            }

            // Check transaction contributor id.
            var transactionContributorId = transactionData.trs_contributor._id || '';
            if(!validator.isMongoId(transactionContributorId))
            {
                throw new ArchParameterError("Contributor ID isn't a valid MongoId.");
            }

            // Check transaction beneficiaries.
            var transactionBeneficiaries = transactionData.trs_beneficiaries || [];
            for(var i = 0; i < transactionBeneficiaries.length; i++)
            {
                if(!validator.isMongoId(transactionBeneficiaries[i].trs_participant))
                {
                    throw new ArchParameterError("Beneficiary ID isn't a valid MongoId.");
                }

                if(!validator.isNumeric(transactionBeneficiaries[i].trs_weight) && transactionBeneficiaries[i].trs_weight > 0)
                {
                    throw new ArchParameterError("Beneficiary weight must be numeric and greater than 0 (default 1).")
                }
            }

            next();
        },

        checkTransactionId: function(req, res, next)
        {
            // Get transaction id.
            var transactionId = req.params.transactionId || '';
            if(!validator.isMongoId(transactionId))
            {
                throw new ArchParameterError("Transaction ID isn't a valid MongoId.");
            }

            next();
        }
    };
};
