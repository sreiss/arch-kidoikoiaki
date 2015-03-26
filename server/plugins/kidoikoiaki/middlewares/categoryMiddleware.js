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
        checkCategory: function(req, res, next)
        {
            // Get category data.
            var categoryData = req.body;

            // Check category name (length >= 3).
            var categoryName = categoryData.ctg_name || '';
            if(!validator.isLength(categoryName, 3))
            {
                throw new ArchParameterError("Category name must contain at least 3 chars.")
            }

            // Check category description (empty or length >= 10.
            var categoryDescription = categoryData.ctg_description || '';
            if(categoryDescription.length > 0 && !validator.isLength(categoryDescription, 10))
            {
                throw new ArchParameterError("Category name must contain at least 10 chars.")
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
