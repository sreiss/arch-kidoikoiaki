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
                res.status(201).json({"count" : (category ? 1 : 0), "data" : category});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchSaveError(err.message)});
            });
        },

        /** Update category. */
        updateCategory: function(req, res)
        {
            // Get posted category.
            var category = req.body.category;

            // Saving user.
            categoryService.updateCategory(category).then(function(result)
            {
                res.status(200).json({"count": (result ? 1 : 0), "data": result});
            })
            .catch(function(err)
            {
                res.status(500).json({"error" : new ArchSaveError(err.message)});
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
                res.status(200).json({"count" : (category ? 1 : 0), "data" : category});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchDeleteError(err.message)});
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
                res.status(200).json({"count": (category ? 1 : 0), "data": category});
            },
            function (err)
            {
                res.status(500).json({"error" : new ArchFindError(err.message)});
            });
        }
    };
};
