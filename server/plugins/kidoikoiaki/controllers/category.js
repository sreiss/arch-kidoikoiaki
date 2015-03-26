/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var ArchSaveError = GLOBAL.ArchSaveError;
var ArchDeleteError = GLOBAL.ArchDeleteError;
var ArchFindError = GLOBAL.ArchFindError;

module.exports = function(categoryService)
{
    return {
        /** Save category. */
        saveCategory: function(req, res)
        {
            // Get category data.
            var categoryData = req.body;

            // Saving category.
            categoryService.saveCategory(categoryData).then(function(category)
            {
                res.status(200).json({"count" : 1, "data" : category});
            },
            function(err)
            {
                throw new ArchSaveError(err.message);
            });
        },

        /** Delete category. */
        deleteCategory: function(req, res)
        {
            // Get categoryId.
            var categoryId = req.params.categoryId;

            // Saving category.
            categoryService.deleteCategory(categoryId).then(function(category)
            {
                res.status(200).json({"count" : 1, "data" : category});
            },
            function(err)
            {
                throw new ArchDeleteError(err.message);
            });
        },

        /** Get category. */
        getCategory: function(req, res)
        {
            // Get categoryId.
            var categoryId = req.params.categoryId;

            // Get category.
            categoryService.getCategory(categoryId).then(function (category)
            {
                res.status(200).json({"count": 1, "data": category});
            },
            function (err)
            {
                throw new ArchFindError(err.message);
            });
        },

        /** Get categories. */
        getCategories: function(req, res)
        {
            // Get categories.
            categoryService.getCategories().then(function(categories)
            {
                res.status(200).json({"count" : categories.length, "data" : categories});
            },
            function(err)
            {
                throw new ArchFindError(err.message);
            });
        }
    };
};
