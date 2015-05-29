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
        checkSaveCategory: function(req, res, next)
        {
            // Get category data.
            var categoryData = req.body;

            // Check sheet id.
            var categorySheet = categoryData.ctg_sheet || '';
            if(!validator.isMongoId(categorySheet))
            {
                throw new ArchParameterError("Category sheet ID isn't a valid MongoId.");
            }

            // Check category name not empty.
            var categoryName = categoryData.ctg_name || '';
            if(!validator.isLength(categoryName, 1))
            {
                throw new ArchParameterError("Category name can't be empty.")
            }

            next();
        },

        checkUpdateCategory: function(req, res, next)
        {
            // Get category data.
            var categoryData = req.body.category;

            // Check sheet id.
            var categorySheet = categoryData.ctg_sheet || '';
            if(!validator.isMongoId(categorySheet))
            {
                throw new ArchParameterError("Category sheet ID isn't a valid MongoId.");
            }

            // Check category name not empty.
            var categoryName = categoryData.ctg_name || '';
            if(!validator.isLength(categoryName, 1))
            {
                throw new ArchParameterError("Category name can't be empty.")
            }

            next();
        },

        checkCategoryId: function(req, res, next)
        {
            // Get category id.
            var categoryId = req.params.categoryId || '';
            if(!validator.isMongoId(categoryId))
            {
                throw new ArchParameterError("Category ID isn't a valid MongoId.");
            }

            next();
        }
    };
};
