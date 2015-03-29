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
        checkTransaction: function(req, res, next)
        {
            // Get transaction data.
            var transactionData = req.body;

            // Check sheet id.
            var transactionSheetId = transactionData.trs_sheet || '';
            if(!validator.isMongoId(transactionSheetId))
            {
                throw new ArchParameterError("Sheet ID isn't a valid MongoId.");
            }

            // Check transaction description (empty or length >= 10).
            var transactionDescription = transactionData.trs_description || '';
            if(transactionDescription.length > 0 && !validator.isLength(transactionDescription, 10))
            {
                throw new ArchParameterError("Transaction description must contain at least 10 chars.")
            }

            // Check transaction amount.
            var transactionAmount = transactionData.trs_amount || '';
            if(!validator.isNumeric(transactionAmount) && transactionAmount > 0)
            {
                throw new ArchParameterError("Transaction amount must be numeric and greater than 0.")
            }

            // Check transaction contributor id.
            var transactionContributorId = transactionData.trs_contributor || '';
            if(!validator.isMongoId(transactionContributorId))
            {
                throw new ArchParameterError("Contributor ID isn't a valid MongoId.");
            }

            // Check transaction category id.
            var transactionCategoryId = transactionData.trs_sheet || '';
            if(!validator.isMongoId(transactionCategoryId))
            {
                throw new ArchParameterError("Category ID isn't a valid MongoId.");
            }

            // Check transaction category id.
            var transactionBeneficiaries = transactionData.trs_beneficiaries || [];
            for(var i = 0; i < transactionBeneficiaries.length; i++)
            {
                if(!validator.isMongoId(transactionBeneficiaries[i]))
                {
                    throw new ArchParameterError("Beneficiary ID isn't a valid MongoId.");
                }
            }

            // Check transaction weight.
            var transactionWeight = transactionData.trs_weight || '';
            if(!validator.isNumeric(transactionWeight) && transactionWeight > 0)
            {
                throw new ArchParameterError("Transaction weight must be numeric and greater than 0.")
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
